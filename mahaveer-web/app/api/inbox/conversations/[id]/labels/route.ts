import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";
import { getConversation } from "@/lib/inbox/queries";

/** Replaces the label set on a conversation. */
export const PUT = route<{ id: string }>(async ({ req, params }) => {
  const { labelIds } = await body(req, z.object({ labelIds: z.array(z.string().uuid()) }));
  await query("delete from conversation_labels where conversation_id = $1", [params.id]);
  for (const id of labelIds) {
    await query("insert into conversation_labels (conversation_id, label_id) values ($1,$2) on conflict do nothing", [params.id, id]);
  }
  return { conversation: await getConversation(params.id) };
});
