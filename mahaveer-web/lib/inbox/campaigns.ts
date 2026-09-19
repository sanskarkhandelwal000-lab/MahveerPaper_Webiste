import { query, queryOne } from "./db";
import { getOrCreateConversation, sendOutbound } from "./messages";

export interface Audience {
  all?: boolean;
  listIds?: string[];
  tags?: string[];
  contactIds?: string[];
}

export type VarSpec = { source: "text"; value: string } | { source: "contact"; field: "name" | "first_name" | "company" | "location"; fallback?: string };

/** Resolves an audience to contacts that may legally receive marketing: opted in, not blocked. */
export async function resolveAudience(a: Audience): Promise<Array<{ id: string; wa_id: string; name: string | null; profile_name: string | null; company: string | null; location: string | null }>> {
  const or: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => (params.push(v), `$${params.length}`);
  if (a.all) or.push("true");
  if (a.listIds?.length) or.push(`c.id in (select contact_id from contact_list_members where list_id = any(${p(a.listIds)}::uuid[]))`);
  if (a.tags?.length) or.push(`c.tags && ${p(a.tags)}::text[]`);
  if (a.contactIds?.length) or.push(`c.id = any(${p(a.contactIds)}::uuid[])`);
  if (!or.length) return [];
  return query(
    `select c.id, c.wa_id, c.name, c.profile_name, c.company, c.location from contacts c
     where c.opted_in and not c.blocked and (${or.join(" or ")})`,
    params,
  );
}

function resolveVars(vars: Record<string, VarSpec>, c: { name: string | null; profile_name: string | null; company: string | null; location: string | null }): string[] {
  const keys = Object.keys(vars).map(Number).sort((a, b) => a - b);
  return keys.map((k) => {
    const v = vars[String(k)];
    if (v.source === "text") return v.value;
    const full = c.name || c.profile_name || "";
    const val = v.field === "first_name" ? full.split(/\s+/)[0] : v.field === "name" ? full : (c[v.field] ?? "");
    return val || v.fallback || "there";
  });
}

export async function startCampaign(id: string): Promise<number> {
  const c = await queryOne<{ audience: Audience; status: string }>("select audience, status from campaigns where id = $1", [id]);
  if (!c) throw new Error("Campaign not found");
  const people = await resolveAudience(c.audience);
  if (!people.length) throw new Error("No opted-in contacts match this audience.");
  for (const p of people) {
    await query("insert into campaign_recipients (campaign_id, contact_id) values ($1,$2) on conflict do nothing", [id, p.id]);
  }
  await query("update campaigns set status = 'sending', started_at = coalesce(started_at, now()) where id = $1", [id]);
  return people.length;
}

/** Sends pending recipients until the time budget is used. Returns how many are still pending. */
export async function runCampaignBatch(id: string, budgetMs = 45_000): Promise<{ pending: number; sent: number; failed: number }> {
  const camp = await queryOne<{ template_id: string; variables: Record<string, VarSpec>; status: string }>(
    "select template_id, variables, status from campaigns where id = $1",
    [id],
  );
  if (!camp || camp.status !== "sending") return { pending: 0, sent: 0, failed: 0 };
  const deadline = Date.now() + budgetMs;
  let sent = 0, failed = 0;

  while (Date.now() < deadline) {
    const batch = await query<{ rid: string; contact_id: string; name: string | null; profile_name: string | null; company: string | null; location: string | null }>(
      `select r.id as rid, r.contact_id, c.name, c.profile_name, c.company, c.location
       from campaign_recipients r join contacts c on c.id = r.contact_id
       where r.campaign_id = $1 and r.status = 'pending' and c.opted_in and not c.blocked limit 8`,
      [id],
    );
    if (!batch.length) break;
    await Promise.all(batch.map(async (r) => {
      try {
        const convId = await getOrCreateConversation(r.contact_id);
        const msg = await sendOutbound(
          { kind: "template", templateId: camp.template_id, params: resolveVars(camp.variables, r) },
          { conversationId: convId, senderType: "campaign", skipWindowCheck: true },
        );
        if (msg.status === "failed") throw new Error(msg.error ?? "Send failed");
        await query("update campaign_recipients set status = 'sent', wa_message_id = $2, sent_at = now() where id = $1", [r.rid, msg.wa_message_id]);
        sent += 1;
      } catch (e) {
        await query("update campaign_recipients set status = 'failed', error = $2 where id = $1", [r.rid, e instanceof Error ? e.message : "Failed"]);
        failed += 1;
      }
    }));
    await new Promise((res) => setTimeout(res, 300));
  }

  const left = await queryOne<{ n: number }>("select count(*)::int as n from campaign_recipients r join contacts c on c.id = r.contact_id where r.campaign_id = $1 and r.status = 'pending' and c.opted_in and not c.blocked", [id]);
  const pending = left?.n ?? 0;
  if (pending === 0) {
    // recipients who opted out mid-campaign are marked failed so reports add up
    await query(`update campaign_recipients set status = 'failed', error = 'Opted out before send' where campaign_id = $1 and status = 'pending'`, [id]);
    await query("update campaigns set status = 'completed', completed_at = now() where id = $1 and status = 'sending'", [id]);
  }
  return { pending, sent, failed };
}

/** Called by cron: starts due scheduled campaigns and continues running ones. */
export async function tickCampaigns(): Promise<void> {
  const due = await query<{ id: string }>("select id from campaigns where status = 'scheduled' and scheduled_at <= now()");
  for (const c of due) await startCampaign(c.id).catch(async () => {
    await query("update campaigns set status = 'cancelled' where id = $1", [c.id]);
  });
  const running = await query<{ id: string }>("select id from campaigns where status = 'sending'");
  for (const c of running) await runCampaignBatch(c.id, 40_000);
}

export const campaignStatsSql = `
  select c.id, c.name, c.status, c.scheduled_at, c.started_at, c.completed_at, c.created_at, c.audience, c.variables,
    t.name as template_name, u.name as created_by_name,
    (select count(*)::int from campaign_recipients r where r.campaign_id = c.id) as total,
    (select count(*)::int from campaign_recipients r where r.campaign_id = c.id and r.status in ('sent','delivered','read')) as sent,
    (select count(*)::int from campaign_recipients r where r.campaign_id = c.id and r.status in ('delivered','read')) as delivered,
    (select count(*)::int from campaign_recipients r where r.campaign_id = c.id and r.status = 'read') as read,
    (select count(*)::int from campaign_recipients r where r.campaign_id = c.id and r.status = 'failed') as failed
  from campaigns c join templates t on t.id = c.template_id left join users u on u.id = c.created_by`;
