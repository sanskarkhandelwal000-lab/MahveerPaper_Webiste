// Fixed enquiry-type list for the Contact form's "Enquiry Type" field (revision
// brief, section B). This is deliberately NOT the catalogue's application
// categories (data/products.ts APP_TYPES) — it's the *reason* someone is
// filling the form out, not a paper end-use.
export const ENQUIRY_TYPES = [
  "Check Price & Stock",
  "Request Samples",
  "General Paper Requirement",
  "DigiLux Sample Pack",
  "Favini Swatches",
  "Sustainability/FSC Requirement",
  "Other",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
