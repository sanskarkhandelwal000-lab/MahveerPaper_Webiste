import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const GET = route(async () => ({
  lists: await query(
    `select l.id, l.name, l.created_at, (select count(*)::int from contact_list_members m where m.list_id = l.id) as members
     from contact_lists l order by l.name`,
  ),
}));

export const POST = route(async ({ req }) => {
  const { name } = await body(req, z.object({ name: z.string().min(1).max(60) }));
  const rows = await query("insert into contact_lists (name) values ($1) on conflict (name) do update set name = excluded.name returning id, name", [name.trim()]);
  return { list: rows[0] };
});
