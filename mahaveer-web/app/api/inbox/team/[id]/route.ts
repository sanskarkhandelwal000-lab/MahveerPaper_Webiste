import { z } from "zod";
import bcrypt from "bcryptjs";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query, queryOne } from "@/lib/inbox/db";

export const PATCH = route<{ id: string }>(async ({ req, params, user }) => {
  const b = await body(req, z.object({
    name: z.string().min(1).max(80).optional(),
    role: z.enum(["admin", "agent"]).optional(),
    active: z.boolean().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").max(100).optional(),
  }));
  const target = await queryOne<{ role: string; active: boolean }>("select role, active from users where id = $1", [params.id]);
  if (!target) throw new HttpError("User not found", 404);
  const losesAdmin = target.role === "admin" && target.active && (b.role === "agent" || b.active === false);
  if (losesAdmin) {
    const n = await queryOne<{ n: number }>("select count(*)::int as n from users where role = 'admin' and active");
    if ((n?.n ?? 0) <= 1) throw new HttpError("You need at least one active admin.");
  }
  if (params.id === user.id && b.active === false) throw new HttpError("You can't deactivate your own account.");
  const sets: string[] = [];
  const vals: unknown[] = [params.id];
  if (b.name !== undefined) { vals.push(b.name.trim()); sets.push(`name = $${vals.length}`); }
  if (b.role !== undefined) { vals.push(b.role); sets.push(`role = $${vals.length}`); }
  if (b.active !== undefined) { vals.push(b.active); sets.push(`active = $${vals.length}`); }
  if (b.password) { vals.push(await bcrypt.hash(b.password, 10)); sets.push(`password_hash = $${vals.length}`); }
  if (sets.length) await query(`update users set ${sets.join(", ")} where id = $1`, vals);
  // Deactivated users' open chats go back to the pool
  if (b.active === false) await query("update conversations set assigned_to = null where assigned_to = $1", [params.id]);
  return { ok: true };
}, { admin: true });
