import { route, HttpError } from "@/lib/inbox/api";
import { seedDemo } from "@/lib/inbox/seed";
import { waMode } from "@/lib/inbox/wa";

/** Development helper: loads demo conversations into an empty inbox (mock mode only). */
export const POST = route(async () => {
  if (waMode() === "live" || process.env.NODE_ENV === "production") throw new HttpError("Demo data is only available in mock mode.", 403);
  await seedDemo();
  return { ok: true };
});
