import { query, queryOne } from "./db";
import type { ConversationItem, MessageItem } from "./types";

export type ChatFilter = "all" | "unread" | "open" | "resolved" | "bot" | "human" | "mine" | "unassigned";

const CONV_SELECT = `
  select v.id, v.contact_id, c.wa_id, c.name, c.profile_name, v.status, v.assigned_to, u.name as assignee_name,
    v.bot_paused, v.needs_human, v.pinned, v.unread_count, v.last_message_at, v.last_message_preview,
    v.last_message_direction, v.last_inbound_at,
    coalesce((select json_agg(json_build_object('id', l.id, 'name', l.name, 'color', l.color) order by l.name)
              from conversation_labels cl join labels l on l.id = cl.label_id where cl.conversation_id = v.id), '[]'::json) as labels
  from conversations v
  join contacts c on c.id = v.contact_id
  left join users u on u.id = v.assigned_to`;

export async function listConversations(opts: {
  filter?: ChatFilter;
  search?: string;
  labelId?: string;
  userId: string;
  limit?: number;
  offset?: number;
}): Promise<ConversationItem[]> {
  const where: string[] = ["v.last_message_at is not null"];
  const params: unknown[] = [];
  const p = (v: unknown) => {
    params.push(v);
    return `$${params.length}`;
  };

  switch (opts.filter) {
    case "unread": where.push("v.unread_count > 0"); break;
    case "open": where.push("v.status = 'open'"); break;
    case "resolved": where.push("v.status = 'resolved'"); break;
    case "bot": where.push("v.status = 'open' and not v.bot_paused and not v.needs_human"); break;
    case "human": where.push("(v.needs_human or v.bot_paused) and v.status = 'open'"); break;
    case "mine": where.push(`v.assigned_to = ${p(opts.userId)}`); break;
    case "unassigned": where.push("v.assigned_to is null and v.status = 'open'"); break;
  }
  if (opts.labelId) where.push(`exists (select 1 from conversation_labels x where x.conversation_id = v.id and x.label_id = ${p(opts.labelId)})`);
  const s = opts.search?.trim();
  if (s) {
    const like = p(`%${s}%`);
    where.push(`(c.name ilike ${like} or c.profile_name ilike ${like} or c.wa_id ilike ${like}
      or exists (select 1 from messages m where m.conversation_id = v.id and m.body ilike ${like}))`);
  }

  const limit = p(Math.min(opts.limit ?? 100, 200));
  const offset = p(opts.offset ?? 0);
  return query<ConversationItem>(
    `${CONV_SELECT} where ${where.join(" and ")}
     order by v.pinned desc, v.last_message_at desc nulls last limit ${limit} offset ${offset}`,
    params,
  );
}

export async function getConversation(id: string): Promise<ConversationItem | null> {
  return queryOne<ConversationItem>(`${CONV_SELECT} where v.id = $1`, [id]);
}

const MSG_SELECT = `
  select m.id, m.conversation_id, m.wa_message_id, m.direction, m.sender_type, us.name as sender_name, m.type, m.body, m.caption,
    m.media_id, m.media_path, m.mime_type, m.filename, m.location, m.contacts, m.interactive, m.template_name, m.reply_to_wa_id,
    case when r.id is null then null else json_build_object(
      'body', coalesce(r.body, r.caption, '[' || r.type || ']'), 'direction', r.direction, 'type', r.type) end as reply_preview,
    m.reactions, m.status, m.error, m.created_at
  from messages m
  left join users us on us.id = m.sender_user_id
  left join messages r on r.wa_message_id = m.reply_to_wa_id and r.conversation_id = m.conversation_id`;

export async function getMessages(conversationId: string, opts: { before?: string; limit?: number } = {}): Promise<MessageItem[]> {
  const limit = Math.min(opts.limit ?? 80, 300);
  const rows = await query<MessageItem>(
    `${MSG_SELECT} where m.conversation_id = $1 ${opts.before ? "and m.created_at < $3" : ""}
     order by m.created_at desc limit $2`,
    opts.before ? [conversationId, limit, opts.before] : [conversationId, limit],
  );
  return rows.reverse();
}

export async function getMessage(id: string): Promise<MessageItem | null> {
  return queryOne<MessageItem>(`${MSG_SELECT} where m.id = $1`, [id]);
}

/** Zero the unread badge; returns the newest inbound WhatsApp message id (for the blue-tick read receipt). */
export async function markConversationRead(id: string): Promise<string | null> {
  await query("update conversations set unread_count = 0 where id = $1", [id]);
  const m = await queryOne<{ wa_message_id: string | null }>(
    "select wa_message_id from messages where conversation_id = $1 and direction = 'in' order by created_at desc limit 1",
    [id],
  );
  return m?.wa_message_id ?? null;
}
