import { catalogProducts } from "@/data/products";

/**
 * Compact, token-efficient serialization of the full catalog for the chatbot's
 * system prompt. One line per product so Claude can scan and match without
 * needing a retrieval step — the catalog is small enough to fit inline.
 */
export function buildCatalogPromptContext(): string {
  return catalogProducts
    .map(
      (p) =>
        `${p.id} | ${p.book} | ${p.name} | ${p.gsm} | ${p.colors} colour(s) | ${p.type} | ${p.app} | ${p.description}`
    )
    .join("\n");
}

const catalogById = new Map(catalogProducts.map((p) => [p.id, p]));

/** Filters a model-supplied list of product ids down to ones that actually exist. */
export function resolveProductIds(ids: unknown): typeof catalogProducts {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const resolved: typeof catalogProducts = [];
  for (const id of ids) {
    if (typeof id !== "string" || seen.has(id)) continue;
    const product = catalogById.get(id);
    if (product) {
      resolved.push(product);
      seen.add(id);
    }
  }
  return resolved.slice(0, 4);
}
