import type { Category } from "@/types";
import { BOOKS, catalogProducts, type BookName } from "@/data/products";
import { slugify } from "@/lib/utils";

// Home page "Category" cards — one per real product catalogue (book), so
// clicking a card leads straight to that catalogue's actual products at
// /products/catalogue/[book] instead of a generic, non-filtering link.
// Descriptions are curated editorial copy; images are picked from real product
// photos already verified in data/products.ts, preferring a Favini shot where
// one exists in that book for a more premium first impression.
const BOOK_DESCRIPTIONS: Record<BookName, string> = {
  Spectrum: "Vivid, through-coloured papers and boards in bold, saturated shades for standout print and packaging.",
  Textures: "Richly textured finishes — linen, hammer, felt and embossed — for tactile, premium presentation pieces.",
  "Blacks & Krafts": "Deep commercial blacks and natural kraft papers for bold covers, tags and rugged packaging.",
  Earth: "Recycled and natural-fibre papers with a soft, organic character for sustainable, premium projects.",
  "Gloss & Metallic": "Shimmering pearlescent and metallic finishes that add instant luxury to any print or pack.",
  Coverings: "Decorative covering papers for rigid boxes, binders and premium book covers with real texture.",
  Speciality: "Synthetic, absorbent and pressure-sensitive specialty stocks for demanding, non-standard applications.",
  "Core Board": "Sturdy binding and structural boards in a range of thicknesses for book covers and rigid cases.",
};

// Preferred representative image per book — a real Favini photo where this
// book has one, for a more premium card image than a generic swatch.
const BOOK_IMAGE_OVERRIDE: Partial<Record<BookName, string>> = {
  Spectrum: "/images/favini/burano.jpg",
  Textures: "/images/favini/twill.jpg",
  Earth: "/images/favini/shiro-echo.jpg",
  "Gloss & Metallic": "/images/favini/majestic.jpg",
  Coverings: "/images/favini/classy-cover.jpg",
};

function representativeImage(book: BookName): string {
  if (BOOK_IMAGE_OVERRIDE[book]) return BOOK_IMAGE_OVERRIDE[book]!;
  const productsInBook = catalogProducts.filter((p) => p.book === book);
  const withRealPhoto = productsInBook.find((p) => !p.image.includes("pending-photo"));
  return (withRealPhoto ?? productsInBook[0])?.image ?? "/swatches/pending-photo.jpg";
}

export const categories: Category[] = BOOKS.map((book) => ({
  id: slugify(book),
  title: book,
  description: BOOK_DESCRIPTIONS[book],
  image: representativeImage(book),
  href: `/products/catalogue/${slugify(book)}`,
}));
