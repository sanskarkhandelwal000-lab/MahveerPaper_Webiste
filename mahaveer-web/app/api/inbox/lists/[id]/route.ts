import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

type P = { id: string };

const patch = z.object({
  name: z.string().min(1).max(60).optional(),
  add: z.array(z.string().uuid()).optional(),
  remove: z.array(z.string().uuid()).optional(),
});

export const PATCH = route<P>(async ({ req, params }) => {
  const b = await body(req, patch);
  if (b.name) await query("update contact_lists set name = $2 where id = $1", [params.id, b.name.trim()]);
  for (const c of b.add ?? []) await query("insert into contact_list_members (list_id, contact_id) values ($1,$2) on conflict do nothing", [params.id, c]);
  for (const c of b.remove ?? []) await query("delete from contact_list_members where list_id = $1 and contact_id = $2", [params.id, c]);
  return { ok: true };
});

export const DELETE = route<P>(async ({ params }) => {
  await query("delete from contact_lists where id = $1", [params.id]);
  return { ok: true };
}, { admin: true });
