import { catalogProducts, AI_KNOWLEDGE_BASE, type AppType } from "@/data/products";

/**
 * Compact, token-efficient serialization of the catalog for the chatbot's
 * system prompt. One line per product so Claude can scan and match without
 * needing a retrieval step — the catalog is small enough to fit inline.
 */
export function buildCatalogPromptContext(
  products: typeof catalogProducts = catalogProducts
): string {
  return products
    .map((p) => {
      const sizeText = p.sizes ? ` | sizes: ${p.sizes}` : "";
      const base = `${p.id} | ${p.book} | ${p.name} | ${p.gsm}${sizeText} | ${p.colors} colour(s) | ${p.type} | ${p.app} | ${p.description}`;
      // Only the "Excellent" suitability entries — these are the uses this
      // family is genuinely best positioned for, per the source spreadsheet's
      // own ranking, not just anything it's merely compatible with.
      const bestApplications = (p.applicationSuitability ?? [])
        .filter((a) => a.suitability === "Excellent")
        .map((a) => a.application);
      // Only surface finishing/printing processes explicitly flagged as NOT
      // recommended — this is what actually prevents a bad recommendation
      // (e.g. Spot UV), rather than listing every compatible process.
      const unsuitableProcesses = [
        ...Object.entries(p.printingCompatibility ?? {}),
        ...Object.entries(p.finishingCompatibility ?? {}),
      ]
        .filter(([, v]) => /not recommended/i.test(v))
        .map(([k]) => k);
      const extras = [
        p.brand && `Brand: ${p.brand}`,
        p.bestFor && `Best for: ${p.bestFor}`,
        bestApplications.length && `Excels at: ${bestApplications.join(", ")}`,
        p.aiSummary && `Recommendation notes: ${p.aiSummary}`,
        p.sustainabilityNote && `Sustainability: ${p.sustainabilityNote}`,
        unsuitableProcesses.length && `Not recommended for: ${unsuitableProcesses.join(", ")}`,
        p.customerWarning && `Caution: ${p.customerWarning}`,
      ].filter(Boolean);
      return extras.length ? `${base}\n  ${extras.join(" | ")}` : base;
    })
    .join("\n");
}

/**
 * The source spreadsheet's own "AI Knowledge Base" sheet — behavioural rules
 * its authors defined for how the chatbot should recommend and talk about
 * products (only recommend Active stock, never claim unverified specs, warn
 * about dark-paper CMYK visibility, etc). Rendered as plain instructions so
 * the system prompt is grounded in the sheet's stated policy rather than
 * rules invented independently in code.
 */
export function buildKnowledgeBaseRules(): string {
  return AI_KNOWLEDGE_BASE
    .map((r) => `- [${r.category}] ${r.rule}${r.notes ? ` (${r.notes})` : ""}`)
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
 * Colour words a visitor might type, matched against each product's real
 * `colorNames` (sourced from the catalogue spreadsheet's Colour Name column)
 * rather than guessed from name/description prose — several product names no
 * longer contain their colour at all (e.g. "VTC" used to be "VTC Black"), so
 * text-scanning would silently stop catching conflicts. This is a
 * deterministic backstop so a mismatched colour can never reach the user even
 * if the model's own colour reasoning slips.
 */
const CATALOG_COLOR_WORDS = [
  "white", "black", "cream", "ivory", "gold", "grey", "gray", "natural", "brown",
  "blue", "green", "red", "pink", "orange", "yellow", "purple", "violet",
  "metallic", "maroon", "turquoise", "petrol", "silver",
];

function colorWordsIn(text: string): Set<string> {
  const lower = text.toLowerCase();
  return new Set(CATALOG_COLOR_WORDS.filter((c) => lower.includes(c)));
}

/**
 * A few `colorNames` in the sheet are Italian (Favini convention, e.g. "Nero").
 * Translated only for matching purposes here — the raw name stays as-is in the
 * data itself so the product detail page's swatch grid shows one card per real
 * colour instead of a duplicate English/Italian pair.
 */
const ITALIAN_TO_ENGLISH_COLOR: Record<string, string> = {
  Nero: "Black", Bianco: "White", Verde: "Green", Blu: "Blue", Marrone: "Brown", Rosso: "Red", Grigio: "Grey",
};

function colorNamesForMatching(names: string[]): string[] {
  return names.flatMap((n) => (ITALIAN_TO_ENGLISH_COLOR[n] ? [n, ITALIAN_TO_ENGLISH_COLOR[n]] : [n]));
}

/**
 * Drops any product whose known colour names conflict with a colour
 * explicitly requested in the visitor's message. Products with no colour
 * words among their `colorNames` (colour-neutral, or missing colour data
 * entirely) are left untouched rather than assumed to conflict.
 */
export function filterByRequestedColor(
  products: typeof catalogProducts,
  requestText: string
): typeof catalogProducts {
  const requested = colorWordsIn(requestText);
  if (requested.size === 0) return products;

  return products.filter((p) => {
    const known = p.colorNames?.length ? colorNamesForMatching(p.colorNames) : [p.name, p.description];
    const productColors = colorWordsIn(known.join(" "));
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
