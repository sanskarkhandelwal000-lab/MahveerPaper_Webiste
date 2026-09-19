import { NextRequest, NextResponse } from "next/server";
import { tickCampaigns } from "@/lib/inbox/campaigns";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/** Cron entry (vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  await tickCampaigns();
  return NextResponse.json({ ok: true });
}
