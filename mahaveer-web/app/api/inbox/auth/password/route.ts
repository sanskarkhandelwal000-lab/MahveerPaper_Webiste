import { z } from "zod";
import bcrypt from "bcryptjs";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query, queryOne } from "@/lib/inbox/db";

export const POST = route(async ({ req, user }) => {
  const b = await body(req, z.object({ current: z.string().min(1), next: z.string().min(8, "New password must be at least 8 characters").max(100) }));
  const row = await queryOne<{ password_hash: string }>("select password_hash from users where id = $1", [user.id]);
  if (!row || !(await bcrypt.compare(b.current, row.password_hash))) throw new HttpError("Your current password is incorrect.");
  await query("update users set password_hash = $2 where id = $1", [user.id, await bcrypt.hash(b.next, 10)]);
  return { ok: true };
});
