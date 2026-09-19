import crypto from "node:crypto";
import { route, HttpError } from "@/lib/inbox/api";
import { putFile, extFor } from "@/lib/inbox/storage";
import type { MediaKind } from "@/lib/inbox/wa";

// WhatsApp Cloud API size limits (bytes)
const LIMITS: Record<MediaKind, number> = { image: 5 * 1024 * 1024, video: 16 * 1024 * 1024, audio: 16 * 1024 * 1024, document: 100 * 1024 * 1024 };
const ALLOWED: Record<string, MediaKind> = {
  "image/jpeg": "image", "image/png": "image", "video/mp4": "video", "video/3gpp": "video",
  "audio/aac": "audio", "audio/mp4": "audio", "audio/mpeg": "audio", "audio/amr": "audio", "audio/ogg": "audio",
  "application/pdf": "document", "application/msword": "document", "application/vnd.ms-excel": "document",
  "application/vnd.ms-powerpoint": "document", "text/plain": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "document",
};

export const POST = route(async ({ req }) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError("No file attached");
  const mime = file.type.split(";")[0];
  const kind = ALLOWED[mime];
  if (!kind) throw new HttpError(`This file type (${mime || "unknown"}) can't be sent on WhatsApp. Use JPG/PNG, MP4, MP3/OGG/AAC, PDF or Office documents.`);
  if (file.size > LIMITS[kind]) throw new HttpError(`${kind[0].toUpperCase() + kind.slice(1)} files must be under ${LIMITS[kind] / 1024 / 1024} MB for WhatsApp.`);
  const data = Buffer.from(await file.arrayBuffer());
  const path = await putFile(`out/${crypto.randomUUID()}.${extFor(mime, file.name)}`, data, mime);
  return { path, mime, filename: file.name, mediaKind: kind, size: file.size };
});
