import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";
import type { ContactItem } from "@/lib/inbox/types";

type P = { id: string };

const patch = z.object({
  name: z.string().max(120).nullable().optional(),
  email: z.string().email().or(z.literal("")).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
  tags: z.array(z.string().max(30)).max(30).optional(),
  opted_in: z.boolean().optional(),
  blocked: z.boolean().optional(),
});

export const PATCH = route<P>(async ({ req, params }) => {
  const b = await body(req, patch);
  const sets: string[] = ["updated_at = now()"];
  const vals: unknown[] = [params.id];
  for (const [k, v] of Object.entries(b)) {
    if (v === undefined) continue;
    vals.push(k === "email" && v === "" ? null : v);
    sets.push(`${k} = $${vals.length}`);
    if (k === "opted_in") sets.push(`opted_in_at = ${v ? "coalesce(opted_in_at, now())" : "null"}`);
  }
  const rows = await query<ContactItem>(`update contacts set ${sets.join(", ")} where id = $1 returning *`, vals);
  if (!rows[0]) throw new HttpError("Contact not found", 404);
  return { contact: rows[0] };
});

export const DELETE = route<P>(async ({ params }) => {
  await query("delete from contacts where id = $1", [params.id]);
  return { ok: true };
}, { admin: true });
