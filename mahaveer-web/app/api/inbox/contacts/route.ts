import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";
import { normalizeWaId } from "@/lib/inbox/wa";
import type { ContactItem } from "@/lib/inbox/types";

export const GET = route(async ({ req }) => {
  const sp = req.nextUrl.searchParams;
  const where: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => (params.push(v), `$${params.length}`);
  const q = sp.get("q")?.trim();
  if (q) {
    const like = p(`%${q}%`);
    where.push(`(c.name ilike ${like} or c.profile_name ilike ${like} or c.wa_id ilike ${like} or c.email ilike ${like} or c.company ilike ${like})`);
  }
  if (sp.get("tag")) where.push(`${p(sp.get("tag"))} = any(c.tags)`);
  if (sp.get("list")) where.push(`exists (select 1 from contact_list_members m where m.contact_id = c.id and m.list_id = ${p(sp.get("list"))})`);
  if (sp.get("optedIn") === "1") where.push("c.opted_in");
  const limit = Math.min(Number(sp.get("limit")) || 200, 1000);
  const contacts = await query<ContactItem>(
    `select c.*, v.id as conversation_id from contacts c left join conversations v on v.contact_id = c.id
     ${where.length ? "where " + where.join(" and ") : ""} order by coalesce(c.name, c.profile_name, c.wa_id) limit ${limit}`,
    params,
  );
  const tags = await query<{ tag: string }>("select distinct unnest(tags) as tag from contacts order by 1");
  return { contacts, tags: tags.map((t) => t.tag) };
});

export const contactInput = z.object({
  phone: z.string().min(5),
  name: z.string().max(120).nullish(),
  email: z.string().email().or(z.literal("")).nullish(),
  location: z.string().max(200).nullish(),
  company: z.string().max(200).nullish(),
  tags: z.array(z.string().max(30)).max(30).default([]),
  opted_in: z.boolean().default(false),
});

export const POST = route(async ({ req }) => {
  const b = await body(req, contactInput);
  const waId = normalizeWaId(b.phone);
  if (!waId) throw new HttpError("That doesn't look like a valid phone number. Include the country code.");
  const rows = await query<ContactItem>(
    `insert into contacts (wa_id, name, email, location, company, tags, opted_in, opted_in_at)
     values ($1,$2,$3,$4,$5,$6,$7, case when $7 then now() end)
     on conflict (wa_id) do update set name = coalesce(excluded.name, contacts.name), email = coalesce(excluded.email, contacts.email),
       location = coalesce(excluded.location, contacts.location), company = coalesce(excluded.company, contacts.company),
       tags = (select array(select distinct unnest(contacts.tags || excluded.tags))), updated_at = now()
     returning *`,
    [waId, b.name || null, b.email || null, b.location || null, b.company || null, b.tags, b.opted_in],
  );
  return { contact: rows[0] };
});
