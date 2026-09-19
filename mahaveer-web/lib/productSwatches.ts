import type { CatalogProduct } from "@/data/products";
import { COLOR_NAME_HEX } from "@/data/products";

export interface ProductSwatch {
  /** Raw colorNames entry / lookup key — used against colorImages, colorGsm,
   * colorSizes. Not necessarily what the customer sees (see `label`). */
  name: string;
  /** Customer-facing heading — defaults to `name`, but a family can override
   * it via colorLabels (e.g. VTC's 3 GSM/size groups all just show "VTC"). */
  label: string;
  hex?: string;
  gsmLabel: string;
  sizesLabel: string | null;
}

// "120 · 250 · 300 GSM" → "120, 250, 300 GSM" (Figma pill format)
function formatGsm(gsm: string): string {
  const unit = /MM/i.test(gsm) ? "MM" : "GSM";
  const base = gsm.replace(/\s*(GSM|MM)\s*$/i, "");
  const values = base.split("·").map(s => s.trim()).filter(Boolean);
  return `${values.join(", ")} ${unit}`;
}

// "63 x 91 CM · 79 x 109 CM" → "63 x 91 CM, 79 x 109 CM" (each value keeps its own unit)
export function formatSizes(sizes: string): string {
  return sizes.split("·").map(s => s.trim()).filter(Boolean).join(", ");
}

// One entry per real named colour when a family has that data — falls back to
// repeating the family name/image for the handful of products with no colour
// breakdown. Shared by the product page (one card per swatch) and the
// filtered search results grid (one card per swatch, across every matching
// family), so both always agree on what counts as "one product."
export function getProductSwatches(product: CatalogProduct): ProductSwatch[] {
  const familySizesLabel = product.sizes ? formatSizes(product.sizes) : null;
  return product.colorNames?.length
    ? product.colorNames.map((name) => ({
        name,
        label: product.colorLabels?.[name] ?? name,
        hex: product.unverifiedColors?.includes(name) ? undefined : COLOR_NAME_HEX[name],
        gsmLabel: formatGsm(product.colorGsm?.[name] ?? product.gsm),
        sizesLabel: product.colorSizes?.[name] ? formatSizes(product.colorSizes[name]) : familySizesLabel,
      }))
    : Array.from({ length: Math.max(1, product.colors) }, () => ({
        name: product.name,
        label: product.name,
        hex: undefined as string | undefined,
        gsmLabel: formatGsm(product.gsm),
        sizesLabel: familySizesLabel,
      }));
}

// "Bluish White" → "bluish-white" — used to deep-link a search-result swatch
// card straight to its shade on the product page (#swatch-bluish-white).
export function slugifySwatchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
