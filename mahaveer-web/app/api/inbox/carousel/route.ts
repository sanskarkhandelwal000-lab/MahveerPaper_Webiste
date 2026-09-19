import { route } from "@/lib/inbox/api";
import { carouselStatus, ensureCarouselTemplates } from "@/lib/inbox/carousel";

export const GET = route(async () => ({ templates: await carouselStatus() }));

/** Creates the carousel templates with Meta (admin only). Refresh status from Templates → Refresh. */
export const POST = route(async () => {
  const r = await ensureCarouselTemplates();
  return { ...r, templates: await carouselStatus() };
}, { admin: true });
