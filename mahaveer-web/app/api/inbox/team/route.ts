import { z } from "zod";
import bcrypt from "bcryptjs";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const GET = route(async () => ({
  users: await query("select id, email, name, role, active, created_at from users order by active desc, name"),
}));

export const POST = route(async ({ req }) => {
  const b = await body(req, z.object({
    name: z.string().min(1).max(80),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
    role: z.enum(["admin", "agent"]).default("agent"),
  }));
  const exists = await query("select 1 from users where email = $1", [b.email.toLowerCase()]);
  if (exists.length) throw new HttpError("A team member with that email already exists.");
  const rows = await query(
    "insert into users (email, name, password_hash, role) values ($1,$2,$3,$4) returning id, email, name, role, active",
    [b.email.toLowerCase(), b.name.trim(), await bcrypt.hash(b.password, 10), b.role],
  );
  return { user: rows[0] };
}, { admin: true });
