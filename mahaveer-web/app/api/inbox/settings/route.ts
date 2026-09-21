import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { botEnabled, carouselEnabled, setSetting } from "@/lib/inbox/settings";
import { waMode } from "@/lib/inbox/wa";

export const GET = route(async ({ req }) => ({
  botEnabled: await botEnabled(),
  carouselEnabled: await carouselEnabled(),
  waMode: waMode(),
  webhookUrl: `${req.nextUrl.origin}/api/whatsapp/webhook`,
  hasWaba: !!process.env.WA_WABA_ID,
  env: {
    WA_ACCESS_TOKEN: !!process.env.WA_ACCESS_TOKEN,
    WA_PHONE_NUMBER_ID: !!process.env.WA_PHONE_NUMBER_ID,
    WA_WABA_ID: !!process.env.WA_WABA_ID,
    WA_APP_SECRET: !!process.env.WA_APP_SECRET,
    WA_VERIFY_TOKEN: !!process.env.WA_VERIFY_TOKEN,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    DATABASE_URL: !!process.env.DATABASE_URL,
    INBOX_SESSION_SECRET: !!process.env.INBOX_SESSION_SECRET,
  },
}));

export const PUT = route(async ({ req }) => {
  const b = await body(req, z.object({ botEnabled: z.boolean().optional(), carouselEnabled: z.boolean().optional() }));
  if (b.botEnabled !== undefined) await setSetting("bot_enabled", b.botEnabled);
  if (b.carouselEnabled !== undefined) await setSetting("carousel_enabled", b.carouselEnabled);
  return { botEnabled: await botEnabled(), carouselEnabled: await carouselEnabled() };
}, { admin: true });
