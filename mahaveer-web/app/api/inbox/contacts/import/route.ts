import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";
import { normalizeWaId } from "@/lib/inbox/wa";

const schema = z.object({
  rows: z.array(z.object({
    phone: z.string(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    location: z.string().nullish(),
    company: z.string().nullish(),
    tags: z.array(z.string()).optional(),
  })).max(5000),
  tags: z.array(z.string()).default([]),
  listId: z.string().uuid().nullish(),
  /** Caller confirms these people agreed to receive WhatsApp messages from you. */
  optedIn: z.boolean().default(false),
});

export const POST = route(async ({ req }) => {
  const b = await body(req, schema);
  let created = 0, updated = 0;
  const invalid: string[] = [];
  for (const r of b.rows) {
    const waId = normalizeWaId(r.phone ?? "");
    if (!waId) { invalid.push(r.phone); continue; }
    const tags = [...new Set([...(r.tags ?? []), ...b.tags].map((t) => t.trim()).filter(Boolean))];
    const res = await query<{ id: string; inserted: boolean }>(
      `insert into contacts (wa_id, name, email, location, company, tags, opted_in, opted_in_at)
       values ($1,$2,$3,$4,$5,$6,$7, case when $7 then now() end)
       on conflict (wa_id) do update set name = coalesce(contacts.name, excluded.name), email = coalesce(contacts.email, excluded.email),
         location = coalesce(contacts.location, excluded.location), company = coalesce(contacts.company, excluded.company),
         tags = (select array(select distinct unnest(contacts.tags || excluded.tags))),
         opted_in = contacts.opted_in or excluded.opted_in,
         opted_in_at = case when excluded.opted_in then coalesce(contacts.opted_in_at, now()) else contacts.opted_in_at end,
         updated_at = now()
       returning id, (xmax = 0) as inserted`,
      [waId, r.name || null, r.email || null, r.location || null, r.company || null, tags, b.optedIn],
    );
    if (res[0].inserted) created += 1; else updated += 1;
    if (b.listId) await query("insert into contact_list_members (list_id, contact_id) values ($1,$2) on conflict do nothing", [b.listId, res[0].id]);
  }
  return { created, updated, invalid };
});
