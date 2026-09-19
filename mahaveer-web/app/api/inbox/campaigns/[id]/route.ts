import { route, HttpError } from "@/lib/inbox/api";
import { query, queryOne } from "@/lib/inbox/db";
import { campaignStatsSql } from "@/lib/inbox/campaigns";

export const GET = route<{ id: string }>(async ({ params }) => {
  const c = await queryOne(`${campaignStatsSql} where c.id = $1`, [params.id]);
  if (!c) throw new HttpError("Campaign not found", 404);
  const recipients = await query(
    `select r.id, r.status, r.error, r.sent_at, r.delivered_at, r.read_at, coalesce(ct.name, ct.profile_name, '+' || ct.wa_id) as name, ct.wa_id
     from campaign_recipients r join contacts ct on ct.id = r.contact_id where r.campaign_id = $1
     order by case r.status when 'failed' then 0 when 'pending' then 1 else 2 end, r.sent_at desc nulls last limit 500`,
    [params.id],
  );
  return { campaign: c, recipients };
});

export const DELETE = route<{ id: string }>(async ({ params }) => {
  const c = await queryOne<{ status: string }>("select status from campaigns where id = $1", [params.id]);
  if (c && c.status === "sending") throw new HttpError("Cancel the campaign before deleting it.");
  await query("delete from campaigns where id = $1", [params.id]);
  return { ok: true };
});
