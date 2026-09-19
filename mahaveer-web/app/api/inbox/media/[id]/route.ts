import { NextResponse } from "next/server";
import { route, HttpError } from "@/lib/inbox/api";
import { queryOne, query } from "@/lib/inbox/db";
import { getFile, putFile, extFor } from "@/lib/inbox/storage";
import { downloadMedia } from "@/lib/inbox/wa";

/** Streams a message's media. Inbound files not yet saved are fetched from Meta on demand. */
export const GET = route<{ id: string }>(async ({ params }) => {
  const m = await queryOne<{ media_path: string | null; media_id: string | null; mime_type: string | null; filename: string | null }>(
    "select media_path, media_id, mime_type, filename from messages where id = $1",
    [params.id],
  );
  if (!m) throw new HttpError("Not found", 404);
  let data: Buffer | null = m.media_path ? await getFile(m.media_path) : null;
  let mime = m.mime_type ?? "application/octet-stream";
  if (!data && m.media_id) {
    const dl = await downloadMedia(m.media_id).catch(() => null);
    if (!dl) throw new HttpError("This file is no longer available from WhatsApp (they keep media for about 30 days).", 410);
    data = dl.data;
    mime = dl.mime;
    const p = await putFile(`in/${params.id}.${extFor(mime, m.filename)}`, data, mime);
    await query("update messages set media_path = $2, mime_type = $3 where id = $1", [params.id, p, mime]);
  }
  if (!data) throw new HttpError("Not found", 404);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "private, max-age=86400",
      "Content-Disposition": `inline; filename="${(m.filename ?? "file").replace(/"/g, "")}"`,
    },
  });
});
