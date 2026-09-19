/** Client-safe shared types for the inbox (no server imports here). */

export type MsgStatus = "queued" | "sent" | "delivered" | "read" | "failed";
export type SenderType = "customer" | "bot" | "agent" | "campaign" | "system";
export type Role = "admin" | "agent";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ConversationItem {
  id: string;
  contact_id: string;
  wa_id: string;
  name: string | null;
  profile_name: string | null;
  status: "open" | "resolved";
  assigned_to: string | null;
  assignee_name: string | null;
  bot_paused: boolean;
  needs_human: boolean;
  pinned: boolean;
  unread_count: number;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_direction: "in" | "out" | null;
  last_inbound_at: string | null;
  labels: Label[];
}

export interface Reaction {
  from: "customer" | "agent";
  emoji: string;
}

export interface MessageItem {
  id: string;
  conversation_id: string;
  wa_message_id: string | null;
  direction: "in" | "out";
  sender_type: SenderType;
  sender_name: string | null;
  type: string;
  body: string | null;
  caption: string | null;
  media_id: string | null;
  media_path: string | null;
  mime_type: string | null;
  filename: string | null;
  location: { latitude: number; longitude: number; name?: string; address?: string } | null;
  contacts: Array<{ name?: { formatted_name?: string }; phones?: Array<{ phone?: string }> }> | null;
  interactive: { buttons?: string[] } | null;
  template_name: string | null;
  reply_to_wa_id: string | null;
  reply_preview: { body: string; direction: "in" | "out"; type: string } | null;
  reactions: Reaction[];
  status: MsgStatus;
  error: string | null;
  created_at: string;
}

export interface ContactItem {
  id: string;
  wa_id: string;
  name: string | null;
  profile_name: string | null;
  email: string | null;
  location: string | null;
  company: string | null;
  tags: string[];
  opted_in: boolean;
  blocked: boolean;
  created_at: string;
  conversation_id?: string | null;
}

export interface NoteItem {
  id: string;
  body: string;
  user_name: string | null;
  created_at: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  components: Array<{ type: string; text?: string; format?: string; buttons?: Array<{ type: string; text: string; url?: string }> }>;
  rejected_reason: string | null;
}

export interface UserItem {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
}

export const displayName = (c: { name?: string | null; profile_name?: string | null; wa_id: string }) =>
  c.name || c.profile_name || `+${c.wa_id}`;

/** Free-form messages are only allowed within 24h of the customer's last message. */
export const WINDOW_MS = 24 * 60 * 60 * 1000;
export function windowOpen(lastInboundAt: string | null): boolean {
  return !!lastInboundAt && Date.now() - new Date(lastInboundAt).getTime() < WINDOW_MS;
}
