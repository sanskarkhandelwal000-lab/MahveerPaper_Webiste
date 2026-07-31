import { APP_TYPES } from "@/data/products";

// Derived from the catalog's real application categories (data/products.ts)
// rather than a separately hand-maintained list, so the Contact form's
// dropdown can never drift out of sync with what the rest of the site
// (Products filters, chatbot, homepage service cards) actually calls these.
// "Other" is added as a catch-all for enquiries that don't fit a catalog app.
export const APPLICATION_TYPES = [...APP_TYPES, "Other"] as const;

export type ApplicationType = (typeof APPLICATION_TYPES)[number];
