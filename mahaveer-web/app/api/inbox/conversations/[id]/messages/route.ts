import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { getMessages } from "@/lib/inbox/queries";
import { sendOutbound, type OutboundSpec } from "@/lib/inbox/messages";
import { query } from "@/lib/inbox/db";

type P = { id: string };

export const GET = route<P>(async ({ req, params }) => {
  const before = req.nextUrl.searchParams.get("before") ?? undefined;
  return { messages: await getMessages(params.id, { before, limit: 100 }) };
});

const send = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), body: z.string().min(1).max(4096), replyTo: z.string().nullish() }),
  z.object({
    kind: z.literal("media"),
    path: z.string().min(1),
    mime: z.string(),
    filename: z.string(),
    mediaKind: z.enum(["image", "video", "audio", "document"]),
    caption: z.string().max(1024).optional(),
    replyTo: z.string().nullish(),
  }),
  z.object({ kind: z.literal("template"), templateId: z.string().uuid(), params: z.array(z.string()).default([]) }),
  z.object({
    kind: z.literal("location"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    name: z.string().optional(),
    address: z.string().optional(),
  }),
]);

export const POST = route<P>(async ({ req, params, user }) => {
  const b = await body(req, send);
  let spec: OutboundSpec;
  switch (b.kind) {
    case "text": spec = { kind: "text", body: b.body }; break;
    case "media": spec = { kind: "media", mediaKind: b.mediaKind, mediaPath: b.path, mime: b.mime, filename: b.filename, caption: b.caption }; break;
    case "template": spec = { kind: "template", templateId: b.templateId, params: b.params }; break;
    case "location": spec = { kind: "location", latitude: b.latitude, longitude: b.longitude, name: b.name, address: b.address }; break;
    default: throw new HttpError("Unsupported message");
  }
  const message = await sendOutbound(spec, {
    conversationId: params.id,
    senderType: "agent",
    userId: user.id,
    replyToWaId: "replyTo" in b ? b.replyTo : null,
  });
  // A human took over: pause the bot for this chat and assign it if nobody owns it.
  await query(
    `update conversations set bot_paused = true, needs_human = false, assigned_to = coalesce(assigned_to, $2) where id = $1`,
    [params.id, user.id],
  );
  return { message };
});
