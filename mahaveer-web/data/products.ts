// Product catalogue sourced from "Mahaveer_Papers_AI_Master_v2_2_Revised.xlsx" (Products, Paper
// Families, Applications, Printing Compatibility, Finishing Compatibility, Website & AI Content and
// Technical Specifications sheets), grouped by Paper Family — one card per family, aggregating its
// individual GSM/colour SKU rows.
// Images: ONLY confirmed Favini-brand families (isFavini: true) have a photo — real images
// downloaded from favini.com, hosted locally under /public/images/favini/. Every non-Favini
// family has no image field at all, per instruction — the UI renders a plain placeholder
// wherever it's absent, until Mahaveer supplies their own real product photography.

export const BOOKS = [
  "Spectrum",
  "Textures",
  "Blacks & Krafts",
  "Earth",
  "Gloss & Metallic",
  "Coverings",
  "Speciality",
  "Core Board",
] as const;

export type BookName = (typeof BOOKS)[number];

export const PRODUCT_TYPES = ["Color", "Textured", "Eco", "Metallic", "Specialty", "Board"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const APP_TYPES = ["Packaging", "Stationery & Print", "Digital Printing", "Covering & Binding"] as const;
export type AppType = (typeof APP_TYPES)[number];

// Raw category values exactly as they appear in the source spreadsheet's Paper Type /
// Primary Application / Colour Group columns — used for the Products page filter
// dropdowns so their options match the sheet precisely, rather than the simplified
// type/app enums above (kept separately for internal chatbot logic that needs a
// small controlled set, e.g. mapping to the contact form's "Application" field).
export const PAPER_TYPE_OPTIONS = [
  "100% Recycled Premium Paper",
  "BOPP Polymeric Synthetic Paper",
  "Binding",
  "Board",
  "Case Binding",
  "Coaster Board",
  "Coloured Woodfree Paper",
  "Commercial Black Paper and Board",
  "Commercial Black Uncoated Paper",
  "Commercial Coloured Paper",
  "Commercial Rough Paper",
  "Covering Paper",
  "Decorative Covering Paper",
  "Eco-Friendly Recycled Fine Paper",
  "Embossed Covering Paper",
  "Felt-Marked Premium Fine Paper",
  "Folding Box and Packaging Board",
  "High-Bulk Natural Paper and Board",
  "High-Bulk Textured Premium Board",
  "Ivory Fine Paper and Board",
  "Metallic",
  "Natural Bamboo Paper and Board",
  "Natural Tracing Paper",
  "Paper",
  "Paper-Film-Paper Synthetic Composite",
  "Pearlescent Paper and Board",
  "Premium Coloured Fine Paper and Board",
  "Premium Covering Paper",
  "Premium High-Definition Uncoated Paper",
  "Premium Natural White Fine Paper and Board",
  "Premium Rough Gloss Paper",
  "Premium Ultra-Matte Coloured Paper & Board",
  "Premium White",
  "Premium White Embossed Paper and Board",
  "Pressure-Sensitive Specialty Label",
  "Spunbonded HDPE Synthetic Sheet",
  "Structural Core Board",
  "Textured Premium Fine Paper",
  "Through-Coloured Solid Board",
  "Uncoated Absorbent Beermat",
  "Watercolour Artist Papers",
] as const;

export const APPLICATION_OPTIONS = [
  "Acrylic",
  "Book Covers & Binding",
  "Coasters",
  "Commercial Packaging",
  "Displays",
  "Durable Tags",
  "Exhibition Badges",
  "Folding Cartons",
  "General Printing",
  "Gouache",
  "Luxury Packaging",
  "Premium Boxes",
  "Premium Brochures",
  "Premium Printing",
  "Premium Product Labels",
  "Professional Watercolour",
  "Rigid Box Wrapping",
  "Rigid Boxes",
  "Stationery",
  "Sustainable Luxury Packaging",
  "Sustainable Packaging",
  "Tempera",
  "Watercolour",
  "Wedding & Invitation Cards",
  "Wedding Invitation Overlays",
] as const;

export const COLOUR_GROUP_OPTIONS = [
  "Black",
  "Blue",
  "Brown",
  "Clear",
  "Green",
  "Grey",
  "Ivory",
  "Metallic",
  "Natural",
  "Orange",
  "Other",
  "Other Colours",
  "Pink",
  "Red",
  "White",
  "Yellow",
] as const;

export interface CatalogProduct {
  id: string;
  book: BookName;
  name: string;
  gsm: string;       // human-readable weight string, e.g. "120 · 250 · 300 GSM"
  /** Human-readable sheet-size string, e.g. "63 x 91 CM · 79 x 109 CM" — each SKU's own Size value, deduped and sorted by area. */
  sizes?: string;
  colors: number;    // distinct colour/finish variants available
  /** Real colour names from the source data — used to ground colour-matching instead of guessing from prose. */
  colorNames?: string[];
  /** Absent for every non-Favini family — only Favini products have a real photo. */
  image?: string;
  /** Real per-colour photos (client-provided, AI-cropped), keyed by the exact
   * colorNames entry they show. Rendered directly on the product detail page's
   * swatch grid — NEVER tinted, since these already show the true colour (and
   * often have the colour name printed right on the label). Populated one
   * colour at a time as photos are processed; colours without their own entry
   * here fall back to a plain hex swatch instead of a mismatched photo. */
  colorImages?: Record<string, string>;
  /** Per-colour weight, keyed by the exact colorNames entry — only present where a
   * family's colours genuinely differ (e.g. Burano: most shades are 250 GSM only,
   * but Cobalt/Nero also come in 320 GSM). Product detail page prefers this over
   * the family-level `gsm` string when a swatch has an entry here, since showing
   * every weight on every colour overstates what's actually available in that shade. */
  colorGsm?: Record<string, string>;
  /** Per-colour sheet size, keyed by the exact colorNames entry — only present where a
   * family's colours genuinely differ (e.g. Tube: Red is 70 x 100 CM only, while Black/
   * Brown/Petrol are 72 x 102 CM only). Product detail page prefers this over the
   * family-level `sizes` string when a swatch has an entry here, since showing every
   * size on every colour overstates what's actually available in that shade. */
  colorSizes?: Record<string, string>;
  /** Colour names for this family that have NO verified source (no exact name match on
   * the manufacturer's own site, no client-supplied photo) — e.g. Burano's "Burgundy"
   * vs. Favini's actual "Bordeaux". These are excluded from both colorImages and the
   * global COLOR_NAME_HEX fallback, so the swatch card shows the "Photo coming soon"
   * placeholder instead of a guessed image or guessed colour. See
   * Unmatched_Favini_Colours.xlsx for the full list and reasoning. */
  unverifiedColors?: string[];
  type: ProductType;
  app: AppType;
  /** Raw "Paper Type" values from the sheet (a family can span more than one) — powers the Products page filter. */
  paperTypes?: string[];
  /** Raw "Primary Application" values from the sheet — powers the Products page filter. */
  applications?: string[];
  /** Raw "Colour Group" values from the sheet — powers the Products page colour filter. */
  colourGroups?: string[];
  description: string;
  /** Richer AI-facing context from the source spreadsheet, used to ground the chatbot. */
  aiSummary?: string;
  bestFor?: string;
  sustainabilityNote?: string;
  customerWarning?: string;
  /** Raw SEO / AI keyword list from the Website & AI Content sheet. */
  seoKeywords?: string;
  /** True only for families with a confirmed Favini brand in the source data. */
  isFavini?: boolean;
  /** Brand exactly as recorded in the sheet (Favini, Mahaveer Papers, APP, DuPont, etc.). */
  brand?: string;
  finish?: string;
  texture?: string;
  fscCertified?: string;
  coatedUncoated?: string;
  /** 1-5 ratings from the Paper Families sheet, where supplied. */
  strengthRating?: number;
  premiumRating?: number;
  /** Machine/process suitability from the Printing Compatibility sheet (e.g. Offset, HP Indigo). */
  printingCompatibility?: Record<string, string>;
  /** Converting/finishing suitability from the Finishing Compatibility sheet (e.g. Foiling, Die Cutting). */
  finishingCompatibility?: Record<string, string>;
  /** Ranked real-world uses from the Applications sheet (Excellent/Good/Possible), most suitable first. */
  applicationSuitability?: { application: string; suitability: string }[];
  /** Free-text technical/converting guidance folded in from the Printing/Finishing Compatibility and Technical Specifications sheets. */
  technicalNotes?: string;
}

export const catalogProducts: CatalogProduct[] = [

  // ── SPECTRUM ──────────────────────────────────────────────────────────────
  {
    id: "colour-paper-wood-free",
    book: "Spectrum",
    name: "Colour Woodfree",
    gsm: "80 GSM",
    sizes: "63.5 x 91.4 CM",
    colors: 12,
    colorNames: ["Cream", "Peach", "Pink", "Blue", "Green", "Gold", "Turquoise", "Parrot Green", "Saffron", "Red", "Taro", "Hp Orange"],
    image: "/images/mahaveer/colour-paper-wood-free.jpg",
    colorImages: { "Cream": "/images/mahaveer/colour-paper-wood-free.jpg", "Peach": "/images/mahaveer/colour-paper-wood-free-peach.jpg", "Pink": "/images/mahaveer/colour-paper-wood-free-pink.jpg", "Blue": "/images/mahaveer/colour-paper-wood-free-blue.jpg", "Green": "/images/mahaveer/colour-paper-wood-free-green.jpg", "Gold": "/images/mahaveer/colour-paper-wood-free-gold.jpg", "Turquoise": "/images/mahaveer/colour-paper-wood-free-turquoise.jpg", "Parrot Green": "/images/mahaveer/colour-paper-wood-free-parrot-green.jpg", "Saffron": "/images/mahaveer/colour-paper-wood-free-saffron.jpg", "Red": "/images/mahaveer/colour-paper-wood-free-red.jpg", "Taro": "/images/mahaveer/colour-paper-wood-free-taro.jpg", "Hp Orange": "/images/mahaveer/colour-paper-wood-free-hp-orange.jpg" },
    type: "Color",
    app: "Stationery & Print",
    paperTypes: ["Coloured Woodfree Paper"],
    applications: ["General Printing"],
    colourGroups: ["Natural", "Ivory", "Other Colours", "Red", "Pink", "Blue", "Green", "Yellow", "Orange"],
    description: "General-purpose coloured woodfree paper made from pulp with mineral filler, starch and paper-making additives.",
    aiSummary: "Use as an economical coloured paper option for general printing, craft, inserts and communication. Do not claim certification or specialised print compatibility without testing.",
    bestFor: "General Printing, Craft & Stationery, Inserts & Flyers, Economical Tags",
    customerWarning: "Verify machine suitability where marked 'Suitable with testing'. Spot UV is not recommended unless separately tested.",
    seoKeywords: "colour paper wood free, craft & stationery, economical tags, general printing, inserts & flyers, premium paper, speciality paper",
    brand: "APP",
    finish: "Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "As required", "Folding": "Suitable" },
    applicationSuitability: [{ application: "General Printing", suitability: "Good" }, { application: "Craft & Stationery", suitability: "Good" }, { application: "Inserts & Flyers", suitability: "Good" }, { application: "Economical Tags", suitability: "Possible" }],
    technicalNotes: "No specific print recommendation was supplied; machine and ink trials are advised. Standard paper converting may be possible, but verify for the selected GSM and process.",
  },

  {
    // Merged per R018 sheet: Dark Green, Dark Red, Red Wine, Dark Blue, Dark Brown
    // and Mystique all share the sheet's "Dark Colours" Series — one card, six colourways.
    id: "dark-colours",
    book: "Spectrum",
    name: "Dark Colours",
    gsm: "110 · 250 · 280 · 300 GSM",
    sizes: "63 x 91 CM · 70 x 100 CM · 79 x 109 CM",
    colors: 6,
    colorNames: ["Dark Green", "Dark Red", "Red Wine", "Dark Blue", "Dark Brown", "Mystique"],
    colorGsm: {
      "Dark Green": "110 · 280 GSM", "Dark Red": "110 · 280 GSM", "Red Wine": "110 · 280 GSM",
      "Dark Blue": "110 · 280 GSM", "Dark Brown": "110 · 280 GSM", "Mystique": "250 · 300 GSM",
    },
    image: "/images/mahaveer/dark-green.jpg",
    colorImages: {
      "Dark Green": "/images/mahaveer/dark-green.jpg",
      "Dark Red": "/images/mahaveer/dark-red.jpg",
      "Red Wine": "/images/mahaveer/red-wine.jpg",
      "Dark Blue": "/images/mahaveer/dark-blue.jpg",
      "Dark Brown": "/images/mahaveer/dark-brown.jpg",
      "Mystique": "/images/mahaveer/mystique-black.jpg",
    },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Commercial Coloured Paper", "Board"],
    applications: ["Commercial Packaging"],
    colourGroups: ["Green", "Red", "Pink", "Blue", "Brown", "Black"],
    description: "Versatile coloured paper and board with printing and converting performance broadly similar to Burano, positioned as a cost-effective commercial option.",
    aiSummary: "Recommend when the customer needs a value-oriented coloured paper or board suitable for most printing and converting processes. For maximum stiffness, luxury feel or demanding packaging, recommend Burano instead.",
    bestFor: "Commercial Packaging; Invitations / Tags / Stationery",
    customerWarning: "Test the exact GSM, colour and machine before bulk production where compatibility is marked as testing.",
    seoKeywords: "dark colours, dark green, dark red, red wine, dark blue, dark brown, mystique, commercial packaging, speciality paper",
    finish: "Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    strengthRating: 3,
    premiumRating: 3,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Suitable with testing", "Screen Printing": "Suitable", "Inkjet": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for 280 gsm and heavier", "Folding": "Suitable with scoring for board" },
    technicalNotes: "Recommend when the customer needs a value-oriented coloured paper or board suitable for most printing and converting processes. For maximum stiffness, luxury feel or demanding packaging, recommend Burano instead.",
  },

  {
    id: "burano",
    book: "Spectrum",
    name: "Burano",
    gsm: "250 · 320 GSM",
    sizes: "70 x 100 CM",
    colors: 10,
    colorNames: ["Shocking Pink", "English Green", "Orange", "Fire Red", "Graphite Grey", "Tobacco", "Burgundy", "Coffee Brown", "Cobalt", "Nero"],
    colorGsm: {
      "Shocking Pink": "250 GSM", "English Green": "250 GSM", "Orange": "250 GSM", "Fire Red": "250 GSM",
      "Graphite Grey": "250 GSM", "Tobacco": "250 GSM", "Burgundy": "250 GSM", "Coffee Brown": "250 GSM",
      "Cobalt": "250 · 320 GSM", "Nero": "250 · 320 GSM",
    },
    image: "/images/favini/burano.jpg",
    // Real Favini product photography (favini.com/gs/en/products/burano) for colour
    // names that appear on Favini's official list verbatim, PLUS client-supplied real
    // photos (Pending Images/MP_500x500) for "Burgundy", "Coffee Brown", "Cobalt" and
    // "Nero" — these have no exact name match on Favini's own site, but the client's
    // own photo of the physical product is a direct source and always wins.
    colorImages: {
      "Shocking Pink": "/images/favini/burano-shocking-pink.jpg",
      "English Green": "/images/favini/burano-english-green.jpg",
      "Orange": "/images/favini/burano-orange.jpg",
      "Fire Red": "/images/favini/burano-fire-red.jpg",
      "Graphite Grey": "/images/favini/burano-graphite-grey.jpg",
      "Tobacco": "/images/favini/burano-tobacco.jpg",
      "Burgundy": "/images/favini/burano-burgundy.jpg",
      "Coffee Brown": "/images/favini/burano-coffee-brown.jpg",
      "Cobalt": "/images/favini/burano-cobalt.jpg",
      "Nero": "/images/favini/burano-nero.jpg",
    },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Premium Coloured Fine Paper and Board"],
    applications: ["Luxury Packaging"],
    colourGroups: ["Red", "Pink", "Green", "Other Colours", "Grey", "Brown", "Blue", "Black"],
    description: "Favini Burano is a premium smooth, through-coloured paper and board range with FSC-certified material available.",
    aiSummary: "Recommend for invitations, garment tags, premium communication, shopping bags and luxury packaging.",
    bestFor: "Luxury Packaging; Invitations; Garment Tags; Shopping Bags",
    sustainabilityNote: "FSC available",
    customerWarning: "Pre-score board weights and test the intended digital press.",
    seoKeywords: "favini burano, coloured paper, FSC paper, luxury packaging, invitation paper",
    isFavini: true,
    brand: "Favini",
    finish: "Matte",
    texture: "Smooth",
    fscCertified: "Yes - FSC available",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable with testing", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Luxury Packaging", suitability: "Excellent" }, { application: "Wedding & Invitation Cards", suitability: "Excellent" }, { application: "Garment Tags", suitability: "Excellent" }, { application: "Corporate Communication", suitability: "Good" }, { application: "Shopping Bags", suitability: "Good" }],
    technicalNotes: "Use good-quality semi-fresh inks, compressible blankets and 150–175 lpi. Allow sufficient drying. Confirm digital machine compatibility before production. Embossing, punching, die cutting, creasing, laminating and UV varnishing are possible. Condition wrapped paper in the pressroom before use. Pastel/bright colours Dark colours",
  },

  {
    id: "tube",
    book: "Spectrum",
    name: "The Tube",
    gsm: "120 · 260 · 310 · 340 GSM",
    sizes: "70 x 100 CM · 72 x 102 CM",
    colors: 4,
    colorNames: ["Black", "Red", "Brown", "Petrol"],
    colorGsm: { "Black": "120 · 260 · 310 GSM", "Red": "120 · 310 GSM", "Brown": "120 · 340 GSM", "Petrol": "120 · 340 GSM" },
    // Each colour ships in exactly one sheet size, not both — Red is 70 x 100 CM only,
    // Black/Brown/Petrol are 72 x 102 CM only (source: R018 master sheet SKUs 50045-50053).
    colorSizes: { "Black": "72 x 102 CM", "Red": "70 x 100 CM", "Brown": "72 x 102 CM", "Petrol": "72 x 102 CM" },
    image: "/images/favini/tube.jpg",
    // Real Favini photos (favini.com/gs/en/products/tube) — Black and Petrol only, both
    // exact matches on Favini's own colour list. "Red" and "Brown" have NO match on that
    // list at all (Favini's Tube range is Chalk/Mud/Graphite/Petrol/Dust/Toffee/Marrone/
    // Black/Black Max/Hide-variants), but both now have client-supplied real photos of
    // the actual product (Pending Images/MP_500x500), which are a direct source.
    colorImages: {
      "Black": "/images/favini/tube-black.jpg",
      "Red": "/images/favini/tube-red.jpg",
      "Brown": "/images/favini/tube-brown.jpg",
      "Petrol": "/images/favini/tube-petrol.jpg",
    },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Premium Ultra-Matte Coloured Paper & Board"],
    applications: ["Luxury Packaging"],
    colourGroups: ["Black", "Red", "Pink", "Brown", "Blue"],
    description: "Premium coloured paper and board with a flawless ultra-matte, smoothly tactile surface engineered to resist finger marking.",
    aiSummary: "Recommend Tube when the customer wants a deep, modern ultra-matte surface for premium invitations, covers and luxury packaging, especially where finger-mark resistance matters.",
    isFavini: true,
    brand: "Favini",
    finish: "Ultra Matte",
    texture: "Smooth tactile",
    coatedUncoated: "Special matte surface",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for boards", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Luxury Packaging", suitability: "Excellent" }, { application: "Wedding & Invitation Cards", suitability: "Excellent" }, { application: "Premium Covers", suitability: "Excellent" }, { application: "Garment Tags", suitability: "Excellent" }, { application: "Corporate Stationery", suitability: "Good" }],
    technicalNotes: "Use print settings appropriate to the specialised matte surface; test dense solids and digital equipment. Premium converting is suitable subject to GSM and press testing. 1/S, 2/S or embossed variants depending GSM",
  },

  {
    id: "sumo",
    book: "Spectrum",
    name: "Sumo",
    gsm: "700 GSM",
    sizes: "71 x 101 CM",
    colors: 5,
    colorNames: ["White", "Kraft Brown", "Dark Grey", "Red", "Black"],
    image: "/images/favini/sumo.jpg",
    // Favini's own Sumo page (favini.com/gs/en/products/sumo) has no unique board
    // photography for these 5 colours — it reuses photos from their other paper lines
    // (Biancoflash, Burano) as swatch stand-ins. Mirroring that exactly, per instruction,
    // rather than inventing our own: these are paper photos, not Sumo's actual board texture.
    colorImages: {
      "White": "/images/favini/sumo-white.jpg",
      "Kraft Brown": "/images/favini/sumo-kraft-brown.jpg",
      "Dark Grey": "/images/favini/sumo-dark-grey.jpg",
      "Red": "/images/favini/sumo-red.jpg",
      "Black": "/images/favini/sumo-black.jpg",
    },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Through-Coloured Solid Board"],
    applications: ["Premium Boxes", "Displays"],
    colourGroups: ["White", "Clear", "Natural", "Ivory", "Grey", "Red", "Pink", "Black"],
    description: "Favini Sumo is a thick, through-coloured solid board with colour visible through the edge.",
    aiSummary: "Recommend for premium boxes, displays, decorative boards and structural luxury applications.",
    bestFor: "Premium Boxes; Displays; Decorative Board",
    sustainabilityNote: "FSC available",
    customerWarning: "Special grooving or kiss-cut creasing may be required at higher thickness.",
    seoKeywords: "favini sumo, solid colour board, thick board, premium boxes",
    isFavini: true,
    brand: "Favini",
    finish: "Matte",
    texture: "Smooth solid board",
    coatedUncoated: "Uncoated",
    strengthRating: 5,
    premiumRating: 5,
    printingCompatibility: { "Offset": "Limited / letterpress and platen screen recommended", "Digital Toner": "Suitable on UV inkjet flatbed", "Screen Printing": "Suitable on platen presses", "Inkjet": "Suitable on UV flatbed", "Laser Printing": "Suitable for cutting and engraving", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable on UV inkjet flatbed", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable", "Scoring": "Special grooving / kiss-cut creasing recommended", "Folding": "Difficult at higher thicknesses" },
    applicationSuitability: [{ application: "Premium Boxes", suitability: "Excellent" }, { application: "Displays", suitability: "Excellent" }, { application: "Decorative Structural Board", suitability: "Excellent" }, { application: "Museum / Presentation Board", suitability: "Good" }],
    technicalNotes: "Recommend where a thick, through-coloured board and exposed coloured edge are important. Use laser cutting or engraving, hot foil and specialist creasing; conventional folding becomes difficult at higher thicknesses. Through-coloured solid board",
  },

  // ── TEXTURES ──────────────────────────────────────────────────────────────
  {
    id: "textures",
    book: "Textures",
    name: "MP Textures",
    gsm: "300 · 350 GSM",
    sizes: "33 x 48 CM · 67 x 98 CM · 70 x 100 CM",
    // Was wrongly collapsed to 3 generic colour swatches (Cream/White/Natural) — the
    // sheet's "Colour Name" field really is just Cream/White/Natural for all 18 SKUs,
    // but each is a genuinely different embossed pattern (its own "Texture" field value:
    // Needle Point, Linea, Valentino, Silk Soie, etc.), not a repeat of the same product.
    // Same root-cause bug as Cotton's 25/35/60% variants — fixed the same way, swatch
    // name = "{Texture} {Colour}" straight from the sheet, no photos guessed.
    colors: 18,
    colorNames: [
      "Needle Point Cream", "Linea Cream", "Fine Toie Cream", "Valentino Cream", "Toyle Moyne Cream", "Silk Soie Cream", "Design Bag Cream",
      "Needle Point White", "Design Bag White", "Valentino White", "Classic Linen White", "Linea White", "Toyle Moyne White", "Silk Soie White", "Canvas Linen White", "White Net", "K Linen White",
      "Natural Rock",
    ],
    colorGsm: {
      "Needle Point Cream": "300 GSM", "Linea Cream": "300 GSM", "Fine Toie Cream": "300 GSM", "Valentino Cream": "300 GSM",
      "Toyle Moyne Cream": "300 GSM", "Silk Soie Cream": "300 GSM", "Design Bag Cream": "300 GSM",
      "Needle Point White": "300 GSM", "Design Bag White": "300 GSM", "Valentino White": "300 GSM", "Classic Linen White": "300 GSM",
      "Linea White": "300 GSM", "Toyle Moyne White": "300 GSM", "Silk Soie White": "300 GSM", "Canvas Linen White": "300 GSM",
      "White Net": "300 GSM", "K Linen White": "350 GSM",
      "Natural Rock": "300 GSM",
    },
    // Real per-SKU photography from the client's own 4x5_texture_crops set, matched by
    // exact SKU number (50059–50076) — not guessed, not reused across patterns.
    colorImages: {
      "Needle Point Cream": "/images/mahaveer/textures/needle-point-cream.jpg",
      "Linea Cream": "/images/mahaveer/textures/linea-cream.jpg",
      "Fine Toie Cream": "/images/mahaveer/textures/fine-toie-cream.jpg",
      "Valentino Cream": "/images/mahaveer/textures/valentino-cream.jpg",
      "Toyle Moyne Cream": "/images/mahaveer/textures/toyle-moyne-cream.jpg",
      "Silk Soie Cream": "/images/mahaveer/textures/silk-soie-cream.jpg",
      "Design Bag Cream": "/images/mahaveer/textures/design-bag-cream.jpg",
      "Needle Point White": "/images/mahaveer/textures/needle-point-white.jpg",
      "Design Bag White": "/images/mahaveer/textures/design-bag-white.jpg",
      "Valentino White": "/images/mahaveer/textures/valentino-white.jpg",
      "Classic Linen White": "/images/mahaveer/textures/classic-linen-white.jpg",
      "Linea White": "/images/mahaveer/textures/linea-white.jpg",
      "Toyle Moyne White": "/images/mahaveer/textures/toyle-moyne-white.jpg",
      "Silk Soie White": "/images/mahaveer/textures/silk-soie-white.jpg",
      "Canvas Linen White": "/images/mahaveer/textures/canvas-linen-white.jpg",
      "White Net": "/images/mahaveer/textures/white-net.jpg",
      "K Linen White": "/images/mahaveer/textures/k-linen-white.jpg",
      "Natural Rock": "/images/mahaveer/textures/natural-rock.jpg",
    },
    image: "/images/mahaveer/textures/needle-point-cream.jpg",
    type: "Textured",
    app: "Packaging",
    paperTypes: ["High-Bulk Textured Premium Board"],
    applications: ["Luxury Packaging"],
    colourGroups: ["Natural", "Ivory", "White", "Clear"],
    description: "A consolidated premium texture range in which every SKU uses the Paper Family 'Textures' and the individual surface is identified separately in the Texture field.",
    aiSummary: "Recommend by texture name and application. Suitable for toner-based digital printing, offset, screen printing, foiling, embossing, die cutting and premium packaging, subject to production trials.",
    bestFor: "Luxury Packaging; Wedding Cards; Garment Tags; Premium Communication",
    sustainabilityNote: "FSC Mix Credit where applicable",
    customerWarning: "Spot UV is not recommended. Confirm the exact texture, GSM and machine before bulk production.",
    seoKeywords: "textures, textured paper, linen paper, felt marked, needle point, bag texture, net texture, premium packaging",
    finish: "Textured Matte",
    fscCertified: "FSC Mix Credit where applicable",
    coatedUncoated: "Uncoated",
    strengthRating: 5,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended", "Folding": "Suitable with scoring" },
    technicalNotes: "Common compatibility for approved Mahaveer texture products. Individual machine trials remain advisable. Use the Texture field to identify the individual finish.",
  },

  {
    id: "prisma",
    book: "Textures",
    name: "Prisma",
    gsm: "120 · 250 · 300 GSM",
    sizes: "72 x 102 CM",
    colors: 2,
    colorNames: ["White", "Ivory"],
    image: "/images/favini/prisma.jpg",
    // Favini's site (favini.com/gs/en/products/prisma) — both "03 White" and "05 Ivory"
    // have real dedicated photos (Prisma-White / Prisma-05-Ivory).
    colorImages: {
      "White": "/images/favini/prisma-white.jpg",
      "Ivory": "/images/favini/prisma-ivory.jpg",
    },
    type: "Textured",
    app: "Packaging",
    paperTypes: ["Felt-Marked Premium Fine Paper"],
    applications: ["Wedding & Invitation Cards"],
    colourGroups: ["White", "Clear", "Natural", "Ivory"],
    description: "Premium felt-marked paper with a classic tactile texture, available in one-sided and two-sided versions across multiple colours and grammages.",
    aiSummary: "Primary: commercial luxury packaging. Secondary: garment tags, button cards and garment accessories.",
    isFavini: true,
    brand: "Favini",
    finish: "Matte",
    texture: "Felt marked",
    fscCertified: "Yes - FSC certificate supplied",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Wedding & Invitation Cards", suitability: "Excellent" }, { application: "Luxury Packaging", suitability: "Excellent" }, { application: "Corporate Stationery", suitability: "Excellent" }, { application: "Book & Folder Covers", suitability: "Good" }, { application: "Garment Tags", suitability: "Good" }],
    technicalNotes: "Use settings appropriate for a felt-marked sheet. Perform print trials for dense solids and digital machines. Suitable for premium converting; pre-score heavier grammages. Two-sided white and colour versions",
  },

  {
    id: "twill",
    book: "Textures",
    name: "Twill",
    gsm: "120 · 240 · 300 GSM",
    sizes: "72 x 102 CM",
    colors: 2,
    colorNames: ["Bright White", "Ivory"],
    image: "/images/favini/twill.jpg",
    // Real Favini photos (favini.com/gs/en/products/twill) — both colours are exact
    // matches on Favini's own list, and both have dedicated Twill photography (not
    // borrowed from another product line).
    colorImages: {
      "Bright White": "/images/favini/twill-bright-white.jpg",
      "Ivory": "/images/favini/twill-ivory.jpg",
    },
    type: "Textured",
    app: "Packaging",
    paperTypes: ["Textured Premium Fine Paper"],
    applications: ["Wedding & Invitation Cards"],
    colourGroups: ["White", "Clear", "Natural", "Ivory"],
    description: "Premium textured paper with a textile-inspired twill pattern, designed for sophisticated communication, invitations, covers and packaging.",
    aiSummary: "Recommend Twill when the customer wants a refined linen or fabric-like texture for premium invitations, folders, covers or packaging.",
    isFavini: true,
    brand: "Favini",
    finish: "Matte",
    texture: "Twill / Linen weave",
    fscCertified: "Yes - FSC certificate supplied",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Wedding & Invitation Cards", suitability: "Excellent" }, { application: "Luxury Packaging", suitability: "Excellent" }, { application: "Folders & Covers", suitability: "Excellent" }, { application: "Corporate Stationery", suitability: "Good" }],
    technicalNotes: "Run press tests because the textile texture can affect fine image reproduction and ink lay. Suitable for premium converting subject to GSM and process testing.",
  },

  {
    id: "tradition-valentino",
    book: "Textures",
    name: "Tradition Valentino Ivory",
    gsm: "120 · 300 GSM",
    sizes: "72 x 102 CM",
    colors: 1,
    colorNames: ["Ivory"],
    // "Tradition Valentino" doesn't exist as a product on favini.com at all (checked
    // their site search — no results for "Tradition" or "Valentino"). Likely a classic
    // embossing-finish name applied across other Favini ranges rather than its own
    // current product line. No Favini-site source, but now has a client-supplied real
    // photo of the actual product (Pending Images/MP_500x500), which is a direct source.
    colorImages: { "Ivory": "/images/favini/tradition-valentino-ivory.jpg" },
    image: "/images/mahaveer/tradition-valentino.jpg",
    type: "Textured",
    app: "Digital Printing",
    paperTypes: ["Premium White Embossed Paper and Board"],
    description: "Favini Tradition Valentino is an embossed premium white paper and board following the Bianco Flash Embossed profile.",
    aiSummary: "Recommend for wedding cards, invitations, premium packaging, covers and tags.",
    bestFor: "Invitations; Wedding Cards; Luxury Packaging",
    sustainabilityNote: "FSC",
    customerWarning: "Pre-score board weights; test machine performance on the embossed texture.",
    seoKeywords: "tradition valentino, embossed white paper, favini, invitation paper",
    isFavini: true,
    brand: "Favini",
    finish: "Embossed Matte",
    texture: "Valentino Embossed",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 5,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable with testing", "Laser Printing": "Guaranteed on selected Natural grades 80–160 gsm; otherwise test", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Wedding & Invitation Cards", suitability: "Excellent" }, { application: "Luxury Packaging", suitability: "Excellent" }, { application: "Covers & Folders", suitability: "Good" }, { application: "Garment Tags", suitability: "Good" }],
    technicalNotes: "Recommend Biancoflash for high-quality white or ivory print, stationery, invitations and packaging. Select Premium for maximum whiteness, Natural for a softer white, Ivory for a warm tone and Embossed for texture. Inherited from Bianco Flash Embossed profile",
  },

  {
    id: "cotton",
    book: "Textures",
    name: "Favini Art",
    gsm: "240 · 300 GSM",
    sizes: "70 x 100 CM",
    colors: 3,
    // These are 3 distinct SKUs distinguished by cotton content (25% / 35% / 60%), not by
    // colour — the sheet's "Colour Name" field is "Natural" for all three (same shade),
    // which previously collapsed them into a single swatch and hid the real product
    // variants. Sheet source confirms 25% (not 20%), per SKUs 50091–50093.
    colorNames: ["25% Cotton", "35% Cotton", "60% Cotton"],
    colorGsm: { "25% Cotton": "240 GSM", "35% Cotton": "300 GSM", "60% Cotton": "300 GSM" },
    // Real per-variant Favini Art photos (favini.com/gs/en/products/favini-art), matched
    // via the sheet's own technical notes ("Watercolour Eco 25%", "Watercolour 35%",
    // "Watercolour Cloud 60%"). They visibly differ — 60% has a noticeably coarser grain
    // than 25/35% — so reusing one generic photo for all three (the original approach)
    // would have been wrong; corrected after being asked to verify. Favini's own site
    // reuses one photo for both 25% and 35% (same as their Sumo practice elsewhere),
    // mirrored here rather than guessing a third distinct image.
    colorImages: {
      "25% Cotton": "/images/favini/cotton-25.jpg",
      "35% Cotton": "/images/favini/cotton-25.jpg",
      "60% Cotton": "/images/favini/cotton-60.jpg",
    },
    image: "/images/favini/cotton.jpg",
    type: "Color",
    app: "Stationery & Print",
    paperTypes: ["Watercolour Artist Papers"],
    applications: ["Watercolour", "Gouache", "Acrylic", "Tempera", "Professional Watercolour"],
    colourGroups: ["Natural", "Ivory"],
    description: "Three Favini Art cotton watercolour papers: 25%, 35% and 60% Cloud, each maintained as a separate SKU-level technical profile.",
    aiSummary: "Select 25% for sustainable artist use, 35% for higher cotton-content wet media, and 60% Cloud for the most premium professional watercolour application.",
    isFavini: true,
    brand: "Favini",
    finish: "Natural Matte",
    texture: "Rough grain / Cloud felt-marked",
    coatedUncoated: "Uncoated",
    technicalNotes: "Favini Art Watercolour Eco 25% recycled cotton rag Favini Art Watercolour 35% cotton Favini Art Watercolour Cloud 60% cotton",
  },

  // ── BLACKS & KRAFTS ───────────────────────────────────────────────────────
  {
    id: "inline-nero",
    book: "Blacks & Krafts",
    name: "Inline Nero",
    gsm: "110 GSM",
    sizes: "63.5 x 91.4 CM · 71 x 101 CM · 79 x 109 CM",
    colors: 1,
    colorNames: ["Nero"],
    image: "/images/mahaveer/inline-nero.jpg",
    colorImages: { "Nero": "/images/mahaveer/inline-nero.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Commercial Black Uncoated Paper"],
    colourGroups: ["Black"],
    description: "Inline Nero is an economical smooth black paper stocked in 110 gsm and three standard sizes.",
    aiSummary: "Recommend for tags, envelopes, inserts, paper bags, craft and commercial printing.",
    bestFor: "Tags; Envelopes; Paper Bags; Commercial Printing",
    sustainabilityNote: "No FSC claim",
    customerWarning: "Test white-toner opacity and machine feeding.",
    seoKeywords: "inline nero, black paper 110 gsm, commercial black paper",
    brand: "Mahaveer Papers",
    finish: "Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    strengthRating: 3,
    premiumRating: 2,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Suitable" },
    applicationSuitability: [{ application: "Tags", suitability: "Good" }, { application: "Envelopes", suitability: "Good" }, { application: "Paper Bags", suitability: "Good" }, { application: "Commercial Printing", suitability: "Good" }, { application: "Craft", suitability: "Good" }],
    technicalNotes: "Test white-toner opacity and machine feeding before bulk production. Use creasing/scoring for cleaner folds where required.",
  },

  {
    id: "vtc",
    book: "Blacks & Krafts",
    name: "VTC Black",
    gsm: "120 · 200 · 250 · 300 · 600 · 900 GSM",
    sizes: "70 x 100 CM · 71 x 101 CM · 79 x 109 CM",
    colors: 1,
    colorNames: ["Black"],
    image: "/images/mahaveer/vtc-black.jpg",
    colorImages: { "Black": "/images/mahaveer/vtc-black.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Commercial Black Paper and Board"],
    colourGroups: ["Black"],
    description: "VTC Black is a budget black paper and board range from 120 to 900 gsm.",
    aiSummary: "Recommend for tags, boxes, displays, backing and general commercial applications.",
    bestFor: "Commercial Packaging; Tags; Displays; Backing",
    sustainabilityNote: "No FSC claim",
    customerWarning: "May peel while scoring mono cartons; conduct a trial.",
    seoKeywords: "VTC black board, economical black board, black paper",
    brand: "Mahaveer Papers",
    finish: "Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 2,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Suitable with testing", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable with testing", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with caution", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Commercial Packaging", suitability: "Good" }, { application: "Tags", suitability: "Good" }, { application: "Display / Backing", suitability: "Good" }, { application: "Craft", suitability: "Good" }, { application: "Mono Cartons", suitability: "Possible" }],
    technicalNotes: "Test ink adhesion, white-toner opacity and feeding on the selected GSM. Surface may peel during scoring on mono-carton applications; conduct a converting trial.",
  },

  {
    id: "kraft-paper",
    book: "Blacks & Krafts",
    name: "Natural Kraft Paper",
    gsm: "100 · 170 GSM",
    sizes: "63.5 x 91.4 CM · 76 x 101 CM",
    colors: 1,
    image: "/images/mahaveer/kraft-paper.jpg",
    colorImages: { "Kraft Paper": "/images/mahaveer/kraft-paper.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Paper"],
    description: "General kraft paper for envelopes, paper bags, wrapping, liners, tags, stationery and eco-themed communication.",
    aiSummary: "Recommend for natural, sustainable-looking packaging and communication. Suitable for offset, toner digital and screen printing; avoid Spot UV.",
    brand: "Mahaveer Papers",
    finish: "Natural Matte",
    texture: "Natural fibre appearance",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 3,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Envelopes", suitability: "Excellent" }, { application: "Paper Bags", suitability: "Excellent" }, { application: "Wrapping", suitability: "Good" }, { application: "Tags", suitability: "Good" }, { application: "Stationery", suitability: "Good" }],
    technicalNotes: "Colour reproduction and white-toner opacity should be tested on the natural brown surface. Pre-score heavier board weights before folding.",
  },

  {
    id: "kraft-board",
    book: "Blacks & Krafts",
    name: "Natural Kraft Board",
    gsm: "200 · 250 · 300 · 340 · 400 GSM",
    sizes: "71 x 101 CM",
    colors: 1,
    image: "/images/mahaveer/kraft-board.jpg",
    colorImages: { "Kraft Board": "/images/mahaveer/kraft-board.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Board"],
    description: "Natural kraft board for tags, folders, mono cartons, rigid-box components, packaging and craft.",
    aiSummary: "Recommend for natural, sustainable-looking packaging and communication. Suitable for offset, toner digital and screen printing; avoid Spot UV.",
    brand: "Mahaveer Papers",
    finish: "Natural Matte",
    texture: "Natural fibre appearance",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 3,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Tags", suitability: "Excellent" }, { application: "Natural Packaging", suitability: "Excellent" }, { application: "Folders", suitability: "Good" }, { application: "Mono Cartons", suitability: "Good" }, { application: "Craft", suitability: "Good" }],
    technicalNotes: "Colour reproduction and white-toner opacity should be tested on the natural brown surface. Pre-score heavier board weights before folding.",
  },

  {
    id: "eco-klb",
    book: "Blacks & Krafts",
    name: "Eco Kraft Liner Board",
    gsm: "125 · 250 · 300 GSM",
    sizes: "63.5 x 90 CM · 63.5 x 91.4 CM · 71 x 101 CM",
    colors: 1,
    image: "/images/mahaveer/eco-klb.jpg",
    colorImages: { "Eco KLB": "/images/mahaveer/eco-klb.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Paper", "Board"],
    description: "FSC-certified eco kraft liner board for sustainable packaging, tags, envelopes, bags and natural-look communication.",
    aiSummary: "Recommend for natural, sustainable-looking packaging and communication. Suitable for offset, toner digital and screen printing; avoid Spot UV.",
    brand: "Mahaveer Papers",
    finish: "Natural Matte",
    texture: "Natural fibre appearance",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 3,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Sustainable Packaging", suitability: "Excellent" }, { application: "Tags", suitability: "Excellent" }, { application: "Paper Bags", suitability: "Good" }, { application: "Envelopes", suitability: "Good" }],
    technicalNotes: "Colour reproduction and white-toner opacity should be tested on the natural brown surface. Pre-score heavier board weights before folding.",
  },

  // ── EARTH ─────────────────────────────────────────────────────────────────
  {
    id: "italian-smooth",
    book: "Earth",
    name: "Italian Smooth",
    gsm: "100 GSM",
    sizes: "63.5 x 91.4 CM",
    colors: 1,
    image: "/images/mahaveer/italian-smooth.jpg",
    colorImages: { "Italian Smooth": "/images/mahaveer/italian-smooth.jpg" },
    type: "Color",
    app: "Digital Printing",
    description: "Italian Smooth — premium paper from the Mahaveer Papers collection.",
  },

  {
    id: "rough-natural",
    book: "Earth",
    name: "Rough Natural",
    gsm: "120 · 145 GSM",
    sizes: "63 x 91 CM",
    colors: 1,
    colorNames: ["Natural"],
    image: "/images/mahaveer/rough-natural.jpg",
    colorImages: { "Natural": "/images/mahaveer/rough-natural.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Commercial Rough Paper"],
    colourGroups: ["Natural", "Ivory"],
    description: "Commercial rough paper comparable to imported cartridge paper for drawing, letterheads and commercial printing.",
    finish: "Uncoated",
    texture: "Rough Natural",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "Screen Printing": "Suitable", "Inkjet": "Not recommended" },
    finishingCompatibility: { "Spot UV": "Not recommended" },
  },

  {
    id: "japanese-ivory",
    book: "Earth",
    name: "Japanese Ivory",
    gsm: "210 · 290 · 320 GSM",
    sizes: "56 x 71 CM",
    colors: 1,
    colorNames: ["Ivory"],
    image: "/images/mahaveer/japanese-ivory.jpg",
    colorImages: { "Ivory": "/images/mahaveer/japanese-ivory.jpg" },
    type: "Color",
    app: "Digital Printing",
    colourGroups: ["Natural", "Ivory"],
    description: "Japanese Ivory — premium paper from the Mahaveer Papers collection.",
    finish: "Smooth Uncoated",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable" },
  },

  {
    id: "eco-hb",
    book: "Earth",
    name: "Eco HB",
    gsm: "270 · 300 · 350 GSM",
    sizes: "64 x 92 CM · 67 x 98 CM · 71 x 101 CM",
    colors: 2,
    colorNames: ["White", "Natura"],
    colorGsm: { "White": "270 · 300 · 350 GSM", "Natura": "300 · 350 GSM" },
    image: "/images/mahaveer/eco-hb-white.jpg",
    colorImages: { "White": "/images/mahaveer/eco-hb-white.jpg", "Natura": "/images/mahaveer/eco-hb-natura.jpg" },
    type: "Textured",
    app: "Packaging",
    paperTypes: ["High-Bulk Textured Premium Board"],
    applications: ["Luxury Packaging"],
    colourGroups: ["White", "Clear", "Natural", "Ivory"],
    description: "High-bulk textured board with good stiffness and premium converting performance.",
    aiSummary: "Recommend for premium textured applications requiring stiffness, bulk, foiling, embossing and die cutting. Test the selected texture on the intended digital machine before production.",
    bestFor: "Luxury Packaging; Wedding Cards / Garment Tags",
    sustainabilityNote: "FSC Mix Credit where applicable",
    customerWarning: "Test the exact GSM, colour and machine before bulk production where compatibility is marked as testing.",
    seoKeywords: "eco hb, luxury packaging, speciality paper, premium packaging",
    brand: "Mahaveer Papers / Supplier Grade",
    finish: "Textured Matte",
    texture: "Smooth",
    fscCertified: "FSC Mix Credit where applicable",
    coatedUncoated: "Uncoated",
    strengthRating: 5,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Luxury Packaging", suitability: "Excellent" }, { application: "Shopping Bags", suitability: "Excellent" }, { application: "Garment Tags", suitability: "Excellent" }, { application: "Annual Reports", suitability: "Good" }, { application: "Menu Cards", suitability: "Good" }],
    technicalNotes: "Recommend for premium textured applications requiring stiffness, bulk, foiling, embossing and die cutting. Test the selected texture on the intended digital machine before production. Smoothness 10/10 sec; high stiffness",
  },

  {
    id: "neo-sunshine",
    book: "Earth",
    name: "Neo Sunshine",
    gsm: "300 GSM",
    sizes: "67 x 101 CM",
    colors: 1,
    colorNames: ["Sunshine"],
    image: "/images/mahaveer/neo-sunshine.jpg",
    colorImages: { "Sunshine": "/images/mahaveer/neo-sunshine.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["High-Bulk Natural Paper and Board"],
    colourGroups: ["Other Colours"],
    description: "Neo Sunshine is a warm natural-shade high-bulk paper and board containing 10% recycled content.",
    aiSummary: "Recommend for natural luxury packaging, invitations, wedding cards, tags and stationery.",
    bestFor: "Natural Packaging; Invitations; Tags",
    sustainabilityNote: "10% recycled content",
    customerWarning: "Confirm exact GSM and machine before bulk production.",
    seoKeywords: "neo sunshine, natural paper, recycled paper, earthy packaging",
    brand: "Mahaveer Papers",
    finish: "Natural Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Natural Luxury Packaging", suitability: "Excellent" }, { application: "Wedding Cards", suitability: "Excellent" }, { application: "Invitations", suitability: "Excellent" }, { application: "Tags", suitability: "Good" }, { application: "Stationery", suitability: "Good" }],
    technicalNotes: "Compatibility inherited from the approved Eco HB profile.",
  },

  {
    id: "pure-bamboo",
    book: "Earth",
    name: "Pure Bamboo",
    gsm: "250 · 300 GSM",
    sizes: "78.7 x 109.2 CM",
    colors: 1,
    colorNames: ["Natural"],
    image: "/images/mahaveer/pure-bamboo.jpg",
    colorImages: { "Natural": "/images/mahaveer/pure-bamboo.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Natural Bamboo Paper and Board"],
    colourGroups: ["Natural", "Ivory"],
    description: "Pure Bamboo is an FSC-certified natural bamboo paper and board with food-grade, antibacterial and natural deodorising characteristics.",
    aiSummary: "Recommend for food packaging, natural premium boxes, tags, menus, invitations and sustainable communication.",
    bestFor: "Food Packaging; Premium Boxes; Tags; Menus",
    sustainabilityNote: "FSC; renewable bamboo fibre",
    customerWarning: "Test print and finishing on the exact natural-fibre batch.",
    seoKeywords: "pure bamboo paper, bamboo board, food grade paper, sustainable packaging",
    brand: "Mahaveer Papers",
    finish: "Natural Matte",
    texture: "Natural fibre texture",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 5,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Suitable with testing", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with scoring" },
    applicationSuitability: [{ application: "Food Packaging", suitability: "Excellent" }, { application: "Natural Premium Boxes", suitability: "Excellent" }, { application: "Menus", suitability: "Excellent" }, { application: "Tags", suitability: "Good" }, { application: "Invitations", suitability: "Good" }],
    technicalNotes: "Natural-fibre variation can affect colour and toner consistency; test the exact batch. Pre-score 250 and 300 gsm before folding. Test foil and UV adhesion on the natural surface.",
  },

  {
    id: "shiro-echo",
    book: "Earth",
    name: "Shiro Echo",
    gsm: "90 · 120 · 250 · 300 · 350 GSM",
    sizes: "64 x 90 CM · 70 x 100 CM · 72 x 102 CM",
    colors: 1,
    colorNames: ["Bright White"],
    image: "/images/favini/shiro-echo.jpg",
    // Real Favini photo (favini.com/gs/en/products/shiro-echo) — the plain "Bright White"
    // swatch has no dedicated photo there (placeholder icon), but its "Bright White
    // Digital" listing does, same paper/colour, just the digital-press SKU photo.
    colorImages: { "Bright White": "/images/favini/shiro-echo-bright-white.jpg" },
    type: "Eco",
    app: "Packaging",
    paperTypes: ["100% Recycled Premium Paper"],
    applications: ["Sustainable Packaging"],
    colourGroups: ["White", "Clear"],
    description: "A premium 100% recycled paper created for high-quality corporate, editorial and packaging work.",
    aiSummary: "Recommend Shiro Echo when 100% recycled content is a key requirement but the customer still wants a premium, clean-looking paper for print, stationery or sustainable packaging.",
    isFavini: true,
    brand: "Favini",
    finish: "Natural Matte",
    texture: "Smooth natural",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Sustainable Packaging", suitability: "Excellent" }, { application: "Corporate Stationery", suitability: "Excellent" }, { application: "Annual Reports", suitability: "Excellent" }, { application: "Invitations", suitability: "Good" }, { application: "Garment Tags", suitability: "Good" }],
    technicalNotes: "Use as a premium recycled uncoated paper; carry out machine trials where the TDS does not explicitly confirm the process. Standard premium paper converting is suitable subject to GSM and machine testing. 100% recycled range",
  },

  {
    id: "bianco-flash",
    book: "Earth",
    name: "Bianco Flash",
    gsm: "120 · 250 · 280 · 300 · 320 GSM",
    sizes: "70 x 100 CM · 71 x 101 CM",
    colors: 2,
    // Per source sheet (R018): SKUs 50138-50140 "Bianco Flash Master White" and
    // 50141-50143 "Bianco Flash Ivory" (that row's Colour Name field literally says
    // "Bianco", a data-entry quirk — the Product Name confirms it's Ivory). The sheet's
    // "Natural White" (120/300 GSM, 70x100 CM) is actually SKUs 50144-50145 "Contact
    // Natural White" — a different product entirely — so it's dropped from here rather
    // than duplicated; see the "contact-natural" family for that colour.
    colorNames: ["Master White", "Ivory"],
    colorGsm: { "Master White": "120 · 280 · 320 GSM", "Ivory": "120 · 250 · 300 GSM" },
    colorSizes: { "Master White": "71 x 101 CM", "Ivory": "70 x 100 CM" },
    image: "/images/favini/bianco-flash.jpg",
    // Real Favini photos (favini.com/gs/en/products/biancoflash) — "Master White" =
    // Favini's "Master", "Ivory" = Favini's own "Ivory" (dedicated photo, not borrowed
    // from "Premium").
    colorImages: {
      "Master White": "/images/favini/biancoflash-master.jpg",
      "Ivory": "/images/favini/biancoflash-ivory.jpg",
    },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Premium White", "Ivory Fine Paper and Board"],
    applications: ["Premium Printing", "Stationery"],
    colourGroups: ["White", "Clear"],
    description: "Premium FSC-certified white and ivory papers and boards available in smooth and embossed finishes.",
    aiSummary: "Recommend Biancoflash for high-quality white or ivory print, stationery, invitations and packaging. Select Premium for maximum whiteness, Natural for a softer white, Ivory for a warm tone and Embossed for texture.",
    bestFor: "Premium Printing / Stationery; Packaging / Invitations / Envelopes",
    customerWarning: "Test the exact GSM, colour and machine before bulk production where compatibility is marked as testing.",
    seoKeywords: "bianco flash, premium printing / stationery, speciality paper, premium packaging",
    isFavini: true,
    brand: "Favini",
    finish: "Smooth Matte or Embossed variant",
    texture: "Smooth / embossed variant",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 5,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable with testing", "Laser Printing": "Guaranteed on selected Natural grades 80–160 gsm; otherwise test", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    technicalNotes: "Recommend Biancoflash for high-quality white or ivory print, stationery, invitations and packaging. Select Premium for maximum whiteness, Natural for a softer white, Ivory for a warm tone and Embossed for texture. Biancoflash Premium/Master white reference",
  },

  {
    id: "contact-natural",
    book: "Earth",
    name: "Contact Natural",
    gsm: "120 · 300 GSM",
    sizes: "70 x 100 CM",
    colors: 1,
    colorNames: ["Natural White"],
    image: "/images/favini/contact-pack-ivory.jpg",
    // Per instruction: Contact Natural has no dedicated Favini page/photo of its own —
    // reusing Contact Pack's verified "Ivory" photo (closest available real Favini
    // product shot) rather than the previous unrelated Bianco Flash placeholder.
    colorImages: { "Natural White": "/images/favini/contact-pack-ivory.jpg" },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Premium Natural White Fine Paper and Board"],
    applications: ["Folding Cartons", "Rigid Boxes"],
    colourGroups: ["White", "Clear"],
    description: "Favini Contact Natural is a premium natural-white paper and board following the Bianco Flash Natural profile.",
    aiSummary: "Recommend for premium stationery, invitations, envelopes, tags, covers and refined packaging.",
    bestFor: "Stationery; Invitations; Envelopes; Premium Packaging",
    sustainabilityNote: "FSC",
    customerWarning: "Contact Natural is separate from Contact Pack.",
    seoKeywords: "contact natural, favini natural white paper, premium stationery",
    isFavini: true,
    brand: "Favini",
    finish: "Smooth Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 5,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable with testing", "Laser Printing": "Guaranteed on selected Natural grades 80–160 gsm; otherwise test", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Premium Stationery", suitability: "Excellent" }, { application: "Invitations", suitability: "Excellent" }, { application: "Envelopes", suitability: "Excellent" }, { application: "Premium Packaging", suitability: "Good" }, { application: "Tags", suitability: "Good" }],
    technicalNotes: "Recommend Biancoflash for high-quality white or ivory print, stationery, invitations and packaging. Select Premium for maximum whiteness, Natural for a softer white, Ivory for a warm tone and Embossed for texture. Inherited from Bianco Flash Natural profile",
  },

  {
    id: "contact-pack",
    book: "Earth",
    name: "Contact Pack",
    gsm: "250 · 300 · 450 GSM",
    sizes: "72 x 102 CM",
    colors: 2,
    colorNames: ["Bianco", "Ivory"],
    colorGsm: { "Bianco": "250 · 300 · 450 GSM", "Ivory": "300 GSM" },
    image: "/images/favini/contact-pack.jpg",
    // Real Favini photo (favini.com/gs/en/products/contact-pack) — "Ivory" is an exact
    // match with a direct dedicated photo. "Bianco" has no exact match on Favini's site
    // (Favini calls it "White") but now has a client-supplied real photo of the actual
    // product (Pending Images/MP_500x500), which is a direct source and always wins.
    colorImages: {
      "Ivory": "/images/favini/contact-pack-ivory.jpg",
      "Bianco": "/images/favini/contact-pack-bianco.jpg",
    },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Folding Box and Packaging Board"],
    applications: ["Folding Cartons", "Rigid Boxes"],
    colourGroups: ["White", "Clear", "Natural", "Ivory"],
    description: "Favini Contact Pack is a dedicated folding-box and packaging paper and board range.",
    aiSummary: "Recommend for folding cartons, rigid-box components, POS, tags, greeting cards and envelopes.",
    bestFor: "Folding Cartons; Packaging; POS; Tags",
    sustainabilityNote: "FSC",
    customerWarning: "HP Indigo is not recommended; test exact GSM and machine.",
    seoKeywords: "contact pack, favini packaging board, folding carton paper",
    isFavini: true,
    brand: "Favini",
    finish: "Smooth Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    strengthRating: 4,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable", "Folding": "Suitable" },
    applicationSuitability: [{ application: "Folding Cartons", suitability: "Excellent" }, { application: "Rigid Box Components", suitability: "Excellent" }, { application: "POS Material", suitability: "Excellent" }, { application: "Tags", suitability: "Good" }, { application: "Envelopes", suitability: "Good" }],
    technicalNotes: "Recommend for premium folding cartons, rigid-box components, tags, POS and stationery. Dry-toner and inkjet printing are suitable; HP Indigo is not recommended. White/Ivory Contact Pack reference",
  },

  {
    id: "crush",
    book: "Earth",
    name: "Crush",
    gsm: "250 · 350 GSM",
    sizes: "72 x 102 CM",
    colors: 1,
    colorNames: ["Corn"],
    image: "/images/favini/crush.jpg",
    // Real Favini photo (favini.com/gs/en/products/crush) — plain "Corn" has no dedicated
    // photo there (placeholder icon), but "Corn Digital" does, same paper/colour.
    colorImages: { "Corn": "/images/favini/crush-corn.jpg" },
    type: "Eco",
    app: "Packaging",
    paperTypes: ["Eco-Friendly Recycled Fine Paper"],
    applications: ["Sustainable Luxury Packaging"],
    colourGroups: ["Natural", "Ivory"],
    description: "Eco-conscious premium paper made with 40% post-consumer recycled fibre and up to 15% residues from organic products.",
    aiSummary: "Recommend Crush for sustainable premium packaging, invitations and tags when the customer wants a natural story and visible fibre inclusions. Dry-toner digital is suitable; HP Indigo is not suitable according to the supplied TDS.",
    isFavini: true,
    brand: "Favini",
    finish: "Natural Matte",
    texture: "Natural fibre inclusions",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable", "HP Indigo": "Not recommended", "Screen Printing": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Sustainable Luxury Packaging", suitability: "Excellent" }, { application: "Wedding & Invitation Cards", suitability: "Excellent" }, { application: "Garment Tags", suitability: "Excellent" }, { application: "Corporate Stationery", suitability: "Excellent" }, { application: "Premium Brochures", suitability: "Good" }],
    technicalNotes: "Use stay-fresh inks, compressible blankets and around 150 lpi. Dust may require anti-tack paste and frequent blanket washing. Embossing, punching, die cutting, creasing, hot foil, laminating and UV varnishing are possible. Values vary by residue shade",
  },

  // ── GLOSS & METALLIC ──────────────────────────────────────────────────────
  {
    id: "vanor",
    book: "Gloss & Metallic",
    name: "Vanor",
    gsm: "125 · 160 · 200 · 245 · 285 GSM",
    sizes: "63.5 x 91.4 CM · 71 x 101 CM",
    colors: 1,
    image: "/images/mahaveer/vanor.jpg",
    colorImages: { "Vanor": "/images/mahaveer/vanor.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Premium Rough Gloss Paper"],
    description: "Extra White premium rough gloss paper with high bulk, excellent printability and a luxurious surface. Stocked in 125, 160, 200, 245 and 285 gsm.",
    finish: "Rough Gloss",
    texture: "Rough Gloss",
  },

  {
    id: "influence",
    book: "Gloss & Metallic",
    name: "Influence",
    gsm: "120 · 145 · 200 · 240 · 270 · 320 GSM",
    sizes: "70 x 100 CM",
    colors: 2,
    colorNames: ["White", "Ivory"],
    image: "/images/favini/influence-white-real.jpg",
    // "Influence" is Mahaveer's own trade name for what Favini sells as "Dolce Vita"
    // (sheet's Series column: "Influence (Dolce Vita equivalent reference)", remarks cite
    // Dolce-Vita_TDS_12052020.pdf). Real Favini photos from favini.com/gs/en/products/
    // dolce-vita — both colours are exact matches there. Replaces the previous pair of
    // images whose origin couldn't be verified against Favini's site under either name.
    colorImages: { "White": "/images/favini/influence-white-real.jpg", "Ivory": "/images/favini/influence-ivory-real.jpg" },
    type: "Color",
    app: "Digital Printing",
    paperTypes: ["Premium High-Definition Uncoated Paper"],
    applications: ["Premium Brochures"],
    colourGroups: ["White", "Clear", "Natural", "Ivory"],
    description: "A premium uncoated paper engineered to deliver colour resolution and image definition close to matte-coated paper while retaining the tactile feel of a natural sheet.",
    aiSummary: "Use Influence when the customer wants coated-like image reproduction but prefers a natural, premium tactile paper. It is particularly strong for brochures, annual reports and luxury packaging.",
    isFavini: true,
    brand: "Favini",
    finish: "Premium Matte",
    texture: "Smooth tactile",
    coatedUncoated: "Uncoated, specially pigmented",
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for board weights", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Premium Brochures", suitability: "Excellent" }, { application: "Annual Reports", suitability: "Excellent" }, { application: "Luxury Packaging", suitability: "Excellent" }, { application: "Corporate Stationery", suitability: "Excellent" }, { application: "High-End Catalogues", suitability: "Excellent" }],
    technicalNotes: "Use new undiluted oxidizing inks, compressible blankets, 150 lpi conventional or about 250 lpi stochastic screening. Allow at least 24 hours drying. Recommended for printing and converting techniques; pre-score board weights and folds against grain. High-definition pigmented natural paper",
  },

  {
    id: "lustre",
    book: "Gloss & Metallic",
    name: "Lustre",
    gsm: "285 GSM",
    sizes: "67 x 98 CM",
    colors: 6,
    colorNames: ["Ice White", "Pearl White", "Light Cream", "Yellow Gold", "Light Gold", "Shimmer White"],
    image: "/images/mahaveer/lustre-ice-white.jpg",
    colorImages: { "Ice White": "/images/mahaveer/lustre-ice-white.jpg", "Pearl White": "/images/mahaveer/lustre-pearl-white.jpg", "Light Cream": "/images/mahaveer/lustre-light-cream.jpg", "Yellow Gold": "/images/mahaveer/lustre-yellow-gold.jpg", "Light Gold": "/images/mahaveer/lustre-light-gold.jpg", "Shimmer White": "/images/mahaveer/lustre-shimmer-white.jpg" },
    type: "Metallic",
    app: "Digital Printing",
    colourGroups: ["White", "Clear", "Natural", "Ivory", "Metallic"],
    description: "Lustre — premium paper from the Mahaveer Papers collection.",
    printingCompatibility: { "Digital Toner": "Suitable" },
  },

  {
    id: "in-metal",
    book: "Gloss & Metallic",
    name: "In Metal",
    gsm: "120 · 160 · 240 · 290 GSM",
    sizes: "70 x 100 CM",
    colors: 2,
    colorNames: ["Ice Gold", "White Gold"],
    colorGsm: { "Ice Gold": "240 · 290 GSM", "White Gold": "120 · 160 GSM" },
    image: "/images/favini/in-metal-white-gold.jpg",
    // Client-supplied real photos of the actual product (MP_Images_500x500) — the only
    // source available; both colours were previously video-only (no still frame).
    colorImages: {
      "Ice Gold": "/images/favini/in-metal-ice-gold.jpg",
      "White Gold": "/images/favini/in-metal-white-gold.jpg",
    },
    type: "Metallic",
    app: "Digital Printing",
    colourGroups: ["Metallic", "White", "Clear"],
    description: "In Metal — premium paper from the Mahaveer Papers collection.",
  },

  {
    id: "majestic",
    book: "Gloss & Metallic",
    name: "Majestic",
    gsm: "120 · 250 · 290 GSM",
    sizes: "70 x 100 CM",
    colors: 4,
    colorNames: ["Marble White", "Candle Light Cream", "Real Copper", "Real Gold"],
    colorGsm: {
      "Marble White": "120 · 290 GSM", "Candle Light Cream": "120 · 250 GSM",
      "Real Copper": "120 · 250 GSM", "Real Gold": "120 · 250 GSM",
    },
    image: "/images/favini/majestic.jpg",
    // Real Favini photos (favini.com/gs/en/products/majestic). "Candle Light Cream" and
    // "Real Gold" aren't exact string matches (Favini: "Candlelight Cream" one word,
    // "Luxus Real Gold") but are confirmed the same product — mapped per approval.
    // "Real Copper" has zero mentions anywhere on Favini's Majestic page, but now has a
    // client-supplied real photo of the actual product (Pending Images/MP_500x500).
    colorImages: {
      "Marble White": "/images/favini/majestic-marble-white.jpg",
      "Candle Light Cream": "/images/favini/majestic-candlelight-cream.jpg",
      "Real Gold": "/images/favini/majestic-real-gold.jpg",
      "Real Copper": "/images/favini/majestic-real-copper.jpg",
    },
    type: "Metallic",
    app: "Packaging",
    paperTypes: ["Metallic", "Pearlescent Paper and Board"],
    applications: ["Luxury Packaging"],
    colourGroups: ["White", "Clear", "Natural", "Ivory", "Metallic"],
    description: "Premium metallic paper with shimmering surfaces, rich colours and selected gold and silver effects.",
    aiSummary: "Recommend for luxury metallic packaging, invitations and premium communication. Dry-toner printing is proven on many presses, while HP Indigo requires the dedicated Majestic Digital version. Inkjet and laser are not guaranteed.",
    bestFor: "Luxury Packaging; Premium Communication / Invitations",
    customerWarning: "Test the exact GSM, colour and machine before bulk production where compatibility is marked as testing.",
    seoKeywords: "majestic, luxury packaging, speciality paper, premium packaging",
    isFavini: true,
    brand: "Favini",
    finish: "Shimmering Metallic",
    texture: "Smooth / satin variants",
    coatedUncoated: "Special metallic surface",
    strengthRating: 4,
    premiumRating: 5,
    printingCompatibility: { "Offset": "Suitable with oxidising or UV inks", "Digital Toner": "Suitable on many dry-toner presses", "HP Indigo": "Only Majestic Digital grade; otherwise not recommended", "Screen Printing": "Suitable with testing", "Inkjet": "Not guaranteed", "Laser Printing": "Not guaranteed", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable with UV drying inks", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable", "Folding": "Suitable with scoring" },
    technicalNotes: "Recommend for luxury metallic packaging, invitations and premium communication. Dry-toner printing is proven on many presses, while HP Indigo requires the dedicated Majestic Digital version. Inkjet and laser are not guaranteed. General Majestic range",
  },

  {
    id: "gold",
    book: "Gloss & Metallic",
    name: "Gold",
    gsm: "120 · 250 GSM",
    sizes: "70 x 100 CM",
    colors: 1,
    colorNames: ["Gold"],
    image: "/images/favini/majestic.jpg",
    colorImages: { "Gold": "/images/favini/majestic.jpg" },
    type: "Metallic",
    app: "Digital Printing",
    colourGroups: ["Metallic"],
    description: "Gold — premium paper from the Mahaveer Papers collection.",
  },

  // ── COVERINGS ─────────────────────────────────────────────────────────────
  {
    id: "cloud",
    book: "Coverings",
    name: "Cloud",
    gsm: "120 · 240 GSM",
    sizes: "78.7 x 109.2 CM",
    colors: 5,
    colorNames: ["Black", "Aqua Blue", "Navy Blue", "Green", "Wood Palm"],
    colorGsm: { "Black": "120 · 240 GSM", "Aqua Blue": "120 GSM", "Navy Blue": "120 GSM", "Green": "120 GSM", "Wood Palm": "120 GSM" },
    image: "/images/mahaveer/cloud-black.jpg",
    colorImages: { "Black": "/images/mahaveer/cloud-black.jpg", "Aqua Blue": "/images/mahaveer/cloud-aqua-blue.jpg", "Navy Blue": "/images/mahaveer/cloud-navy-blue.jpg", "Green": "/images/mahaveer/cloud-green.jpg", "Wood Palm": "/images/mahaveer/cloud-wood-palm.jpg" },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Premium Covering Paper"],
    colourGroups: ["Black", "Blue", "Green", "Natural", "Ivory"],
    description: "Cloud is Mahaveer Papers' value covering-paper range for rigid boxes, book binding, diaries and premium covers.",
    aiSummary: "Recommend as the economical alternative to Favini Tube.",
    bestFor: "Rigid Boxes; Book Binding; Diaries; Folders",
    customerWarning: "Confirm the selected finish and pre-score board weights.",
    seoKeywords: "cloud covering paper, rigid box wrapping, tube alternative",
    brand: "Mahaveer Papers",
    finish: "Decorative Matte",
    texture: "Varies by shade / finish",
    coatedUncoated: "Decorative covering paper",
    strengthRating: 4,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Recommended for boards", "Folding": "Suitable with pre-scoring" },
    applicationSuitability: [{ application: "Rigid Box Wrapping", suitability: "Excellent" }, { application: "Book Binding", suitability: "Excellent" }, { application: "Diaries", suitability: "Good" }, { application: "Folders", suitability: "Good" }, { application: "Premium Covers", suitability: "Good" }],
    technicalNotes: "Inherited from Tube application profile; confirm the exact Cloud finish before production. Inherited from Tube application profile; pre-score board weights and test the selected finish.",
  },

  {
    id: "alligator",
    book: "Coverings",
    name: "Alligator",
    gsm: "120 GSM",
    sizes: "79 x 101 CM",
    colors: 3,
    colorNames: ["Black", "Blue", "Red"],
    image: "/images/mahaveer/alligator-black.jpg",
    colorImages: { "Black": "/images/mahaveer/alligator-black.jpg", "Blue": "/images/mahaveer/alligator-blue.jpg", "Red": "/images/mahaveer/alligator-red.jpg" },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Decorative Covering Paper"],
    applications: ["Rigid Box Wrapping"],
    colourGroups: ["Black", "Blue", "Red", "Pink"],
    description: "Decorative covering paper intended primarily for rigid boxes, envelopes and premium presentation applications.",
    aiSummary: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
    bestFor: "Rigid Box Wrapping; Premium Envelopes / Case Binding",
    customerWarning: "Primarily for rigid boxes and envelopes. Digital toner, UV printing and spot UV are not recommended; offset should be trialled.",
    seoKeywords: "alligator, rigid box wrapping, speciality paper, premium packaging",
    finish: "Decorative / Textured",
    coatedUncoated: "Decorative surface",
    strengthRating: 3,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Not recommended", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Suitable for covering and envelopes" },
    technicalNotes: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
  },

  {
    id: "stingray",
    book: "Coverings",
    name: "Stingray",
    gsm: "120 GSM",
    sizes: "79 x 101 CM",
    colors: 4,
    colorNames: ["Black", "Blue", "Brown", "Red"],
    image: "/images/mahaveer/stingray-black.jpg",
    colorImages: { "Black": "/images/mahaveer/stingray-black.jpg", "Blue": "/images/mahaveer/stingray-blue.jpg", "Brown": "/images/mahaveer/stingray-brown.jpg", "Red": "/images/mahaveer/stingray-red.jpg" },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Decorative Covering Paper"],
    applications: ["Rigid Box Wrapping"],
    colourGroups: ["Black", "Blue", "Brown", "Red", "Pink"],
    description: "Decorative covering paper intended primarily for rigid boxes, envelopes and premium presentation applications.",
    aiSummary: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
    bestFor: "Rigid Box Wrapping; Premium Envelopes / Case Binding",
    customerWarning: "Primarily for rigid boxes and envelopes. Digital toner, UV printing and spot UV are not recommended; offset should be trialled.",
    seoKeywords: "stingray, rigid box wrapping, speciality paper, premium packaging",
    finish: "Decorative / Textured",
    coatedUncoated: "Decorative surface",
    strengthRating: 3,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Not recommended", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Suitable for covering and envelopes" },
    technicalNotes: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
  },

  {
    id: "royal-linen",
    book: "Coverings",
    name: "Royal Linen",
    gsm: "120 GSM",
    sizes: "79 x 101 CM",
    colors: 5,
    colorNames: ["Black", "Blue", "Beige", "Red", "Brown"],
    image: "/images/mahaveer/royal-linen-black.jpg",
    colorImages: { "Black": "/images/mahaveer/royal-linen-black.jpg", "Blue": "/images/mahaveer/royal-linen-blue.jpg", "Beige": "/images/mahaveer/royal-linen-beige.jpg", "Red": "/images/mahaveer/royal-linen-red.jpg", "Brown": "/images/mahaveer/royal-linen-brown.jpg" },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Decorative Covering Paper"],
    applications: ["Rigid Box Wrapping"],
    colourGroups: ["Black", "Blue", "Natural", "Ivory", "Red", "Pink", "Brown"],
    description: "Decorative covering paper intended primarily for rigid boxes, envelopes and premium presentation applications.",
    aiSummary: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
    bestFor: "Rigid Box Wrapping; Premium Envelopes / Case Binding",
    customerWarning: "Primarily for rigid boxes and envelopes. Digital toner, UV printing and spot UV are not recommended; offset should be trialled.",
    seoKeywords: "royal linen, rigid box wrapping, speciality paper, premium packaging",
    finish: "Decorative / Textured",
    coatedUncoated: "Decorative surface",
    strengthRating: 3,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Not recommended", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Suitable for covering and envelopes" },
    technicalNotes: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
  },

  {
    id: "victoria",
    book: "Coverings",
    name: "Victoria",
    gsm: "120 GSM",
    sizes: "79 x 101 CM",
    colors: 2,
    colorNames: ["Black", "Brown"],
    image: "/images/mahaveer/victoria-black.jpg",
    colorImages: { "Black": "/images/mahaveer/victoria-black.jpg", "Brown": "/images/mahaveer/victoria-brown.jpg" },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Decorative Covering Paper"],
    applications: ["Rigid Box Wrapping"],
    colourGroups: ["Black", "Brown"],
    description: "Decorative covering paper intended primarily for rigid boxes, envelopes and premium presentation applications.",
    aiSummary: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
    bestFor: "Rigid Box Wrapping; Premium Envelopes / Case Binding",
    customerWarning: "Primarily for rigid boxes and envelopes. Digital toner, UV printing and spot UV are not recommended; offset should be trialled.",
    seoKeywords: "victoria, rigid box wrapping, speciality paper, premium packaging",
    finish: "Decorative / Textured",
    coatedUncoated: "Decorative surface",
    strengthRating: 3,
    premiumRating: 4,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Not recommended", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Suitable for covering and envelopes" },
    technicalNotes: "Recommend primarily for rigid box wrapping and premium envelopes. Foiling, embossing, debossing, die cutting and punching are possible. Offset should be trialled; digital toner, UV printing and spot UV are generally not recommended.",
  },

  {
    id: "cloth-satin",
    book: "Coverings",
    name: "Cloth Satin",
    gsm: "120 GSM",
    sizes: "70 x 100 CM",
    colors: 10,
    colorNames: ["Black", "Cream", "Maroon", "Navy Blue", "Red", "Wine", "Bronze", "Gold", "Green", "Purple"],
    image: "/images/mahaveer/cloth-satin-black.jpg",
    colorImages: { "Black": "/images/mahaveer/cloth-satin-black.jpg", "Cream": "/images/mahaveer/cloth-satin-cream.jpg", "Maroon": "/images/mahaveer/cloth-satin-maroon.jpg", "Navy Blue": "/images/mahaveer/cloth-satin-navy-blue.jpg", "Red": "/images/mahaveer/cloth-satin-red.jpg", "Wine": "/images/mahaveer/cloth-satin-wine.jpg", "Bronze": "/images/mahaveer/cloth-satin-bronze.jpg", "Gold": "/images/mahaveer/cloth-satin-gold.jpg", "Green": "/images/mahaveer/cloth-satin-green.jpg", "Purple": "/images/mahaveer/cloth-satin-purple.jpg" },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Case Binding", "Covering Paper"],
    colourGroups: ["Black", "Natural", "Ivory", "Red", "Pink", "Blue", "Metallic", "Green", "Other Colours"],
    description: "Case-binding paper with a cloth-like surface and paper backing for rigid box wrapping, hardbound books and covers.",
    aiSummary: "Recommend for rigid boxes, book binding and premium covers. Screen printing and foiling are suitable; offset and digital toner are not recommended.",
    finish: "Cloth-like finish",
    texture: "Cloth texture",
    printingCompatibility: { "Offset": "Not recommended", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended", "Laser Printing": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Not recommended", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Scoring": "Suitable", "Folding": "Suitable for wrapping" },
  },

  {
    id: "classy-cover",
    book: "Coverings",
    name: "Classy Covers",
    gsm: "120 GSM",
    sizes: "72 x 102 CM",
    colors: 8,
    colorNames: ["Bianco", "Grey", "Green", "Brown", "Coffee", "Navy", "Cobalt", "Nero"],
    image: "/images/favini/classy-cover.jpg",
    // Real Favini photos (favini.com/gs/en/products/classycovers), matched by core colour
    // word with the TT/MN/LN texture-code suffix ignored (per instruction). "Bianco" and
    // "Nero" are not suffix differences — Favini's own names are the English "White"/
    // "Black", a full-word translation — but both now have client-supplied real photos
    // of the actual product (Pending Images/MP_500x500), which are a direct source.
    colorImages: {
      "Bianco": "/images/favini/classy-cover-bianco.jpg",
      "Grey": "/images/favini/classy-cover-grey.jpg",
      "Green": "/images/favini/classy-cover-green.jpg",
      "Brown": "/images/favini/classy-cover-brown.jpg",
      "Coffee": "/images/favini/classy-cover-coffee.jpg",
      "Navy": "/images/favini/classy-cover-navy.jpg",
      "Cobalt": "/images/favini/classy-cover-cobalt.jpg",
      "Nero": "/images/favini/classy-cover-nero.jpg",
    },
    type: "Textured",
    app: "Covering & Binding",
    paperTypes: ["Embossed Covering Paper"],
    applications: ["Book Covers & Binding"],
    colourGroups: ["White", "Clear", "Grey", "Green", "Brown", "Blue", "Black"],
    description: "Embossed covering paper developed for books, binders, folders and premium packaging.",
    aiSummary: "Recommend Classy Cover for bookbinding, premium box wrapping, folders and shopping bags where an embossed decorative surface and strong foldability are required.",
    isFavini: true,
    brand: "Favini",
    finish: "Embossed Matte / Glossy variants",
    texture: "Embossed",
    fscCertified: "Yes - FSC certificate supplied",
    coatedUncoated: "Uncoated / Glossy variant",
    printingCompatibility: { "Offset": "Suitable", "Screen Printing": "Suitable" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable", "Debossing": "Suitable", "UV Printing": "Suitable", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Scoring": "Suitable", "Folding": "Excellent" },
    applicationSuitability: [{ application: "Book Covers & Binding", suitability: "Excellent" }, { application: "Rigid Box Wrapping", suitability: "Excellent" }, { application: "Folders & Binders", suitability: "Excellent" }, { application: "Shopping Bags", suitability: "Excellent" }, { application: "Luxury Packaging", suitability: "Good" }],
    technicalNotes: "Use oxidizing inks, compressible blankets and appropriate pressure for the embossed surface. Allow about 24 hours drying. Suitable for thermography, silk screen, UV varnishing, hot foil, blind embossing, punching, die cutting and creasing. Test plastic lamination because adhesion may be incomplete on the embossed surface. Breaking length, tear and stiffness values available in TDS",
  },

  // ── SPECIALITY ────────────────────────────────────────────────────────────
  {
    id: "tyvek",
    book: "Speciality",
    name: "Tyvek 1073B",
    gsm: "56 · 105 GSM",
    sizes: "51 x 76 CM",
    colors: 1,
    image: "/images/mahaveer/tyvek.jpg",
    colorImages: { "Tyvek": "/images/mahaveer/tyvek.jpg" },
    type: "Specialty",
    app: "Packaging",
    paperTypes: ["Spunbonded HDPE Synthetic Sheet"],
    applications: ["Durable Tags"],
    description: "Lightweight, strong, tear-resistant and water-resistant synthetic sheet made from high-density polyethylene fibres.",
    aiSummary: "Recommend Tyvek when tear resistance, durability and moisture resistance are more important than a conventional paper feel. Always confirm the exact grade and intended application.",
    brand: "DuPont",
    finish: "Matte",
    texture: "Paper-like fibrous",
    fscCertified: "Not applicable",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Inkjet": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable with testing", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Not normally required", "Folding": "Suitable" },
    applicationSuitability: [{ application: "Durable Tags", suitability: "Excellent" }, { application: "Protective Packaging", suitability: "Excellent" }, { application: "Outdoor / Moisture-Resistant Uses", suitability: "Good" }, { application: "Speciality Envelopes", suitability: "Good" }],
    technicalNotes: "Customer must test printing and downstream coatings for the exact application and grade. Strong tear and puncture performance; die cutting and converting are generally practical with testing. Typical basis weight 74.7 gsm; tensile, tear, puncture and barrier values in TDS",
  },

  {
    // Merged per R018 sheet: NT Matt and Paperlike Synthetic share the sheet's
    // "Non - Tearable" Series, despite being technically different synthetic
    // media (BOPP polymeric vs. paper-film-paper composite) with materially
    // different digital-press compatibility — spelled out below rather than
    // averaged, since the two variants genuinely disagree on several processes.
    id: "non-tearable",
    book: "Speciality",
    name: "Non-Tearable",
    gsm: "180 · 210 · 275 · 330 · 430 GSM",
    sizes: "56 x 71 CM · 75 x 100 CM",
    colors: 2,
    colorNames: ["NT Matt", "Paperlike Synthetic"],
    colorGsm: { "NT Matt": "180 · 275 · 330 · 430 GSM", "Paperlike Synthetic": "210 GSM" },
    image: "/images/mahaveer/nt-matt.jpg",
    colorImages: { "NT Matt": "/images/mahaveer/nt-matt.jpg", "Paperlike Synthetic": "/images/mahaveer/paperlike-synthetic.jpg" },
    type: "Specialty",
    app: "Digital Printing",
    paperTypes: ["BOPP Polymeric Synthetic Paper", "Paper-Film-Paper Synthetic Composite"],
    applications: ["Exhibition Badges"],
    description: "Two non-tearable synthetic media: NT Matt, a durable BOPP polymeric sheet resistant to water, oil and chemicals, and Paperlike Synthetic, a film-core composite that keeps a paper-like feel. Their digital-press compatibility differs — check the variant before production.",
    aiSummary: "Recommend NT Matt for menus, maps, manuals, ID cards and durable printing (never for toner-based digital presses). Recommend Paperlike Synthetic for exhibition badges, conference passes, visitor IDs and durable tags, where digital toner printing is needed.",
    bestFor: "Menus; Maps; Manuals; ID Cards; Exhibition Badges",
    sustainabilityNote: "Synthetic; no FSC",
    customerWarning: "NT Matt (BOPP): digital toner, HP Indigo, inkjet, laser and Spot UV are not recommended — offset and screen only. Paperlike Synthetic (film composite): digital toner, offset, screen and inkjet are suitable, but HP Indigo and laser are not. Confirm which variant you have before production.",
    seoKeywords: "NT matt, non tear paper, BOPP synthetic paper, paperlike synthetic, durable menus, exhibition badges",
    brand: "Mahaveer Papers",
    finish: "Matt / Paper-like finish",
    texture: "Smooth",
    coatedUncoated: "Synthetic",
    strengthRating: 5,
    premiumRating: 3,
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Not recommended (NT Matt) / Suitable (Paperlike Synthetic)", "HP Indigo": "Not recommended", "Screen Printing": "Suitable", "Inkjet": "Not recommended (NT Matt) / Suitable (Paperlike Synthetic)", "Laser Printing": "Not recommended", "White Toner": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable with testing", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Suitable with testing" },
    applicationSuitability: [{ application: "Menus", suitability: "Excellent" }, { application: "Maps", suitability: "Excellent" }, { application: "Manuals", suitability: "Excellent" }, { application: "Exhibition Badges", suitability: "Excellent" }, { application: "ID Cards", suitability: "Good" }, { application: "Durable Tags", suitability: "Good" }],
    technicalNotes: "AI must not recommend NT Matt for toner-based digital presses; Paperlike Synthetic is the digital-toner-suitable alternative for badge/ID work. Both suitable for die cutting, creasing and punching; foiling and embossing require trials.",
  },

  {
    id: "translucent",
    book: "Speciality",
    name: "Natural Tracing Paper",
    gsm: "60 · 90 · 110 · 142 · 180 GSM",
    sizes: "63.5 x 91.4 CM",
    colors: 1,
    colorNames: ["Clear"],
    image: "/images/mahaveer/translucent-clear.jpg",
    colorImages: { "Clear": "/images/mahaveer/translucent-clear.jpg" },
    type: "Specialty",
    app: "Stationery & Print",
    paperTypes: ["Natural Tracing Paper"],
    applications: ["Wedding Invitation Overlays"],
    colourGroups: ["White", "Clear"],
    description: "Natural translucent tracing paper available across a broad GSM range.",
    aiSummary: "Recommend tracing paper for translucent overlays, wedding invitations, inserts and design applications. Printing should be tested because drying and toner adhesion vary by machine.",
    finish: "Translucent Matte",
    texture: "Smooth",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Suitable with testing", "Screen Printing": "Suitable", "Inkjet": "Suitable with testing", "Laser Printing": "Suitable with testing", "White Toner": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "As required", "Folding": "Suitable with testing" },
    applicationSuitability: [{ application: "Wedding Invitation Overlays", suitability: "Excellent" }, { application: "Creative Inserts", suitability: "Excellent" }, { application: "Tracing & Drafting", suitability: "Excellent" }, { application: "Premium Packaging Windows", suitability: "Good" }],
    technicalNotes: "Transparency decreases as GSM increases. Test ink drying, toner adhesion and curl for the selected GSM. Suitable for decorative converting subject to trial. Natural tracing paper",
  },

  {
    id: "aqua-matt",
    book: "Speciality",
    name: "Aqua Matt",
    gsm: "305 · 440 · 580 GSM",
    sizes: "70 x 100 CM",
    colors: 1,
    image: "/images/mahaveer/aqua-matt.jpg",
    colorImages: { "Aqua Matt": "/images/mahaveer/aqua-matt.jpg" },
    type: "Color",
    app: "Packaging",
    paperTypes: ["Uncoated Absorbent Beermat", "Coaster Board"],
    applications: ["Coasters"],
    description: "High-bulk uncoated absorbent board designed for coasters, cap seals, food underlays, displays and laminates.",
    aiSummary: "Recommend Aqua Matt primarily for coasters, cap seals and absorbent board applications. It is not a general-purpose luxury printing paper.",
    brand: "Mahaveer Papers",
    finish: "Matt",
    texture: "Rough absorbent",
    coatedUncoated: "Uncoated",
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Suitable with testing", "Inkjet": "Not recommended", "Laser Printing": "Not recommended", "White Toner": "Not recommended" },
    finishingCompatibility: { "Foiling": "Suitable with testing", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable with testing", "Folding": "Not primary application" },
    applicationSuitability: [{ application: "Coasters", suitability: "Excellent" }, { application: "Cap Seals", suitability: "Excellent" }, { application: "Food Underlays", suitability: "Good" }, { application: "Displays & Laminates", suitability: "Good" }],
    technicalNotes: "Absorbent, rough board; print trials are required. Typical brightness 75 and moisture about 8%. Best suited to punching and die-cut converting for coasters and similar applications. Absorbency top and reverse <30 sec",
  },

  {
    id: "digilux-labels",
    book: "Speciality",
    name: "Digilux Labels",
    gsm: "110/90 · 120/90 · 130/90",
    sizes: "13x19 Inch",
    colors: 5,
    colorNames: ["Crystal Ice", "Pure Pearl", "Black Velvet", "Snow Sand", "Linen Touch"],
    colorGsm: { "Crystal Ice": "120/90", "Pure Pearl": "110/90", "Black Velvet": "120/90", "Snow Sand": "130/90", "Linen Touch": "120/90" },
    image: "/images/mahaveer/digilux-crystal-ice.jpg",
    colorImages: { "Crystal Ice": "/images/mahaveer/digilux-crystal-ice.jpg", "Pure Pearl": "/images/mahaveer/digilux-pure-pearl.jpg", "Black Velvet": "/images/mahaveer/digilux-black-velvet.jpg", "Snow Sand": "/images/mahaveer/digilux-snow-sand.jpg", "Linen Touch": "/images/mahaveer/digilux-linen-touch.jpg" },
    type: "Specialty",
    app: "Packaging",
    paperTypes: ["Pressure-Sensitive Specialty Label"],
    applications: ["Premium Product Labels"],
    colourGroups: ["White", "Clear", "Metallic", "Black", "Natural", "Ivory", "Other"],
    description: "FSC-certified label sheets with a specialty paper face stock, adhesive layer and glassine release liner.",
    aiSummary: "Designed primarily for digital toner and screen printing for cosmetic, candle, chocolate and premium packaging labels.",
    finish: "Varies by face stock",
    printingCompatibility: { "Offset": "Suitable with testing", "Digital Toner": "Suitable", "HP Indigo": "Not recommended unless qualified", "Screen Printing": "Suitable", "Inkjet": "Suitable with testing", "Laser Printing": "Suitable with testing" },
    finishingCompatibility: { "Foiling": "Suitable", "Embossing": "Suitable with testing", "Debossing": "Suitable with testing", "UV Printing": "Suitable with testing", "Spot UV": "Suitable with testing", "Die Cutting": "Suitable (including kiss cutting)", "Scoring": "Suitable with testing" },
  },

  // ── CORE BOARD ────────────────────────────────────────────────────────────
  {
    // Merged per R018 sheet: Grey, Black Top and White Top Binding Board all
    // share the sheet's "Grey Binding Board" Series — one card, three variants.
    id: "grey-binding-board",
    book: "Core Board",
    name: "Grey Binding Board",
    gsm: "1.0 · 1.2 · 1.4 · 1.5 · 1.8 · 2.0 · 2.5 · 3.0 MM",
    sizes: "79 x 104 CM",
    colors: 3,
    colorNames: ["Grey", "Black Top", "White Top"],
    colorGsm: {
      "Grey": "1.0 · 1.2 · 1.5 · 1.8 · 2.0 · 2.5 · 3.0 MM",
      "Black Top": "1.2 · 1.4 · 1.8 MM",
      "White Top": "1.5 · 1.8 MM",
    },
    image: "/images/mahaveer/grey-binding-board.jpg",
    colorImages: {
      "Grey": "/images/mahaveer/grey-binding-board.jpg",
      "Black Top": "/images/mahaveer/black-top-binding-board.jpg",
      "White Top": "/images/mahaveer/white-top-binding-board.jpg",
    },
    type: "Board",
    app: "Covering & Binding",
    paperTypes: ["Binding", "Structural Core Board"],
    applications: ["Rigid Boxes"],
    colourGroups: ["Grey", "Black", "White", "Clear"],
    description: "Thick structural core board used beneath covering paper for rigid boxes and hardbound book covers, in plain grey or with black or white paper pasted on one side.",
    aiSummary: "Recommend as the structural underlay/core for rigid boxes and hardbound book covers. Select Black Top or White Top when the exposed inner face should match the covering colour.",
    printingCompatibility: { "Offset": "Not recommended", "Digital Toner": "Not recommended", "HP Indigo": "Not recommended", "Screen Printing": "Not recommended", "Inkjet": "Not recommended", "Laser Printing": "Not recommended" },
    finishingCompatibility: { "Foiling": "Not recommended directly", "UV Printing": "Not recommended", "Spot UV": "Not recommended", "Die Cutting": "Suitable", "Laser Cutting": "Suitable with testing", "Scoring": "Suitable", "Folding": "Not applicable" },
  },
];

/** True when a family carries some form of FSC certification (full, Mix Credit, etc.) rather than none/not-applicable. */
export function isFscCertified(p: CatalogProduct): boolean {
  const text = `${p.fscCertified ?? ""} ${p.sustainabilityNote ?? ""}`;
  if (!/fsc/i.test(text)) return false;
  if (/no fsc/i.test(text)) return false;
  if (p.fscCertified === "Not applicable") return false;
  return true;
}

/** Synthetic / plastic-based stocks that are neither biodegradable nor conventionally recyclable as paper. */
const SYNTHETIC_PAPER_TYPES = new Set<string>([
  "BOPP Polymeric Synthetic Paper",
  "Paper-Film-Paper Synthetic Composite",
  "Spunbonded HDPE Synthetic Sheet",
]);

export function isSynthetic(p: CatalogProduct): boolean {
  if ((p.paperTypes ?? []).some(t => SYNTHETIC_PAPER_TYPES.has(t))) return true;
  if (/synthetic/i.test(p.sustainabilityNote ?? "")) return true;
  // Safety net: explicit synthetic brand aliases
  if (p.id === "tyvek" || p.id === "non-tearable") return true;
  return false;
}

/** Biodegradable = natural fibre papers (everything except synthetic stocks). */
export function isBiodegradable(p: CatalogProduct): boolean {
  return !isSynthetic(p);
}

/** Recyclable via the paper stream = same exclusion — synthetic / HDPE stocks need a different stream. */
export function isRecyclable(p: CatalogProduct): boolean {
  return !isSynthetic(p);
}

export const COLOR_NAME_HEX: Record<string, string> = {
  "Aqua Blue": "#00B4D8", Beige: "#F5F0E1", Bianco: "#FFFFFF",
  Black: "#1A1A1A", "Black Velvet": "#0D0D0D", Blue: "#1E5AA8",
  "Bright White": "#FFFFFF", Bronze: "#8C6239", Brown: "#6B4226",
  Burgundy: "#6D071A", "Candle Light Cream": "#FFF1D6", Clear: "#F5F5F5",
  Cobalt: "#1E4D9B", Coffee: "#4A2C2A", "Coffee Brown": "#4B3621",
  Corn: "#E8C547", Cream: "#F5EBDD", "Crystal Ice": "#E8F4F8",
  "Dark Blue": "#16305C", "Dark Brown": "#3D2817", "Dark Green": "#1B3D2B",
  "Dark Grey": "#4A4A4A", "Dark Red": "#5E161A", "English Green": "#205C37",
  "Fire Red": "#652D20", Gold: "#D4AF37", "Graphite Grey": "#4B4B4B",
  Green: "#2E7D4F", Grey: "#8A8A8A", Grigio: "#8A8A8A",
  "Hp Orange": "#E8590C", "Ice Gold": "#D9C79A", "Ice White": "#F2F6F7",
  Ivory: "#F3EDDD", "Kraft Brown": "#A9723A", "Light Cream": "#FAF3E4",
  "Light Gold": "#E6D19A", "Linen Touch": "#EFE7D8", "Marble White": "#F0F0EC",
  Maroon: "#6E1423", "Master White": "#FAFAFA", Marrone: "#6B4226",
  "Natural White": "#F7F5EF", Natura: "#E4D9C2", Natural: "#E8DFC8",
  Navy: "#16234A", "Navy Blue": "#1B2A52", Nero: "#1A1A1A",
  Orange: "#AA6F39", "Parrot Green": "#4C9A2A", Peach: "#F3B893",
  "Pearl White": "#F4F2ED", Petrol: "#124559", Pink: "#E88AA8",
  "Pure Pearl": "#F5F0EA", Purple: "#6A3E9A", "Real Copper": "#B87333", "Real Gold": "#C99A2E",
  Red: "#C1272D", "Red Wine": "#5E161A", Rosso: "#C1272D",
  Saffron: "#F4A11A", "Shimmer White": "#F6F6F2", "Shocking Pink": "#7F3C68",
  "Snow Sand": "#EDE3D0", Sunshine: "#FBC02D", Taro: "#8E7CC3",
  Tobacco: "#6B4A2E", Turquoise: "#2FA5A0", Verde: "#2E7D4F",
  White: "#FFFFFF", "White Gold": "#E9DFC3", Wine: "#5E161A",
  "Wood Palm": "#8A6D3B", "Yellow Gold": "#D9B44A",
};

export interface KnowledgeBaseRule {
  id: string;
  category: string;
  rule: string;
  priority: string;
  notes?: string;
}

export const AI_KNOWLEDGE_BASE: KnowledgeBaseRule[] = [
  {
    "id": "AI001",
    "category": "Recommendation",
    "rule": "Recommend only products with Status = Active.",
    "priority": "Critical",
    "notes": "Do not suggest discontinued or inactive SKUs."
  },
  {
    "id": "AI002",
    "category": "Availability",
    "rule": "Check Commercial Data before confirming availability.",
    "priority": "Critical",
    "notes": "Use 'subject to stock confirmation' when stock is blank."
  },
  {
    "id": "AI003",
    "category": "Matching",
    "rule": "Rank by application, printing process, finishing process, GSM, size, colour and price band.",
    "priority": "High",
    "notes": "Return best match plus one alternative."
  },
  {
    "id": "AI004",
    "category": "Unverified Data",
    "rule": "Do not claim blank or unverified technical fields as facts.",
    "priority": "Critical",
    "notes": "Ask the customer or recommend testing."
  },
  {
    "id": "AI005",
    "category": "Spot UV",
    "rule": "Do not recommend Spot UV unless the family is specifically verified as suitable.",
    "priority": "Critical",
    "notes": "Mahaveer Papers has indicated Spot UV is generally not suitable on the current range."
  },
  {
    "id": "AI006",
    "category": "Dark Papers",
    "rule": "For dark papers, warn that regular CMYK may not be visible.",
    "priority": "High",
    "notes": "Suggest foiling, screen printing or white toner where compatible."
  },
  {
    "id": "AI007",
    "category": "Folding",
    "rule": "For heavy GSM, recommend scoring before folding.",
    "priority": "High",
    "notes": "Especially packaging and invitation covers."
  },
  {
    "id": "AI008",
    "category": "Food Contact",
    "rule": "Never claim food-contact suitability without certification.",
    "priority": "Critical",
    "notes": "Use certified products only."
  },
  {
    "id": "AI009",
    "category": "Response Format",
    "rule": "Provide Best Match, Why It Fits, Available GSM/Size, Printing/Finishing Notes, and Alternative.",
    "priority": "Medium",
    "notes": "Keep recommendation practical and sales-friendly."
  },
  {
    "id": "AI010",
    "category": "Clarification",
    "rule": "Ask only the most important missing questions before recommending.",
    "priority": "High",
    "notes": "Application, printing method, GSM, colour, quantity and budget."
  }
];
