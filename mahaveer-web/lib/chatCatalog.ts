import { catalogProducts, type AppType } from "@/data/products";

/**
 * Compact, token-efficient serialization of the catalog for the chatbot's
 * system prompt. One line per product so Claude can scan and match without
 * needing a retrieval step — the catalog is small enough to fit inline.
 */
export function buildCatalogPromptContext(
  products: typeof catalogProducts = catalogProducts
): string {
  return products
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

/**
 * Colour words that actually appear in catalogue product names/descriptions.
 * Used as a deterministic backstop so a mismatched colour (e.g. a "Black"
 * product surfaced for a "white" request) can never reach the user even if
 * the model's own colour reasoning slips — the LLM can't be trusted to
 * self-enforce a negative constraint like this on every turn.
 */
const CATALOG_COLOR_WORDS = [
  "white", "black", "cream", "ivory", "gold", "grey", "gray", "natural", "brown",
];

function colorWordsIn(text: string): Set<string> {
  const lower = text.toLowerCase();
  return new Set(CATALOG_COLOR_WORDS.filter((c) => lower.includes(c)));
}

/**
 * Drops any product whose name/description names a catalogue colour that
 * conflicts with a colour explicitly requested in the visitor's message.
 * Products with no colour word in their text (colour-neutral, or only
 * described by the count-only `colors` field) are left untouched.
 */
export function filterByRequestedColor(
  products: typeof catalogProducts,
  requestText: string
): typeof catalogProducts {
  const requested = colorWordsIn(requestText);
  if (requested.size === 0) return products;

  return products.filter((p) => {
    const productColors = colorWordsIn(`${p.name} ${p.description}`);
    if (productColors.size === 0) return true;
    return [...requested].some((c) => productColors.has(c));
  });
}

/**
 * Same colour filter as {@link filterByRequestedColor}, applied to the whole
 * catalog before it's ever shown to the model — so a conflicting product
 * (e.g. "VTC Black") isn't just excluded from the final cards, it's never in
 * the model's candidate pool and can't be named in the reply text either.
 */
export function filterCatalogByColor(requestText: string): typeof catalogProducts {
  return filterByRequestedColor(catalogProducts, requestText);
}

const APP_TYPE_KEYWORDS: Record<AppType, string[]> = {
  Packaging: ["packag", "box", "wrap", "bag", "carton", "gift"],
  "Stationery & Print": ["stationery", "invitation", "card", "letterhead", "wedding", "menu", "certificate", "office"],
  "Digital Printing": ["digital print", "print", "flyer", "brochure", "poster", "offset"],
  "Covering & Binding": ["bind", "cover", "book cover", "spine", "hardcover"],
};

/** Guesses the most likely application from free-text conversation content, for the fallback recommender below. */
function inferAppTypeFromText(text: string): AppType | null {
  const lower = text.toLowerCase();
  for (const [app, keywords] of Object.entries(APP_TYPE_KEYWORDS) as [AppType, string[]][]) {
    if (keywords.some((k) => lower.includes(k))) return app;
  }
  return null;
}

/**
 * Deterministic last-resort recommender: used only when the visitor already
 * got one clarifying question with no products and the model asks a SECOND
 * one anyway instead of recommending — the LLM can't be trusted to reliably
 * self-enforce "always end in a recommendation," so this guarantees the
 * conversation still produces real products from a plain keyword match
 * against the (already colour-filtered) candidate catalogue.
 */
export function pickFallbackProducts(
  candidates: typeof catalogProducts,
  conversationText: string
): typeof catalogProducts {
  const app = inferAppTypeFromText(conversationText);
  if (!app) return [];
  return candidates.filter((p) => p.app === app).slice(0, 3);
}
