// Revision brief (Sustainability and Blog — "Launch decision"): the blog previously
// listed nine "Coming soon" cards dated Nov 2024, including a 2025-trend title with a
// stale date — neither published nor removed. Replaced with three complete, published
// articles instead (see "First articles" in the same brief).

export interface BlogContentBlock {
  type: "p" | "h2" | "ul";
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: BlogContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "understanding-gsm-and-paper-thickness",
    category: "Industry Tips",
    title: "Understanding GSM and Paper Thickness",
    excerpt:
      "GSM is the industry's shorthand for paper weight — but weight and thickness aren't the same thing. Here's how to read a GSM spec and choose the right one for your project.",
    date: "Aug 12, 2026",
    image: "/figma/paper-texture.jpg",
    content: [
      {
        type: "p",
        text: "GSM stands for grams per square metre — the weight of one square metre of a given paper. It's the single most common spec you'll see on a paper data sheet, and for good reason: it's a quick, standardised way to compare stocks from different mills.",
      },
      { type: "h2", text: "GSM isn't the same as thickness" },
      {
        type: "p",
        text: "Two papers at the same GSM can feel noticeably different in the hand. A dense, tightly calendered sheet packs more fibre into less volume, so it can weigh the same as a fluffier, bulkier sheet while feeling thinner. Thickness (often called caliper, measured in microns or points) and GSM are related but independently specified — when a project depends on a precise sheet thickness (fitting a machine feed, a die-cut tolerance, an envelope window), ask for caliper alongside GSM rather than assuming one implies the other.",
      },
      { type: "h2", text: "Typical GSM ranges and what they're used for" },
      {
        type: "ul",
        items: [
          "35–55 GSM — newsprint and lightweight text papers",
          "70–100 GSM — everyday office and offset printing paper",
          "120–170 GSM — brochures, flyers, letterheads, better stationery",
          "200–300 GSM — postcards, business cards, covers, light board",
          "300 GSM+ — rigid boxes, presentation folders, premium packaging boards",
        ],
      },
      { type: "h2", text: "Choosing the right GSM for your project" },
      {
        type: "p",
        text: "Start with how the piece will be handled. Something that passes through many hands repeatedly — a menu, a swing tag, a business card — needs enough weight to resist creasing and wear. Something folded (a brochure, a greeting card) needs to be heavy enough to hold its shape but light enough to fold cleanly without cracking at the spine. For packaging, GSM is usually secondary to the board's overall construction (single-ply, duplex, triplex), but it still sets the baseline for rigidity and perceived quality.",
      },
      {
        type: "p",
        text: "If you're unsure which GSM suits your application, our team can talk you through options based on your finishing process, printing method and how the final piece will be used — reach out and we'll help you narrow it down, with samples if you'd like to feel the difference yourself.",
      },
    ],
  },
  {
    slug: "choosing-paper-for-premium-packaging",
    category: "Product Guide",
    title: "Choosing Paper for Premium Packaging",
    excerpt:
      "Packaging is often the first physical thing a customer touches. The paper you choose does a lot of the work in making that moment feel considered.",
    date: "Aug 18, 2026",
    image: "/figma/category-packaging.jpg",
    content: [
      {
        type: "p",
        text: "Premium packaging isn't only about print quality — the substrate underneath the print carries most of the perceived value. A well-chosen board or wrap communicates care before a customer has read a single word of the copy on it.",
      },
      { type: "h2", text: "What actually reads as \"premium\"" },
      {
        type: "ul",
        items: [
          "Weight and rigidity — a board that holds its shape and resists denting in transit",
          "A consistent, true colour across the run, without visible batch variation",
          "Texture — a tactile surface (linen, felt, matte-coated) that invites touching",
          "A finish that suits the brand — matte for understated luxury, metallic or gloss for high-shine retail",
        ],
      },
      { type: "h2", text: "Matching the stock to the job" },
      {
        type: "p",
        text: "Rigid boxes and presentation packaging usually call for heavier boards (300 GSM and above, or laminated board constructions) that can be creased and glued without splitting at the fold. Wrapping papers and inserts can run lighter, since they're supported by what's inside. Labels and shelf-facing panels benefit from a smooth, print-friendly surface that holds fine detail and colour accurately, since that's what a customer actually sees on the shelf.",
      },
      { type: "h2", text: "Durability and handling" },
      {
        type: "p",
        text: "Packaging is handled more roughly than most print — shipped, stacked, opened and closed repeatedly. Consider how the paper performs under real conditions: does it scuff easily, does the finish scratch, does the board hold a crease cleanly through repeated opening? These are worth testing with a physical sample before committing to a production run.",
      },
      { type: "h2", text: "Sustainability, without the guesswork" },
      {
        type: "p",
        text: "Paper is naturally biodegradable and recyclable, and many of our ranges include FSC-certified options for brands that want responsibly sourced packaging without compromising on finish or feel. If certification matters for your brand story, tell us upfront — it narrows the options quickly to stocks that fit both the look you want and the credentials you need.",
      },
      {
        type: "p",
        text: "Not sure where to start? Send us your box dimensions, print method and finish preference, and we'll recommend a shortlist of papers to sample.",
      },
    ],
  },
  {
    slug: "guide-to-speciality-paper-textures-and-finishes",
    category: "Product Guide",
    title: "A Guide to Speciality-Paper Textures and Finishes",
    excerpt:
      "Texture and finish are what separate a paper that photographs well from one that feels genuinely premium in the hand. Here's a plain-language guide to the most common types.",
    date: "Aug 24, 2026",
    image: "/figma/colored-papers.jpg",
    content: [
      {
        type: "p",
        text: "Colour and weight are the first things most people specify when choosing paper — but texture and finish are what a person actually notices when they pick something up. A subtle change in surface can shift a piece from \"printed\" to \"crafted.\"",
      },
      { type: "h2", text: "Common textures" },
      {
        type: "ul",
        items: [
          "Linen — a fine woven pattern, classic for stationery and certificates",
          "Hammer / hammered — an irregular, dimpled surface with an artisanal feel",
          "Felt — a soft, slightly fibrous surface with gentle texture, popular for invitations",
          "Laid — fine parallel lines running through the sheet, a traditional writing-paper texture",
          "Smooth / wove — an even, uniform surface with no visible texture, letting colour and print take centre stage",
        ],
      },
      { type: "h2", text: "Common finishes" },
      {
        type: "ul",
        items: [
          "Matte — a non-reflective surface that reads as understated and premium",
          "Gloss — a reflective, high-shine surface that makes colours look vivid and saturated",
          "Metallic / pearl — a shimmering surface with a shifting sheen, used for standout labels and packaging",
          "Uncoated — a natural, paper-like surface with soft ink absorption, often chosen for a warmer, tactile look",
        ],
      },
      { type: "h2", text: "Matching texture to the job" },
      {
        type: "p",
        text: "For fine stationery and invitations, a textured, uncoated stock (linen or felt) tends to feel the most considered — it holds foil and letterpress beautifully. For packaging and labels that need to catch the eye on a shelf, metallics and glossy coatings do more visual work. For anything with dense photography or fine detail, a smooth or lightly textured surface keeps the printed image sharp rather than competing with the paper's own pattern.",
      },
      {
        type: "p",
        text: "Texture and finish are hard to judge from a screen — we'd always recommend requesting a physical swatch before finalising a specification, especially for foil, letterpress or metallic work where the paper's surface directly affects the result.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
