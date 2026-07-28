import { APP_TYPES, catalogProducts, type AppType } from "@/data/products";
import { slugify } from "@/lib/utils";

// Home page "Our Services" cards — one per real application group (AppType),
// so clicking a card leads to every product suited to that use case at
// /products/application/[app] instead of a generic, non-filtering link.
// Descriptions are curated editorial copy. Images are editorial lifestyle
// photography (not flat product-swatch photos, which read as too plain for a
// marketing section) — licensed Adobe Stock photos, downloaded full-resolution
// and resized for web, stored in public/images/applications/: a gift box,
// a wedding invitation flatlay, an offset press, and bound antique book spines.
const APP_DESCRIPTIONS: Record<AppType, string> = {
  Packaging: "Rigid boxes, cartons, tags and luxury wrapping — colourfast, durable stocks built for real-world handling.",
  "Stationery & Print": "Invitations, correspondence and fine artist papers with a tactile, premium hand-feel.",
  "Digital Printing": "Consistent, machine-verified stocks engineered for sharp, reliable digital and offset output.",
  "Covering & Binding": "Decorative covering papers and structural boards for book covers, cases and binders.",
};

const APP_IMAGE: Record<AppType, string> = {
  Packaging: "/images/applications/packaging.jpg",
  "Stationery & Print": "/images/applications/stationery-print.jpg",
  "Digital Printing": "/images/applications/digital-printing.jpg",
  "Covering & Binding": "/images/applications/covering-binding.jpg",
};

export interface ServiceApplicationCard {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  productCount: number;
}

export const serviceApplications: ServiceApplicationCard[] = APP_TYPES.map((appType) => ({
  id: slugify(appType),
  title: appType,
  description: APP_DESCRIPTIONS[appType],
  image: APP_IMAGE[appType],
  href: `/products/application/${slugify(appType)}`,
  productCount: catalogProducts.filter((p) => p.app === appType).length,
}));
