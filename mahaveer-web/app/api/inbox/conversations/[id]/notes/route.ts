import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const POST = route<{ id: string }>(async ({ req, params, user }) => {
  const { text } = await body(req, z.object({ text: z.string().min(1).max(2000) }));
  const rows = await query(
    "insert into notes (conversation_id, user_id, body) values ($1,$2,$3) returning id, body, created_at",
    [params.id, user.id, text],
  );
  return { note: { ...rows[0], user_name: user.name } };
});

export const DELETE = route<{ id: string }>(async ({ req, params }) => {
  const noteId = req.nextUrl.searchParams.get("noteId");
  if (noteId) await query("delete from notes where id = $1 and conversation_id = $2", [noteId, params.id]);
  return { ok: true };
});
