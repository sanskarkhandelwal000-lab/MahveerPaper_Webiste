import { route } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const POST = route<{ id: string }>(async ({ params }) => {
  await query("update campaigns set status = 'cancelled' where id = $1 and status in ('draft','scheduled','sending')", [params.id]);
  await query("update campaign_recipients set status = 'failed', error = 'Campaign cancelled' where campaign_id = $1 and status = 'pending'", [params.id]);
  return { ok: true };
});
