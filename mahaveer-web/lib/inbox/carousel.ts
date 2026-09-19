import { catalogProducts } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { query, json } from "./db";
import * as wa from "./wa";

/**
 * Product carousel: horizontally scrolling cards, each with "Details" and "Request Sample" buttons.
 * WhatsApp only allows this as an approved media-card carousel *template*, and a template has a fixed
 * number of cards — so we register one per size (2, 3 and 4 cards) and pick the one that fits.
 */
export const CAROUSEL_SIZES = [2, 3, 4] as const;
export const carouselName = (n: number) => `product_carousel_${n}`;
export const CAROUSEL_LANG = "en";

const INTRO = "Here are some options picked for you. Swipe to browse, then tap Details for a closer look or Request Sample to get a free sample.";

const templateComponents = (n: number, handle: string) => [
  { type: "BODY", text: INTRO },
  {
    type: "CAROUSEL",
    cards: Array.from({ length: n }, () => ({
      components: [
        { type: "HEADER", format: "IMAGE", example: { header_handle: [handle] } },
        { type: "BODY", text: "Suggested: {{1}} - {{2}}.", example: { body_text: [["Burano", "Spectrum, 250 GSM"]] } },
        { type: "BUTTONS", buttons: [{ type: "QUICK_REPLY", text: "Details" }, { type: "QUICK_REPLY", text: "Request Sample" }] },
      ],
    })),
  },
];

export interface CarouselStatus { size: number; name: string; status: string | null; reason: string | null }

export async function carouselStatus(): Promise<CarouselStatus[]> {
  const rows = await query<{ name: string; status: string; rejected_reason: string | null }>(
    "select name, status, rejected_reason from templates where name like 'product\\_carousel\\_%' and language = $1",
    [CAROUSEL_LANG],
  );
  return CAROUSEL_SIZES.map((size) => {
    const r = rows.find((x) => x.name === carouselName(size));
    return { size, name: carouselName(size), status: r?.status ?? null, reason: r?.rejected_reason ?? null };
  });
}

export async function carouselReady(n: number): Promise<boolean> {
  const s = (await carouselStatus()).find((x) => x.size === n);
  return s?.status === "APPROVED";
}

/** Registers any missing carousel templates with Meta (approval usually takes minutes to a day). */
export async function ensureCarouselTemplates(): Promise<{ created: string[] }> {
  const live = wa.waMode() === "live";
  if (live && !process.env.WA_WABA_ID) throw new wa.WaError("WA_WABA_ID is not set.");
  const sample = catalogProducts.find((p) => p.image);
  if (!sample?.image) throw new Error("No product image available for the template example.");
  const handle = live ? await wa.uploadTemplateExample(`${siteConfig.url.replace(/\/$/, "")}${sample.image}`) : "mock-handle";

  const existing = await carouselStatus();
  const created: string[] = [];
  for (const n of CAROUSEL_SIZES) {
    const cur = existing.find((x) => x.size === n);
    if (cur?.status && cur.status !== "REJECTED") continue;
    const components = templateComponents(n, handle);
    const r = await wa.createMetaTemplate({ name: carouselName(n), language: CAROUSEL_LANG, category: "MARKETING", components });
    await query(
      `insert into templates (wa_template_id, name, language, category, status, components)
       values ($1,$2,$3,'MARKETING',$4,$5::jsonb)
       on conflict (name, language) do update set wa_template_id = excluded.wa_template_id, status = excluded.status,
         components = excluded.components, rejected_reason = null, updated_at = now()`,
      [r.id, carouselName(n), CAROUSEL_LANG, live ? r.status : "APPROVED", json(components)],
    );
    created.push(carouselName(n));
  }
  return { created };
}
