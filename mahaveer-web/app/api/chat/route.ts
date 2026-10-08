import { NextRequest, NextResponse } from "next/server";

/**
 * The website chat is the same bot as the WhatsApp one: this route only forwards the visitor's
 * message to the bot service, which runs the shared logic and returns its replies.
 */
export const maxDuration = 60;

const BOT_URL = (process.env.INBOX_API_URL ?? "https://whatsapp-app-bice.vercel.app").replace(/\/$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BOT_URL}/api/web-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(55_000),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("chat proxy failed:", e);
    return NextResponse.json({ error: "Chat is unavailable right now." }, { status: 502 });
  }
}
