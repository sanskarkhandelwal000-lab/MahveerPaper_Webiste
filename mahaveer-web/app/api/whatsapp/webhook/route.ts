import { NextRequest, NextResponse, after } from "next/server";
import { applyStatus, recordInbound, storeInboundMedia, type WaInbound } from "@/lib/inbox/messages";
import { verifySignature } from "@/lib/inbox/wa";
import { runBot } from "@/lib/inbox/bot";
import { query } from "@/lib/inbox/db";

export const dynamic = "force-dynamic";

/** Meta webhook verification handshake. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (sp.get("hub.mode") === "subscribe" && sp.get("hub.verify_token") === process.env.WA_VERIFY_TOKEN && process.env.WA_VERIFY_TOKEN) {
    return new NextResponse(sp.get("hub.challenge") ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

interface Change {
  value?: {
    metadata?: { phone_number_id?: string };
    contacts?: Array<{ wa_id: string; profile?: { name?: string } }>;
    messages?: WaInbound[];
    statuses?: Array<{ id: string; status: string; errors?: Array<{ code?: number; title?: string; message?: string }> }>;
  };
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }
  let payload: { entry?: Array<{ changes?: Change[] }> };
  try {
    payload = JSON.parse(raw);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  // Do the work after responding: Meta expects a fast 200 and retries otherwise.
  after(async () => {
    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const v = change.value;
        if (!v) continue;
        if (process.env.WA_PHONE_NUMBER_ID && v.metadata?.phone_number_id && v.metadata.phone_number_id !== process.env.WA_PHONE_NUMBER_ID) continue;
        try {
          for (const s of v.statuses ?? []) await applyStatus(s);
          for (const m of v.messages ?? []) {
            const name = v.contacts?.find((c) => c.wa_id === m.from)?.profile?.name;
            const res = await recordInbound(m, name);
            if (!res) continue;
            const mediaId = m.image?.id ?? m.video?.id ?? m.audio?.id ?? m.document?.id ?? m.sticker?.id;
            if (mediaId) await storeInboundMedia(res.messageId, mediaId, m.document?.filename);
            await runBot(res);
          }
        } catch (e) {
          console.error("inbox webhook processing error:", e);
          await query("select 1").catch(() => undefined);
        }
      }
    }
  });
  return NextResponse.json({ ok: true });
}
