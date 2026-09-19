import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const GET = route(async () => ({ labels: await query("select id, name, color from labels order by name") }));

export const POST = route(async ({ req }) => {
  const b = await body(req, z.object({ name: z.string().min(1).max(30), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#00a884") }));
  const rows = await query("insert into labels (name, color) values ($1,$2) on conflict (name) do update set color = excluded.color returning id, name, color", [b.name.trim(), b.color]);
  return { label: rows[0] };
}, { admin: true });

export const DELETE = route(async ({ req }) => {
  const id = req.nextUrl.searchParams.get("id");
  if (id) await query("delete from labels where id = $1", [id]);
  return { ok: true };
}, { admin: true });
