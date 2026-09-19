import crypto from "node:crypto";
import { route, HttpError } from "@/lib/inbox/api";
import { putFile, extFor } from "@/lib/inbox/storage";
import type { MediaKind } from "@/lib/inbox/wa";

// Vercel caps request bodies at ~4.5 MB, which is below WhatsApp's own limits, so that is the real ceiling here.
const MAX_BYTES = 4 * 1024 * 1024;
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
  if (file.size > MAX_BYTES) throw new HttpError("Files must be under 4 MB (a hosting limit). Compress the file or share a link instead.");
  const data = Buffer.from(await file.arrayBuffer());
  const path = await putFile(`out/${crypto.randomUUID()}.${extFor(mime, file.name)}`, data, mime);
  return { path, mime, filename: file.name, mediaKind: kind, size: file.size };
});
