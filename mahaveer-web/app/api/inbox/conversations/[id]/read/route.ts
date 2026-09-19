import { route } from "@/lib/inbox/api";
import { markConversationRead } from "@/lib/inbox/queries";
import { markRead } from "@/lib/inbox/wa";

export const POST = route<{ id: string }>(async ({ params }) => {
  const lastIn = await markConversationRead(params.id);
  if (lastIn && !lastIn.startsWith("demo-")) void markRead(lastIn);
  return { ok: true };
});
