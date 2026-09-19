import fs from "node:fs/promises";
import path from "node:path";

/**
 * File storage for chat media.
 *  - SUPABASE_URL + SUPABASE_SERVICE_KEY set -> private Supabase Storage bucket "inbox-media"
 *  - otherwise -> local disk under ./.data/media (development)
 */
const BUCKET = "inbox-media";
const supa = () =>
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? { url: process.env.SUPABASE_URL.replace(/\/$/, ""), key: process.env.SUPABASE_SERVICE_KEY }
    : null;

let bucketReady = false;
async function ensureBucket(s: { url: string; key: string }) {
  if (bucketReady) return;
  await fetch(`${s.url}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  }).catch(() => undefined); // 409 (already exists) is fine
  bucketReady = true;
}

const safe = (p: string) => p.replace(/[^a-zA-Z0-9._/-]/g, "_").replace(/\.\.+/g, ".");

export async function putFile(filePath: string, data: Buffer, mime: string): Promise<string> {
  const p = safe(filePath);
  const s = supa();
  if (s) {
    await ensureBucket(s);
    const res = await fetch(`${s.url}/storage/v1/object/${BUCKET}/${p}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${s.key}`, "Content-Type": mime, "x-upsert": "true" },
      body: new Uint8Array(data),
    });
    if (!res.ok) throw new Error(`Storage upload failed (${res.status})`);
    return p;
  }
  const full = path.join(process.cwd(), ".data", "media", p);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
  return p;
}

export async function getFile(filePath: string): Promise<Buffer | null> {
  const p = safe(filePath);
  const s = supa();
  if (s) {
    const res = await fetch(`${s.url}/storage/v1/object/${BUCKET}/${p}`, { headers: { Authorization: `Bearer ${s.key}` } });
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
  }
  try {
    return await fs.readFile(path.join(process.cwd(), ".data", "media", p));
  } catch {
    return null;
  }
}

export function extFor(mime: string, filename?: string | null): string {
  const fromName = filename?.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const map: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "video/mp4": "mp4", "video/3gpp": "3gp",
    "audio/ogg": "ogg", "audio/mpeg": "mp3", "audio/mp4": "m4a", "audio/aac": "aac", "audio/amr": "amr",
    "application/pdf": "pdf",
  };
  return map[mime.split(";")[0]] ?? "bin";
}
