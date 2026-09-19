import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { recordInbound } from "@/lib/inbox/messages";
import { waMode } from "@/lib/inbox/wa";
import { runBot } from "@/lib/inbox/bot";

/** Development helper: injects an inbound WhatsApp message. Disabled when a live number is configured. */
export const POST = route(async ({ req }) => {
  if (waMode() === "live" || process.env.NODE_ENV === "production") throw new HttpError("Simulator is only available in mock mode.", 403);
  const b = await body(req, z.object({
    from: z.string().default("919876500099"),
    name: z.string().default("Test Customer"),
    text: z.string().optional(),
    type: z.enum(["text", "location", "contacts", "button"]).default("text"),
    buttonId: z.string().optional(),
  }));
  const id = `sim.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
  const ts = String(Math.floor(Date.now() / 1000));
  const msg =
    b.type === "location" ? { from: b.from, id, timestamp: ts, type: "location", location: { latitude: 12.9716, longitude: 77.5946, name: "Cottonpet, Bengaluru" } }
    : b.type === "contacts" ? { from: b.from, id, timestamp: ts, type: "contacts", contacts: [{ name: { formatted_name: "Test Person" }, phones: [{ phone: "+91 90000 00000" }] }] }
    : b.type === "button" ? { from: b.from, id, timestamp: ts, type: "interactive", interactive: { type: "button_reply", button_reply: { id: b.buttonId ?? "SAMPLE::vtc", title: b.text ?? "Request Sample" } } }
    : { from: b.from, id, timestamp: ts, type: "text", text: { body: b.text ?? "Hello" } };
  const res = await recordInbound(msg, b.name);
  if (res) await runBot(res);
  return { ok: true, conversationId: res?.conversationId ?? null };
});
