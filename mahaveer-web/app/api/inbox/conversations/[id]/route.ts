import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { getConversation } from "@/lib/inbox/queries";
import { query, queryOne } from "@/lib/inbox/db";
import type { ContactItem } from "@/lib/inbox/types";

type P = { id: string };

export const GET = route<P>(async ({ params }) => {
  const conversation = await getConversation(params.id);
  if (!conversation) throw new HttpError("Chat not found", 404);
  const contact = await queryOne<ContactItem>("select * from contacts where id = $1", [conversation.contact_id]);
  const notes = await query(
    `select n.id, n.body, n.created_at, u.name as user_name from notes n left join users u on u.id = n.user_id
     where n.conversation_id = $1 order by n.created_at desc`,
    [params.id],
  );
  const samples = await query(
    "select id, product_name, status, created_at, name, email, location from sample_requests where contact_id = $1 order by created_at desc",
    [conversation.contact_id],
  );
  return { conversation, contact, notes, samples };
});

const patch = z.object({
  pinned: z.boolean().optional(),
  status: z.enum(["open", "resolved"]).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  bot_paused: z.boolean().optional(),
  needs_human: z.boolean().optional(),
});

export const PATCH = route<P>(async ({ req, params }) => {
  const b = await body(req, patch);
  const sets: string[] = [];
  const vals: unknown[] = [params.id];
  for (const [k, v] of Object.entries(b)) {
    if (v === undefined) continue;
    vals.push(v);
    sets.push(`${k} = $${vals.length}`);
  }
  // Handing the chat back to the bot also clears the "needs a human" flag.
  if (b.bot_paused === false && b.needs_human === undefined) sets.push("needs_human = false");
  if (!sets.length) return { conversation: await getConversation(params.id) };
  await query(`update conversations set ${sets.join(", ")} where id = $1`, vals);
  return { conversation: await getConversation(params.id) };
});
