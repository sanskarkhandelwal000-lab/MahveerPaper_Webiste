import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const GET = route(async () => ({ replies: await query("select id, shortcut, body from quick_replies order by shortcut") }));

export const POST = route(async ({ req }) => {
  const b = await body(req, z.object({ shortcut: z.string().min(1).max(30).regex(/^[\w-]+$/, "Shortcut can only use letters, numbers, - and _"), body: z.string().min(1).max(1000) }));
  const rows = await query("insert into quick_replies (shortcut, body) values ($1,$2) on conflict (shortcut) do update set body = excluded.body returning id, shortcut, body", [b.shortcut.toLowerCase(), b.body]);
  return { reply: rows[0] };
});

export const DELETE = route(async ({ req }) => {
  const id = req.nextUrl.searchParams.get("id");
  if (id) await query("delete from quick_replies where id = $1", [id]);
  return { ok: true };
});
