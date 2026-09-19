import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { query, queryOne } from "./db";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent";
}

const COOKIE = "inbox_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret(): Uint8Array {
  const s = process.env.INBOX_SESSION_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("INBOX_SESSION_SECRET must be set in production");
    }
    return new TextEncoder().encode("dev-only-inbox-session-secret-change-me");
  }
  return new TextEncoder().encode(s);
}

// naive in-memory throttle: 8 failed attempts / 10 min per key
const attempts = new Map<string, { n: number; first: number }>();
export function throttled(key: string): boolean {
  const a = attempts.get(key);
  if (!a) return false;
  if (Date.now() - a.first > 10 * 60_000) {
    attempts.delete(key);
    return false;
  }
  return a.n >= 8;
}
function noteFailure(key: string) {
  const a = attempts.get(key);
  if (!a || Date.now() - a.first > 10 * 60_000) attempts.set(key, { n: 1, first: Date.now() });
  else a.n += 1;
}

export async function login(email: string, password: string, key: string): Promise<SessionUser | null> {
  if (throttled(key)) return null;
  const row = await queryOne<SessionUser & { password_hash: string; active: boolean }>(
    "select id, email, name, role, password_hash, active from users where email = $1",
    [email.trim().toLowerCase()],
  );
  if (!row || !row.active || !(await bcrypt.compare(password, row.password_hash))) {
    noteFailure(key);
    return null;
  }
  attempts.delete(key);
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Current user, or null. Re-checks the DB so deactivated users lose access immediately. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const u = await queryOne<SessionUser & { active: boolean }>(
      "select id, email, name, role, active from users where id = $1",
      [payload.sub],
    );
    if (!u || !u.active) return null;
    return { id: u.id, email: u.email, name: u.name, role: u.role };
  } catch {
    return null;
  }
}

export const unauthorized = () => NextResponse.json({ error: "Not signed in" }, { status: 401 });
export const forbidden = () => NextResponse.json({ error: "Admins only" }, { status: 403 });

export async function listUsers() {
  return query("select id, email, name, role, active, created_at from users order by created_at");
}
