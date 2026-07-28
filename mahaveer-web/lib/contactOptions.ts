export const APPLICATION_TYPES = [
  "Printing & Publishing",
  "Packaging",
  "School & Office Supplies",
  "High-End Printing",
  "Industrial / Specialty",
  "Other",
] as const;

export type ApplicationType = (typeof APPLICATION_TYPES)[number];
