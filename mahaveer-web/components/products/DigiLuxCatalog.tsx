"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, ImageOff } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Full 55-SKU DigiLux range, sourced from the Digilux_All_Product_Master
// spreadsheet (Aug 2026) — Product Name, Product Category, Colour Name,
// GSM/Thickness and Size columns. Names have the "MP" prefix stripped per
// request (the item number is shown directly). Where we hold a genuine
// product photograph it's linked below (served locally, no hotlinks); the
// rest render the same "photo coming soon" placeholder already used on the
// main Products catalogue until photography is available.
const digiluxProducts: {
  id: string;
  name: string;
  gsm: string;
  size: string;
  type: string;
  colour: string;
  application: string;
  image: string | null;
}[] = [
  { id: "dlx-001", name: "Eco HB White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/eco-hb-white.jpg" },
  { id: "dlx-002", name: "398 HB Needle Point White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/needle-point-white.jpg" },
  { id: "dlx-003", name: "456 Fine Toie Cream", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "Cream", application: "Stationery", image: "/images/mahaveer/fine-toie-cream.jpg" },
  { id: "dlx-004", name: "486 HB Design Bag White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/design-bag-white.jpg" },
  { id: "dlx-005", name: "536 HB Valentino White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/valentino-white.jpg" },
  { id: "dlx-006", name: "541 Toyle Moyne Cream", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "Cream", application: "Stationery", image: "/images/mahaveer/toyle-moyne-cream.jpg" },
  { id: "dlx-007", name: "800 HB Classic Linen White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/classic-linen-white.jpg" },
  { id: "dlx-008", name: "811 HB Linea White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/linea-white.jpg" },
  { id: "dlx-009", name: "815 HB Fine Toie White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/815-hb-fine-toie-white.jpg" },
  { id: "dlx-010", name: "897 HB Toyle Moyne White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/toyle-moyne-white.jpg" },
  { id: "dlx-011", name: "1182 HB Canvas Linen White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/canvas-linen-white.jpg" },
  { id: "dlx-012", name: "1207 HB K-Linen", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/k-linen-white.jpg" },
  { id: "dlx-013", name: "1214 HB White Net", gsm: "300 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/white-net.jpg" },
  { id: "dlx-014", name: "1215 K White Linen", gsm: "135 GSM", size: "13 × 19 Inch", type: "Texture & High-Bulk Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/1215-k-white-linen.jpg" },
  { id: "dlx-015", name: "Vanor", gsm: "285 GSM", size: "13 × 19 Inch", type: "Premium Paper & Boards", colour: "White", application: "Branding", image: "/images/mahaveer/vanor.jpg" },
  { id: "dlx-016", name: "Influence Bright White", gsm: "270 GSM", size: "13 × 19 Inch", type: "Premium Paper & Boards", colour: "White", application: "Branding", image: "/images/favini/influence-white-real.jpg" },
  { id: "dlx-017", name: "Influence Ivory", gsm: "270 GSM", size: "13 × 19 Inch", type: "Premium Paper & Boards", colour: "Ivory", application: "Branding", image: "/images/favini/influence-ivory-real.jpg" },
  { id: "dlx-018", name: "Kraft Board", gsm: "280 GSM", size: "13 × 19 Inch", type: "Premium Paper & Boards", colour: "Natural", application: "Stationery", image: "/images/mahaveer/kraft-board.jpg" },
  { id: "dlx-019", name: "HB Pearl White", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/lustre-pearl-white.jpg" },
  { id: "dlx-020", name: "HB Ice White", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic Boards", colour: "White", application: "Stationery", image: "/images/mahaveer/lustre-ice-white.jpg" },
  { id: "dlx-021", name: "HB Yellow Gold", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic Boards", colour: "Gold", application: "Stationery", image: "/images/mahaveer/lustre-yellow-gold.jpg" },
  { id: "dlx-022", name: "Light Gold Fine Toie", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic Boards", colour: "Gold", application: "Stationery", image: "/images/mahaveer/lustre-light-gold.jpg" },
  { id: "dlx-023", name: "Kent Ivory", gsm: "290 GSM", size: "13 × 19 Inch", type: "Premium Paper & Boards", colour: "Ivory", application: "Stationery", image: "/images/mahaveer/kent-ivory.jpg" },
  { id: "dlx-024", name: "Paperlike Synthetic", gsm: "210 GSM", size: "13 × 19 Inch", type: "Synthetic Durable Media", colour: "White", application: "Stationery", image: "/images/mahaveer/paperlike-synthetic.jpg" },
  { id: "dlx-025", name: "Ultra Clear", gsm: "125 Micron", size: "13 × 19 Inch", type: "Clear Films", colour: "Clear", application: "Stationery", image: "/images/mahaveer/translucent-clear.jpg" },
  { id: "dlx-026", name: "Ultra Clear", gsm: "175 Micron", size: "13 × 19 Inch", type: "Clear Films", colour: "Clear", application: "Stationery", image: "/images/mahaveer/translucent-clear.jpg" },
  { id: "dlx-027", name: "Non Tearable", gsm: "150 Micron", size: "13 × 19 Inch", type: "Non-Tearable Media", colour: "White", application: "Stationery", image: "/images/mahaveer/nt-matt.jpg" },
  { id: "dlx-028", name: "Non Tearable", gsm: "200 Micron", size: "13 × 19 Inch", type: "Non-Tearable Media", colour: "White", application: "Stationery", image: "/images/mahaveer/nt-matt.jpg" },
  { id: "dlx-029", name: "Non Tearable", gsm: "250 Micron", size: "13 × 19 Inch", type: "Non-Tearable Media", colour: "White", application: "Stationery", image: "/images/mahaveer/nt-matt.jpg" },
  { id: "dlx-030", name: "Non Tearable", gsm: "300 Micron", size: "13 × 19 Inch", type: "Non-Tearable Media", colour: "White", application: "Stationery", image: "/images/mahaveer/nt-matt.jpg" },
  { id: "dlx-031", name: "Non Tearable", gsm: "350 Micron", size: "13 × 19 Inch", type: "Non-Tearable Media", colour: "White", application: "Stationery", image: "/images/mahaveer/nt-matt.jpg" },
  { id: "dlx-032", name: "Digilux Chromo", gsm: "90/110", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "White", application: "Labels", image: "/images/mahaveer/digilux-chromo.jpg" },
  { id: "dlx-033", name: "Realtak Chromo", gsm: "90/130", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "White", application: "Labels", image: "/images/mahaveer/realtak-chromo.jpg" },
  { id: "dlx-034", name: "Dubble Chromo", gsm: "90/130", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "White", application: "Labels", image: "/images/mahaveer/dubble-chromo.jpg" },
  { id: "dlx-035", name: "Stay On Chromo", gsm: "90/125", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "White", application: "Labels", image: "/images/mahaveer/stay-on-chromo.jpg" },
  { id: "dlx-036", name: "3i Mirror Coat", gsm: "90/130", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "White", application: "Labels", image: "/images/mahaveer/3i-mirror-coat.jpg" },
  { id: "dlx-037", name: "Stay On Mirror Coat", gsm: "90/125", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "White", application: "Labels", image: "/images/mahaveer/stay-on-mirror-coat.jpg" },
  { id: "dlx-038", name: "Chromo Black/Back", gsm: "90/130", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "Black", application: "Labels", image: "/images/mahaveer/chromo-black-back.jpg" },
  { id: "dlx-039", name: "Expresso Kraft", gsm: "R-100", size: "13 × 19 Inch", type: "Self-Adhesive Paper Labels", colour: "Natural", application: "Labels", image: "/images/mahaveer/expresso-kraft.jpg" },
  { id: "dlx-040", name: "Realtak PVC Clear", gsm: "R-160", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Clear", application: "Labels", image: "/images/mahaveer/realtak-pvc-clear.jpg" },
  { id: "dlx-041", name: "Realtak Milky Opaque", gsm: "R-160", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Opaque", application: "Labels", image: "/images/mahaveer/realtak-milky-opaque.jpg" },
  { id: "dlx-042", name: "Expresso PVC Clear", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Clear", application: "Labels", image: "/images/mahaveer/expresso-pvc-clear.jpg" },
  { id: "dlx-043", name: "Expresso Synthetic Matt", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "White", application: "Labels", image: "/images/mahaveer/expresso-synthetic-matt.jpg" },
  { id: "dlx-044", name: "Expresso Synthetic Gloss", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "White", application: "Labels", image: "/images/mahaveer/expresso-synthetic-gloss.jpg" },
  { id: "dlx-045", name: "Expresso Opaque White Matt", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Opaque", application: "Labels", image: "/images/mahaveer/expresso-opaque-white-matt.jpg" },
  { id: "dlx-046", name: "Expresso Opaque White Gloss", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Opaque", application: "Labels", image: "/images/mahaveer/expresso-opaque-white-gloss.jpg" },
  { id: "dlx-047", name: "Expresso Poly Silver Matt", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Silver", application: "Labels", image: "/images/mahaveer/expresso-poly-silver-matt.jpg" },
  { id: "dlx-048", name: "Dubble M/PET Grey", gsm: "R-130", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Grey", application: "Labels", image: "/images/mahaveer/dubble-mpet-grey.jpg" },
  { id: "dlx-049", name: "Expresso PVC Silver", gsm: "R-140", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Silver", application: "Labels", image: "/images/mahaveer/expresso-pvc-silver.jpg" },
  { id: "dlx-050", name: "Dubble PET Gold", gsm: "R-130", size: "13 × 19 Inch", type: "Self-Adhesive Synthetic Labels", colour: "Gold", application: "Labels", image: "/images/mahaveer/dubble-pet-gold.jpg" },
  { id: "dlx-051", name: "Crystal Ice Label", gsm: "120/90", size: "13 × 19 Inch", type: "Speciality Labels", colour: "Clear", application: "Labels", image: "/images/mahaveer/digilux-crystal-ice.jpg" },
  { id: "dlx-052", name: "Pure Pearl Label", gsm: "110/90", size: "13 × 19 Inch", type: "Speciality Labels", colour: "Pearl", application: "Labels", image: "/images/mahaveer/digilux-pure-pearl.jpg" },
  { id: "dlx-053", name: "Black Velvet Label", gsm: "120/90", size: "13 × 19 Inch", type: "Speciality Labels", colour: "Black", application: "Labels", image: "/images/mahaveer/digilux-black-velvet.jpg" },
  { id: "dlx-054", name: "Snow Sand Label", gsm: "130/90", size: "13 × 19 Inch", type: "Speciality Labels", colour: "White", application: "Labels", image: "/images/mahaveer/digilux-snow-sand.jpg" },
  { id: "dlx-055", name: "Linen Touch Label", gsm: "120/90", size: "13 × 19 Inch", type: "Speciality Labels", colour: "White", application: "Labels", image: "/images/mahaveer/digilux-linen-touch.jpg" },
];

const applicationOptions = ["All", "Stationery", "Branding", "Labels"];
const categoryOptions = [
  "All",
  "Texture & High-Bulk Boards",
  "Premium Paper & Boards",
  "Metallic Boards",
  "Synthetic Durable Media",
  "Clear Films",
  "Non-Tearable Media",
  "Self-Adhesive Paper Labels",
  "Self-Adhesive Synthetic Labels",
  "Speciality Labels",
];
const colourOptions = ["All", "White", "Cream", "Ivory", "Gold", "Silver", "Grey", "Black", "Clear", "Opaque", "Natural", "Pearl"];

type FilterKey = "application" | "category" | "colour";

const PAGE_SIZE = 8;

export function DigiLuxCatalog() {
  const [activeApplication, setActiveApplication] = useState("All");
  const [activeCategory,    setActiveCategory]    = useState("All");
  const [activeColour,      setActiveColour]      = useState("All");
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [showAll, setShowAll] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(key: FilterKey) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  function dropdownList(options: string[], current: string, onSelect: (v: string) => void) {
    return (
      <div className="absolute top-[calc(100%+12px)] left-0 min-w-[220px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              onSelect(opt);
              setOpenKey(null);
            }}
            className={`w-full text-left px-5 py-3 text-sm transition-colors ${
              current === opt
                ? "bg-brand-orange/10 text-brand-orange font-semibold"
                : "text-brand-navy hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  const filtered = digiluxProducts.filter((p) => {
    const matchApp = activeApplication === "All" || p.application === activeApplication;
    const matchCat = activeCategory === "All" || p.type === activeCategory;
    const matchCol = activeColour === "All" || p.colour === activeColour;
    return matchApp && matchCat && matchCol;
  });

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const hasMore = !showAll && filtered.length > PAGE_SIZE;

  function selectAndCollapse<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setShowAll(false);
    };
  }

  return (
    <>
      {/* ── FILTER BAR ── Figma: white pill, DigiLux logo chip on the left, orange search circle on the right */}
      <div
        ref={pillRef}
        className="relative flex items-stretch rounded-full border border-gray-200 bg-white shadow-sm mb-14"
      >
        <div className="hidden sm:flex items-center pl-2 pr-1 shrink-0">
          <Image
            src="/images/digilux-logo.png"
            alt="DigiLux"
            width={110}
            height={42}
            className="h-9 w-auto rounded-full"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => toggle("application")}
            className="w-full h-full text-left px-6 py-4 transition-colors hover:bg-gray-50 rounded-full"
          >
            <p className="font-semibold text-brand-navy text-[15px] leading-tight">Application</p>
            <p className="text-gray-400 text-[13px] mt-0.5">
              {activeApplication === "All" ? "What's your Project?" : activeApplication}
            </p>
          </button>
          {openKey === "application" && dropdownList(applicationOptions, activeApplication, selectAndCollapse(setActiveApplication))}
        </div>

        <div className="self-center h-9 w-px flex-shrink-0 bg-gray-200" />

        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => toggle("category")}
            className="w-full h-full text-left px-6 py-4 transition-colors hover:bg-gray-50 rounded-full"
          >
            <p className="font-semibold text-brand-navy text-[15px] leading-tight">Categories</p>
            <p className="text-gray-400 text-[13px] mt-0.5">
              {activeCategory === "All" ? "What's your Category?" : activeCategory}
            </p>
          </button>
          {openKey === "category" && dropdownList(categoryOptions, activeCategory, selectAndCollapse(setActiveCategory))}
        </div>

        <div className="self-center h-9 w-px flex-shrink-0 bg-gray-200" />

        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => toggle("colour")}
            className="w-full h-full text-left px-6 py-4 transition-colors hover:bg-gray-50 rounded-full"
          >
            <p className="font-semibold text-brand-navy text-[15px] leading-tight">Colour</p>
            <p className="text-gray-400 text-[13px] mt-0.5">
              {activeColour === "All" ? "What's your Shade?" : activeColour}
            </p>
          </button>
          {openKey === "colour" && dropdownList(colourOptions, activeColour, selectAndCollapse(setActiveColour))}
        </div>

        <div className="flex items-center px-2 flex-shrink-0">
          <button
            type="button"
            aria-label="Search"
            className="bg-brand-orange hover:bg-orange-600 transition-colors text-white rounded-full w-11 h-11 flex items-center justify-center"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* ── GRID ── */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No products match your filters.</p>
          <p className="text-sm mt-1">Try adjusting the filter options above.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {visible.map((product, i) => (
          <MotionDiv key={product.id} delay={0.03 + (i % 8) * 0.03}>
            <Link
              href={`/contact?product=${encodeURIComponent(`${product.name} ${product.gsm}`)}`}
              className="group block"
              aria-label={`Enquire about ${product.name}`}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-gray-400">
                    <ImageOff className="h-6 w-6" strokeWidth={1.5} />
                    <span className="text-[11px] font-medium">Photo coming soon</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 1h10v7H7l-3 3V8H1V1z" stroke="#0F1923" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <span className="text-[11px] border border-gray-300 text-gray-500 px-2.5 py-0.5 rounded-full leading-tight">
                  {product.gsm}
                </span>
                <span className="text-[11px] border border-gray-300 text-gray-500 px-2.5 py-0.5 rounded-full leading-tight">
                  {product.size}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[11px] border border-gray-300 text-gray-500 px-2.5 py-0.5 rounded-full leading-tight">
                  {product.type}
                </span>
              </div>

              <h3 className="font-sans font-bold text-brand-navy text-[13px] lg:text-sm leading-snug group-hover:text-brand-orange transition-colors">
                {product.name}
              </h3>
            </Link>
          </MotionDiv>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy/20 px-7 py-3.5 font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
