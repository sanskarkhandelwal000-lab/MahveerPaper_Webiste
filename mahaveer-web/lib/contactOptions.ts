export const RENOVATION_TYPES = [
  "Printing & Publishing",
  "Packaging",
  "School & Office Supplies",
  "High-End Printing",
  "Industrial / Specialty",
  "Other",
] as const;

export type RenovationType = (typeof RENOVATION_TYPES)[number];
