import crypto from "node:crypto";

/**
 * Thin WhatsApp Business Cloud API client.
 * When WA_ACCESS_TOKEN / WA_PHONE_NUMBER_ID are not set the client runs in MOCK mode:
 * nothing is sent to Meta, calls succeed with fake ids, so the whole inbox can be developed
 * and tested without touching a live number.
 */
const VERSION = process.env.WA_GRAPH_VERSION ?? "v23.0";
const GRAPH = `https://graph.facebook.com/${VERSION}`;

export const waMode = (): "live" | "mock" =>
  process.env.WA_ACCESS_TOKEN && process.env.WA_PHONE_NUMBER_ID ? "live" : "mock";

export class WaError extends Error {
  code?: number;
  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
  }
}

function friendly(message: string, code?: number): string {
  if (code === 131047) return "More than 24 hours since the customer last messaged — send an approved template instead.";
  if (code === 131026) return "Message undeliverable — the number may not be on WhatsApp.";
  if (code === 131056) return "Sending too fast to this number — try again shortly.";
  if (code === 130429) return "Rate limit reached — try again in a moment.";
  return message;
}

async function graph<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
    ...(init.headers as Record<string, string> | undefined),
  };
  let body = init.body;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  const res = await fetch(`${GRAPH}${path}`, { ...init, headers, body });
  const data = (await res.json().catch(() => ({}))) as { error?: { message: string; code?: number; error_user_msg?: string; error_data?: { details?: string } } };
  if (!res.ok || data.error) {
    const e = data.error;
    throw new WaError(
      `${friendly(e?.error_user_msg ?? e?.message ?? `WhatsApp API error ${res.status}`, e?.code)}${e?.error_data?.details ? ` — ${e.error_data.details}` : ""}`,
      e?.code,
    );
  }
  return data as T;
}

const mockId = () => {
  // Never pretend to send in production: a missing token must be loud, not silent.
  if (process.env.NODE_ENV === "production") {
    throw new WaError("WhatsApp isn't connected yet. Add WA_ACCESS_TOKEN and WA_PHONE_NUMBER_ID in your hosting settings.");
  }
  return `mock.${crypto.randomUUID()}`;
};

/** Normalises user-entered phone numbers to WhatsApp ids (digits only, country code included). */
export function normalizeWaId(input: string, defaultCountry = "91"): string | null {
  let d = input.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (d.length === 10) d = defaultCountry + d;
  else if (d.length === 11 && d.startsWith("0")) d = defaultCountry + d.slice(1);
  return /^\d{10,15}$/.test(d) ? d : null;
}

interface SendResult {
  messages: Array<{ id: string }>;
}

async function send(payload: Record<string, unknown>): Promise<string> {
  if (waMode() === "mock") return mockId();
  const r = await graph<SendResult>(`/${process.env.WA_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    json: { messaging_product: "whatsapp", recipient_type: "individual", ...payload },
  });
  return r.messages[0].id;
}

const ctx = (replyTo?: string | null) => (replyTo ? { context: { message_id: replyTo } } : {});

export const sendText = (to: string, body: string, replyTo?: string | null) =>
  send({ to, type: "text", text: { body, preview_url: true }, ...ctx(replyTo) });

export type MediaKind = "image" | "video" | "audio" | "document";

export const sendMedia = (
  to: string,
  kind: MediaKind,
  media: { id?: string; link?: string; caption?: string; filename?: string },
  replyTo?: string | null,
) =>
  send({
    to,
    type: kind,
    [kind]: {
      ...(media.id ? { id: media.id } : { link: media.link }),
      ...(media.caption && kind !== "audio" ? { caption: media.caption } : {}),
      ...(kind === "document" && media.filename ? { filename: media.filename } : {}),
    },
    ...ctx(replyTo),
  });

export const sendReaction = (to: string, messageId: string, emoji: string) =>
  send({ to, type: "reaction", reaction: { message_id: messageId, emoji } });

export const sendLocation = (
  to: string,
  loc: { latitude: number; longitude: number; name?: string; address?: string },
) => send({ to, type: "location", location: loc });

export const sendTemplate = (
  to: string,
  name: string,
  language: string,
  bodyParams: string[] = [],
  headerImageLink?: string,
) => {
  const components: unknown[] = [];
  if (headerImageLink) components.push({ type: "header", parameters: [{ type: "image", image: { link: headerImageLink } }] });
  if (bodyParams.length) components.push({ type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) });
  return send({ to, type: "template", template: { name, language: { code: language }, ...(components.length ? { components } : {}) } });
};

export const sendInteractiveButtons = (
  to: string,
  body: string,
  buttons: Array<{ id: string; title: string }>,
  headerImageLink?: string,
) =>
  send({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      ...(headerImageLink ? { header: { type: "image", image: { link: headerImageLink } } } : {}),
      body: { text: body },
      action: { buttons: buttons.map((b) => ({ type: "reply", reply: b })) },
    },
  });

export const sendInteractiveList = (
  to: string,
  body: string,
  buttonLabel: string,
  rows: Array<{ id: string; title: string; description?: string }>,
) =>
  send({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: body },
      action: { button: buttonLabel, sections: [{ title: "Options", rows }] },
    },
  });

export interface CarouselCard { imageLink: string; params: string[]; detailsPayload: string; samplePayload: string }

/** Media-card carousel template: the only way WhatsApp supports horizontally scrolling cards. */
export const sendCarousel = (to: string, name: string, language: string, cards: CarouselCard[]) =>
  send({
    to,
    type: "template",
    template: {
      name,
      language: { code: language },
      components: [
        {
          type: "carousel",
          cards: cards.map((c, i) => ({
            card_index: i,
            components: [
              { type: "header", parameters: [{ type: "image", image: { link: c.imageLink } }] },
              { type: "body", parameters: c.params.map((text) => ({ type: "text", text })) },
              { type: "button", sub_type: "quick_reply", index: "0", parameters: [{ type: "payload", payload: c.detailsPayload }] },
              { type: "button", sub_type: "quick_reply", index: "1", parameters: [{ type: "payload", payload: c.samplePayload }] },
            ],
          })),
        },
      ],
    },
  });

/** Uploads an example image with Meta's resumable-upload API; returns the handle templates need for header examples. */
export async function uploadTemplateExample(imageUrl: string): Promise<string> {
  const appId = process.env.WA_APP_ID;
  if (!appId) throw new WaError("WA_APP_ID is not set (your Meta app's ID).");
  const img = await fetch(imageUrl);
  if (!img.ok) throw new WaError(`Could not fetch the example image (${img.status})`);
  const bytes = Buffer.from(await img.arrayBuffer());
  const session = await graph<{ id: string }>(
    `/${appId}/uploads?file_length=${bytes.length}&file_type=image/jpeg&file_name=example.jpg`,
    { method: "POST" },
  );
  const res = await fetch(`${GRAPH}/${session.id}`, {
    method: "POST",
    headers: { Authorization: `OAuth ${process.env.WA_ACCESS_TOKEN}`, file_offset: "0" },
    body: new Uint8Array(bytes),
  });
  const data = (await res.json().catch(() => ({}))) as { h?: string; error?: { message: string } };
  if (!res.ok || !data.h) throw new WaError(data.error?.message ?? "Could not upload the example image");
  return data.h;
}

export async function markRead(messageId: string): Promise<void> {
  if (waMode() === "mock") return;
  await graph(`/${process.env.WA_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    json: { messaging_product: "whatsapp", status: "read", message_id: messageId },
  }).catch(() => undefined);
}

/** Uploads a file to Meta and returns its media id (needed to send local files). */
export async function uploadMedia(data: Buffer, mime: string, filename: string): Promise<string> {
  if (waMode() === "mock") return mockId();
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", mime);
  form.append("file", new Blob([new Uint8Array(data)], { type: mime }), filename);
  const r = await graph<{ id: string }>(`/${process.env.WA_PHONE_NUMBER_ID}/media`, { method: "POST", body: form });
  return r.id;
}

/** Downloads an inbound media file by its Meta media id. */
export async function downloadMedia(mediaId: string): Promise<{ data: Buffer; mime: string }> {
  const meta = await graph<{ url: string; mime_type: string }>(`/${mediaId}`);
  const res = await fetch(meta.url, { headers: { Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}` } });
  if (!res.ok) throw new WaError(`Could not download media (${res.status})`);
  return { data: Buffer.from(await res.arrayBuffer()), mime: meta.mime_type };
}

/** Constant-time check of Meta's X-Hub-Signature-256 header. Skipped only if no app secret is set. */
export function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.WA_APP_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!header?.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const got = header.slice(7);
  return got.length === expected.length && crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

// ---- Template management (needs WA_WABA_ID) ----

export interface MetaTemplate {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  components: unknown[];
  rejected_reason?: string;
}

export async function listMetaTemplates(): Promise<MetaTemplate[]> {
  if (waMode() === "mock" || !process.env.WA_WABA_ID) return [];
  const out: MetaTemplate[] = [];
  let next: string | null = `/${process.env.WA_WABA_ID}/message_templates?limit=100&fields=id,name,language,category,status,components,rejected_reason`;
  while (next) {
    const r: { data: MetaTemplate[]; paging?: { next?: string } } = await graph(next);
    out.push(...r.data);
    next = r.paging?.next ? r.paging.next.replace(GRAPH, "") : null;
  }
  return out;
}

export async function createMetaTemplate(t: {
  name: string;
  language: string;
  category: string;
  components: unknown[];
}): Promise<{ id: string; status: string }> {
  if (waMode() === "mock" || !process.env.WA_WABA_ID) return { id: mockId(), status: "PENDING" };
  return graph(`/${process.env.WA_WABA_ID}/message_templates`, { method: "POST", json: t });
}

export async function deleteMetaTemplate(name: string): Promise<void> {
  if (waMode() === "mock" || !process.env.WA_WABA_ID) return;
  await graph(`/${process.env.WA_WABA_ID}/message_templates?name=${encodeURIComponent(name)}`, { method: "DELETE" });
}
