import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/inbox/auth";
import { waMode } from "@/lib/inbox/wa";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({ user, waMode: waMode() });
}
