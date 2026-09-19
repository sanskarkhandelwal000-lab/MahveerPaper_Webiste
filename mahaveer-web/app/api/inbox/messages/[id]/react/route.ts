import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { reactToMessage } from "@/lib/inbox/messages";
import { getMessage } from "@/lib/inbox/queries";

/** React to a customer message. Empty emoji removes the reaction. */
export const POST = route<{ id: string }>(async ({ req, params }) => {
  const { emoji } = await body(req, z.object({ emoji: z.string().max(8) }));
  await reactToMessage(params.id, emoji);
  return { message: await getMessage(params.id) };
});
