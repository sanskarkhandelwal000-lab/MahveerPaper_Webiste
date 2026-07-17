import type { Category } from "@/types";

// Category cards exactly as in the Figma home page design (frame 35:1217).
export const categories: Category[] = [
  {
    id: "school-office",
    title: "School & Office",
    description:
      "A high-density weave mimicking the tactile complexity of heritage flax. Ideal for archival correspondence.",
    image: "/figma/card-school-office.png",
    href: "/products",
  },
  {
    id: "packaging",
    title: "Packaging",
    description:
      "Crafted from 100% post-consumer waste, featuring a raw, untreated edge and visible organic inclusions.",
    image: "/figma/card-packaging.png",
    href: "/products",
  },
  {
    id: "high-end-printing",
    title: "High End Printing",
    description:
      "Crafted from 100% post-consumer waste, featuring a raw, untreated edge and visible organic inclusions.",
    image: "/figma/card-printing.png",
    href: "/products",
  },
];
