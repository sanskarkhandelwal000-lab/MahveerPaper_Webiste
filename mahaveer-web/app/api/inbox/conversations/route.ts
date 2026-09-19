import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { listConversations, getConversation, type ChatFilter } from "@/lib/inbox/queries";
import { getOrCreateConversation, upsertContact } from "@/lib/inbox/messages";
import { normalizeWaId } from "@/lib/inbox/wa";
import { query } from "@/lib/inbox/db";

export const GET = route(async ({ req, user }) => {
  const sp = req.nextUrl.searchParams;
  return {
    conversations: await listConversations({
      filter: (sp.get("filter") as ChatFilter) || "all",
      search: sp.get("q") ?? undefined,
      labelId: sp.get("label") ?? undefined,
      userId: user.id,
      limit: Number(sp.get("limit")) || 100,
      offset: Number(sp.get("offset")) || 0,
    }),
  };
});

const newChat = z.object({ phone: z.string().min(5), name: z.string().optional() });

/** "New chat": find or create the conversation for a phone number. */
export const POST = route(async ({ req }) => {
  const { phone, name } = await body(req, newChat);
  const waId = normalizeWaId(phone);
  if (!waId) throw new HttpError("That doesn't look like a valid phone number. Include the country code, e.g. +91 98765 43210.");
  const contact = await upsertContact(waId);
  if (name?.trim()) await query("update contacts set name = $2 where id = $1 and name is null", [contact.id, name.trim()]);
  const id = await getOrCreateConversation(contact.id);
  return { id, conversation: (await getConversation(id))! };
});
