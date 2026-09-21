import { query, queryOne, json } from "./db";
import * as wa from "./wa";
import { getFile, putFile, extFor } from "./storage";
import { windowOpen, type MessageItem } from "./types";

/** Loose shape of a WhatsApp Cloud API inbound message object. */
export interface WaInbound {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  video?: { id: string; mime_type: string; caption?: string };
  audio?: { id: string; mime_type: string };
  document?: { id: string; mime_type: string; filename?: string; caption?: string };
  sticker?: { id: string; mime_type: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  contacts?: unknown[];
  button?: { text: string; payload: string };
  interactive?: {
    type: string;
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  reaction?: { message_id: string; emoji?: string };
  context?: { id?: string };
}

export class WindowClosedError extends Error {
  constructor() {
    super("More than 24 hours since the customer last messaged — send an approved template instead.");
  }
}

// ---------- contacts / conversations ----------

export async function upsertContact(waId: string, profileName?: string | null) {
  const rows = await query<{ id: string; blocked: boolean }>(
    `insert into contacts (wa_id, profile_name) values ($1, $2)
     on conflict (wa_id) do update set profile_name = coalesce(excluded.profile_name, contacts.profile_name), updated_at = now()
     returning id, blocked`,
    [waId, profileName ?? null],
  );
  return rows[0];
}

export async function getOrCreateConversation(contactId: string): Promise<string> {
  const rows = await query<{ id: string }>(
    `insert into conversations (contact_id) values ($1)
     on conflict (contact_id) do update set contact_id = excluded.contact_id returning id`,
    [contactId],
  );
  return rows[0].id;
}

export async function conversationForWaId(waId: string): Promise<string> {
  const c = await upsertContact(waId);
  return getOrCreateConversation(c.id);
}

// ---------- inbound ----------

export function previewOf(m: { type: string; body?: string | null; caption?: string | null }): string {
  if (m.body) return m.body;
  if (m.caption) return m.caption;
  const icons: Record<string, string> = {
    image: "📷 Photo", video: "🎥 Video", audio: "🎵 Audio", document: "📄 Document", sticker: "Sticker",
    location: "📍 Location", contacts: "👤 Contact", template: "Template message", interactive: "Message",
  };
  return icons[m.type] ?? "Message";
}

export interface InboundResult {
  conversationId: string;
  contactId: string;
  messageId: string;
  waId: string;
  text: string;
  buttonId: string | null;
  botPaused: boolean;
  needsHuman: boolean;
}

/** Stores an inbound message. Returns null for duplicates (Meta retries webhooks). */
export async function recordInbound(m: WaInbound, profileName?: string | null): Promise<InboundResult | null> {
  if (m.type === "reaction" && m.reaction) {
    await applyCustomerReaction(m.reaction.message_id, m.reaction.emoji ?? "");
    return null;
  }

  const contact = await upsertContact(m.from, profileName);
  const conversationId = await getOrCreateConversation(contact.id);

  let body: string | null = null;
  let caption: string | null = null;
  let mediaId: string | null = null;
  let mime: string | null = null;
  let filename: string | null = null;
  let type = m.type;
  let buttonId: string | null = null;
  const interactive: unknown = null;

  switch (m.type) {
    case "text": body = m.text?.body ?? ""; break;
    case "image": mediaId = m.image!.id; mime = m.image!.mime_type; caption = m.image!.caption ?? null; break;
    case "video": mediaId = m.video!.id; mime = m.video!.mime_type; caption = m.video!.caption ?? null; break;
    case "audio": mediaId = m.audio!.id; mime = m.audio!.mime_type; break;
    case "sticker": mediaId = m.sticker!.id; mime = m.sticker!.mime_type; break;
    case "document":
      mediaId = m.document!.id; mime = m.document!.mime_type; filename = m.document!.filename ?? null;
      caption = m.document!.caption ?? null; break;
    case "button": body = m.button?.text ?? ""; buttonId = m.button?.payload ?? null; type = "text"; break;
    case "interactive": {
      const r = m.interactive?.button_reply ?? m.interactive?.list_reply;
      body = r?.title ?? ""; buttonId = r?.id ?? null; type = "text"; break;
    }
    case "location": case "contacts": break;
    default: body = "This message type isn't supported in the inbox yet."; type = "unsupported";
  }

  const ts = Number(m.timestamp);
  const createdAt = Number.isFinite(ts) && ts > 0 ? new Date(ts * 1000).toISOString() : new Date().toISOString();

  const rows = await query<{ id: string }>(
    `insert into messages (conversation_id, wa_message_id, direction, sender_type, type, body, caption, media_id, mime_type,
       filename, location, contacts, interactive, reply_to_wa_id, status, created_at)
     values ($1,$2,'in','customer',$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12,'delivered',$13)
     on conflict (wa_message_id) do nothing returning id`,
    [
      conversationId, m.id, type, body, caption, mediaId, mime, filename,
      json(m.location ?? null), json(m.contacts ?? null), json(interactive), m.context?.id ?? null, createdAt,
    ],
  );
  if (!rows.length) return null;

  const conv = await queryOne<{ bot_paused: boolean; needs_human: boolean }>(
    `update conversations set unread_count = unread_count + 1, last_message_at = $2,
       last_message_preview = $3, last_message_direction = 'in', last_inbound_at = $2, status = 'open'
     where id = $1 returning bot_paused, needs_human`,
    [conversationId, createdAt, previewOf({ type, body, caption })],
  );

  return {
    conversationId,
    contactId: contact.id,
    messageId: rows[0].id,
    waId: m.from,
    text: body ?? caption ?? "",
    buttonId,
    botPaused: conv?.bot_paused ?? false,
    needsHuman: conv?.needs_human ?? false,
  };
}

/** Downloads inbound media from Meta into our storage and links it to the message row. */
export async function storeInboundMedia(messageId: string, mediaId: string, filename?: string | null): Promise<void> {
  try {
    const { data, mime } = await wa.downloadMedia(mediaId);
    if (data.length > 20 * 1024 * 1024) return; // too big to keep; the media route re-fetches it from Meta on demand
    const p = await putFile(`in/${messageId}.${extFor(mime, filename)}`, data, mime);
    await query("update messages set media_path = $2, mime_type = $3 where id = $1", [messageId, p, mime]);
  } catch (e) {
    console.error("inbox: media download failed", mediaId, e);
  }
}

// ---------- status callbacks ----------

const RANK: Record<string, number> = { queued: 0, sent: 1, delivered: 2, read: 3 };

export async function applyStatus(s: {
  id: string;
  status: string;
  errors?: Array<{ code?: number; title?: string; message?: string }>;
}): Promise<void> {
  const status = s.status === "failed" ? "failed" : s.status;
  if (!["sent", "delivered", "read", "failed"].includes(status)) return;
  const err = s.errors?.[0];
  const error = err ? `${err.title ?? err.message ?? "Failed"}${err.code ? ` (${err.code})` : ""}` : null;

  if (status === "failed") {
    await query("update messages set status = 'failed', error = $2 where wa_message_id = $1", [s.id, error]);
    await query("update campaign_recipients set status = 'failed', error = $2 where wa_message_id = $1", [s.id, error]);
    await fallbackFailedCarousel(s.id);
    return;
  }
  const rank = RANK[status];
  await query(
    `update messages set status = $2 where wa_message_id = $1
       and case status when 'queued' then 0 when 'sent' then 1 when 'delivered' then 2 when 'read' then 3 else 9 end < $3`,
    [s.id, status, rank],
  );
  await query(
    `update campaign_recipients set status = $2,
       delivered_at = case when $2 in ('delivered','read') then coalesce(delivered_at, now()) else delivered_at end,
       read_at = case when $2 = 'read' then coalesce(read_at, now()) else read_at end
     where wa_message_id = $1
       and case status when 'pending' then 0 when 'sent' then 1 when 'delivered' then 2 when 'read' then 3 else 9 end < $3`,
    [s.id, status, rank],
  );
}

/**
 * WhatsApp often refuses a template only after accepting it (payment problem, per-user marketing limit…).
 * When a bot carousel fails that way, send the same products as ordinary single cards so the customer isn't left with nothing.
 */
async function fallbackFailedCarousel(waMessageId: string): Promise<void> {
  const row = await queryOne<{ conversation_id: string; interactive: { carousel?: string[]; fallback?: boolean } | null }>(
    `select conversation_id, interactive from messages
      where wa_message_id = $1 and template_name like 'product\\_carousel\\_%' and sender_type = 'bot'`,
    [waMessageId],
  );
  const ids = row?.interactive?.carousel;
  if (!row || !ids?.length || row.interactive?.fallback) return;
  await query("update messages set interactive = interactive || '{\"fallback\": true}'::jsonb where wa_message_id = $1", [waMessageId]);
  const { sendProductCards } = await import("./bot");
  await sendProductCards(row.conversation_id, ids);
}

async function applyCustomerReaction(targetWaId: string, emoji: string): Promise<void> {
  await setReaction(targetWaId, "customer", emoji);
}

async function setReaction(targetWaId: string, from: "customer" | "agent", emoji: string): Promise<void> {
  const row = await queryOne<{ id: string; reactions: Array<{ from: string; emoji: string }> }>(
    "select id, reactions from messages where wa_message_id = $1",
    [targetWaId],
  );
  if (!row) return;
  const next = row.reactions.filter((r) => r.from !== from);
  if (emoji) next.push({ from, emoji });
  await query("update messages set reactions = $2::jsonb where id = $1", [row.id, json(next)]);
}

// ---------- outbound ----------

export type OutboundSpec =
  | { kind: "text"; body: string }
  | { kind: "media"; mediaKind: wa.MediaKind; mediaPath: string; mime: string; filename: string; caption?: string }
  | { kind: "template"; templateId: string; params: string[] }
  | { kind: "location"; latitude: number; longitude: number; name?: string; address?: string }
  | { kind: "interactive"; body: string; buttons: Array<{ id: string; title: string }>; imageLink?: string }
  | { kind: "list"; body: string; buttonLabel: string; rows: Array<{ id: string; title: string }> }
  | { kind: "carousel"; templateName: string; language: string; summary: string; productIds: string[]; cards: wa.CarouselCard[] };

export interface OutboundOpts {
  conversationId: string;
  senderType: "agent" | "bot" | "campaign" | "system";
  userId?: string | null;
  replyToWaId?: string | null;
  /** Campaign sends and templates are allowed outside the 24h window. */
  skipWindowCheck?: boolean;
}

export async function sendOutbound(spec: OutboundSpec, opts: OutboundOpts): Promise<MessageItem> {
  const conv = await queryOne<{ wa_id: string; last_inbound_at: string | null; blocked: boolean }>(
    `select c.wa_id, v.last_inbound_at, c.blocked from conversations v join contacts c on c.id = v.contact_id where v.id = $1`,
    [opts.conversationId],
  );
  if (!conv) throw new Error("Conversation not found");
  if (conv.blocked) throw new Error("This contact is blocked");

  const isTemplate = spec.kind === "template" || spec.kind === "carousel";
  if (!isTemplate && !opts.skipWindowCheck && !windowOpen(conv.last_inbound_at)) throw new WindowClosedError();

  const to = conv.wa_id;
  let waId: string | null = null;
  let error: string | null = null;
  let mediaId: string | null = null;
  const row: Record<string, unknown> = { type: spec.kind === "media" ? spec.mediaKind : spec.kind === "list" ? "interactive" : spec.kind === "carousel" ? "template" : spec.kind };

  try {
    switch (spec.kind) {
      case "text":
        row.body = spec.body;
        waId = await wa.sendText(to, spec.body, opts.replyToWaId);
        break;
      case "media": {
        const data = await getFile(spec.mediaPath);
        if (!data) throw new Error("Attachment file is missing");
        mediaId = await wa.uploadMedia(data, spec.mime, spec.filename);
        row.caption = spec.caption ?? null;
        row.media_path = spec.mediaPath;
        row.mime_type = spec.mime;
        row.filename = spec.filename;
        waId = await wa.sendMedia(to, spec.mediaKind, { id: mediaId, caption: spec.caption, filename: spec.filename }, opts.replyToWaId);
        break;
      }
      case "template": {
        const t = await queryOne<{ name: string; language: string; status: string; components: Array<{ type: string; text?: string }> }>(
          "select name, language, status, components from templates where id = $1",
          [spec.templateId],
        );
        if (!t) throw new Error("Template not found");
        if (t.status !== "APPROVED") throw new Error(`Template "${t.name}" is not approved yet (${t.status})`);
        row.template_name = t.name;
        const bodyText = t.components.find((c) => c.type === "BODY")?.text ?? "";
        row.body = bodyText.replace(/\{\{(\d+)\}\}/g, (_, n: string) => spec.params[Number(n) - 1] ?? "");
        waId = await wa.sendTemplate(to, t.name, t.language, spec.params);
        break;
      }
      case "location":
        row.location = { latitude: spec.latitude, longitude: spec.longitude, name: spec.name, address: spec.address };
        waId = await wa.sendLocation(to, spec);
        break;
      case "interactive":
        row.body = spec.body;
        row.interactive = { buttons: spec.buttons.map((b) => b.title) };
        waId = await wa.sendInteractiveButtons(to, spec.body, spec.buttons, spec.imageLink);
        break;
      case "carousel":
        row.template_name = spec.templateName;
        row.body = spec.summary;
        row.interactive = { carousel: spec.productIds };
        waId = await wa.sendCarousel(to, spec.templateName, spec.language, spec.cards);
        break;
      case "list":
        row.body = spec.body;
        row.interactive = { buttons: spec.rows.map((r) => r.title) };
        waId = await wa.sendInteractiveList(to, spec.body, spec.buttonLabel, spec.rows);
        break;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Send failed";
    if (e instanceof WindowClosedError) throw e;
  }

  const inserted = await query<{ id: string }>(
    `insert into messages (conversation_id, wa_message_id, direction, sender_type, sender_user_id, type, body, caption, media_id,
       media_path, mime_type, filename, location, interactive, template_name, reply_to_wa_id, status, error)
     values ($1,$2,'out',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14,$15,$16,$17) returning id`,
    [
      opts.conversationId, waId, opts.senderType, opts.userId ?? null, row.type, row.body ?? null, row.caption ?? null, mediaId,
      row.media_path ?? null, row.mime_type ?? null, row.filename ?? null, json(row.location ?? null), json(row.interactive ?? null),
      row.template_name ?? null, opts.replyToWaId ?? null, error ? "failed" : "sent", error,
    ],
  );

  await query(
    `update conversations set last_message_at = now(), last_message_preview = $2, last_message_direction = 'out' where id = $1`,
    [opts.conversationId, previewOf({ type: String(row.type), body: row.body as string, caption: row.caption as string })],
  );

  // Mock mode: simulate delivery/read receipts so the UI can be exercised without a live number.
  if (waId && wa.waMode() === "mock") {
    const id = waId;
    if (!error) {
      setTimeout(() => void applyStatus({ id, status: "delivered" }).catch(() => undefined), 1200);
      setTimeout(() => void applyStatus({ id, status: "read" }).catch(() => undefined), 3500);
    }
  }

  const { getMessage } = await import("./queries");
  return (await getMessage(inserted[0].id))!;
}

export async function reactToMessage(messageId: string, emoji: string): Promise<void> {
  const m = await queryOne<{ wa_message_id: string | null; wa_id: string; direction: string }>(
    `select m.wa_message_id, c.wa_id, m.direction from messages m
       join conversations v on v.id = m.conversation_id join contacts c on c.id = v.contact_id where m.id = $1`,
    [messageId],
  );
  if (!m?.wa_message_id) throw new Error("Message can't be reacted to");
  await wa.sendReaction(m.wa_id, m.wa_message_id, emoji);
  await setReaction(m.wa_message_id, "agent", emoji);
}
