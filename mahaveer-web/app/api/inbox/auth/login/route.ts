import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { login, setSessionCookie, throttled } from "@/lib/inbox/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Enter your email and password" }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}:${parsed.data.email.toLowerCase()}`;
  if (throttled(key)) return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  const user = await login(parsed.data.email, parsed.data.password, key);
  if (!user) return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
  await setSessionCookie(user.id);
  return NextResponse.json({ user });
}
