"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";

const F23 = "https://www.favini.com/gs/wp-content/uploads/2023/04";
const F24 = "https://www.favini.com/gs/wp-content/uploads/2024/11";
const M   = "https://www.mahaveerpapers.com/uploads/mahaveerpapers";

const digiluxProducts = [
  // ── MP Textures ──────────────────────────────────────────────────────────
  { id: "mp192",   name: "MP 192 Needle Point Cream",       gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/192-needle%20point%20cream.jpg` },
  { id: "mp366",   name: "MP 366 Kriss Kross Cream",        gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/366-KRISS%20KROSS%20CREAM.jpg` },
  { id: "mp398",   name: "MP 398 HB Needle Point White",    gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/398-needle%20point%20white.jpg` },
  { id: "mp456",   name: "MP 456 Fine Toie Cream",          gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/456-fine%20toie%20cream.jpg` },
  { id: "mp486",   name: "MP 486 HB Design Bag White",      gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/DESIGN-BAG-WHITE.jpg` },
  { id: "mp536",   name: "MP 536 HB Valentino White",       gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${F24}/Twill-White-500x500.jpg` },
  { id: "mp538",   name: "MP 538 Valentino Cream",          gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${F24}/Twill-Chamois-500x500.jpg` },
  { id: "mp541",   name: "MP 541 Toyle Moyne Cream",        gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/541-toyle%20moyne%20cream.jpg` },
  { id: "mp800",   name: "MP 800 HB Classic Linen White",   gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/800-CLASSIC%20LINEN%20WHITE.jpg` },
  { id: "mp811",   name: "MP 811 HB Linea White",           gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/811-KRISS%20KROSS%20WHITE.jpg` },
  { id: "mp897",   name: "MP 897 HB Toyle Moyne White",     gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/897-TOYLE%20MOYNE%20WHITE.jpg` },
  { id: "mp1030",  name: "MP 1030 HB Silk Soie White",      gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/SILK-SOIE-PEARL-WHITE.jpg` },
  { id: "mp1031",  name: "MP 1031 Silk Soie Cream",         gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${M}/SILK-SOIE-CREAM.jpg` },
  { id: "mp1182",  name: "MP 1182 HB Canvas Linen White",   gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${F23}/Biancoflash-Embossed-Premium-Classic-Linen-LN-500x500.jpg` },
  { id: "mp1214",  name: "MP 1214 HB White Net",            gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${F23}/Biancoflash-Embossed-Premium-Hexagons-HX-500x500.jpg` },
  { id: "natural-rock", name: "Natural Rock",               gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",    image: `${F23}/Shiro-Echo-Raw-Sand-500x500.jpg` },

  // ── Prisma ───────────────────────────────────────────────────────────────
  { id: "prisma-white-120",  name: "Prisma White",  gsm: "120 GSM", size: "13 × 19 Inch", type: "Textured",  image: `${F24}/Prisma-White-500x500.jpg` },
  { id: "prisma-white-250",  name: "Prisma White",  gsm: "250 GSM", size: "13 × 19 Inch", type: "Textured",  image: `${F24}/Prisma-White-500x500.jpg` },
  { id: "prisma-white-300",  name: "Prisma White",  gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",  image: `${F24}/Prisma-White-500x500.jpg` },
  { id: "prisma-ivory-120",  name: "Prisma Ivory",  gsm: "120 GSM", size: "13 × 19 Inch", type: "Textured",  image: `${F24}/Prisma-Ivory-500x500.jpg` },
  { id: "prisma-ivory-250",  name: "Prisma Ivory",  gsm: "250 GSM", size: "13 × 19 Inch", type: "Textured",  image: `${F24}/Prisma-Ivory-500x500.jpg` },
  { id: "prisma-ivory-300",  name: "Prisma Ivory",  gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured",  image: `${F24}/Prisma-Ivory-500x500.jpg` },

  // ── Twill ────────────────────────────────────────────────────────────────
  { id: "twill-white-120",   name: "Twill Bright White", gsm: "120 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Bright-White-500x500.jpg` },
  { id: "twill-white-240",   name: "Twill Bright White", gsm: "240 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Bright-White-500x500.jpg` },
  { id: "twill-white-300",   name: "Twill Bright White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Bright-White-500x500.jpg` },
  { id: "twill-ivory-120",   name: "Twill Ivory",        gsm: "120 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Chamois-500x500.jpg` },
  { id: "twill-ivory-240",   name: "Twill Ivory",        gsm: "240 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Chamois-500x500.jpg` },
  { id: "twill-ivory-300",   name: "Twill Ivory",        gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Chamois-500x500.jpg` },

  // ── Tradition Valentino ───────────────────────────────────────────────────
  { id: "valentino-120", name: "Tradition Valentino", gsm: "120 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Nude-500x500.jpg` },
  { id: "valentino-300", name: "Tradition Valentino", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: `${F24}/Twill-Nude-500x500.jpg` },

  // ── Plain / Coated ────────────────────────────────────────────────────────
  { id: "eco-hb-white",  name: "Eco HB White",       gsm: "300 GSM", size: "13 × 19 Inch", type: "Plain",       image: `${F23}/Shiro-Echo-Bright-White-500x500.jpg` },
  { id: "influence-w",   name: "Influence White",     gsm: "240 GSM", size: "13 × 19 Inch", type: "Plain",       image: `${M}/INFLUIENCE%20BRIGHT%20WHITE.jpg` },
  { id: "vanor",         name: "Vanor",               gsm: "285 GSM", size: "13 × 19 Inch", type: "Coated",      image: `${F23}/Biancoflash-Premium-500x500.jpg` },

  // ── Metallic ─────────────────────────────────────────────────────────────
  { id: "pearl-white",   name: "HB Pearl White",      gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic",    image: `${M}/swatch1.png` },
  { id: "ice-white",     name: "HB Ice White",        gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic",    image: `${M}/swatch2.png` },

  // ── Translucent ───────────────────────────────────────────────────────────
  { id: "transluscent",  name: "Transluscent Clear",  gsm: "90 GSM",  size: "13 × 19 Inch", type: "Translucent", image: `${M}/swatch3.png` },
];

const thicknesses = ["All", "90 GSM", "120 GSM", "240 GSM", "250 GSM", "285 GSM", "300 GSM"];
const sizeOptions  = ["All Sizes", "13 × 19 Inch"];
const typeOptions  = ["All Types", "Textured", "Plain", "Coated", "Metallic", "Translucent"];

type FilterKey = "thickness" | "size" | "type";

export function DigiLuxCatalog() {
  const [activeThickness, setActiveThickness] = useState("All");
  const [activeSize,      setActiveSize]      = useState("All Sizes");
  const [activeType,      setActiveType]      = useState("All Types");
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(key: FilterKey) {
    setOpenKey(prev => (prev === key ? null : key));
  }

  function dropdownList(options: string[], current: string, onSelect: (v: string) => void) {
    return (
      <div className="absolute top-[calc(100%+12px)] left-0 min-w-[220px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
        {options.map(opt => (
          <button key={opt} type="button"
            onClick={() => { onSelect(opt); setOpenKey(null); }}
            className={`w-full text-left px-5 py-3 text-sm transition-colors ${
              current === opt
                ? "bg-brand-orange/10 text-brand-orange font-semibold"
                : "text-brand-navy hover:bg-gray-50"
            }`}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  function sectionBtn(key: FilterKey, radius = "") {
    if (!openKey) return `hover:bg-gray-50 ${radius}`;
    if (openKey === key) return `bg-white shadow-sm ${radius}`;
    return radius;
  }

  const filtered = digiluxProducts.filter(p => {
    const matchT = activeThickness === "All"       || p.gsm  === activeThickness;
    const matchS = activeSize      === "All Sizes" || p.size === activeSize;
    const matchP = activeType      === "All Types" || p.type === activeType;
    return matchT && matchS && matchP;
  });

  return (
    <>
      {/* ── FILTER BAR ── */}
      <div className="bg-[#0a1520] py-10 lg:py-14">
        <div className="container-max section-padding">
          <div
            ref={pillRef}
            className={`relative flex items-stretch rounded-full shadow-2xl transition-colors duration-200 ${openKey ? "bg-[#e8e8e8]" : "bg-white"}`}
          >
            {/* Thickness */}
            <div className="relative flex-1 min-w-0">
              <button type="button" onClick={() => toggle("thickness")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("thickness", "rounded-l-full")}`}>
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Thickness</p>
                <p className="text-gray-400 text-[13px] mt-1">
                  {activeThickness === "All" ? "What's the thickness?" : activeThickness}
                </p>
              </button>
              {openKey === "thickness" && dropdownList(thicknesses, activeThickness, setActiveThickness)}
            </div>

            <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

            {/* Size */}
            <div className="relative flex-1 min-w-0">
              <button type="button" onClick={() => toggle("size")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("size", "rounded-2xl")}`}>
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Size</p>
                <p className="text-gray-400 text-[13px] mt-1">
                  {activeSize === "All Sizes" ? "What's the paper size?" : activeSize}
                </p>
              </button>
              {openKey === "size" && dropdownList(sizeOptions, activeSize, setActiveSize)}
            </div>

            <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

            {/* Paper Type */}
            <div className="relative flex-1 min-w-0">
              <button type="button" onClick={() => toggle("type")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("type", "rounded-2xl")}`}>
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Paper Type</p>
                <p className="text-gray-400 text-[13px] mt-1">
                  {activeType === "All Types" ? "What's the type?" : activeType}
                </p>
              </button>
              {openKey === "type" && dropdownList(typeOptions, activeType, setActiveType)}
            </div>

            {/* Search button */}
            <div className="flex items-center px-2 flex-shrink-0">
              <button type="button" aria-label="Search"
                className="bg-brand-orange hover:bg-orange-600 transition-colors text-white rounded-full w-12 h-12 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATALOG ── */}
      <div className="bg-white py-10 lg:py-14">
        <div className="container-max section-padding">
          <div className="mb-8 lg:mb-10">
            <h2 className="font-sans font-bold text-brand-navy text-2xl lg:text-3xl">DigiLux</h2>
            <p className="text-gray-400 font-medium mt-1 text-base">
              {filtered.length} Product{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No products match your filters.</p>
              <p className="text-sm mt-1">Try adjusting the filter options above.</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filtered.map((product, i) => (
              <MotionDiv key={product.id} delay={0.03 + (i % 8) * 0.03}>
                <Link href={`/contact?product=${encodeURIComponent(`${product.name} ${product.gsm}`)}`} className="group block" aria-label={`Enquire about ${product.name}`}>
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center shadow">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M1 1h10v7H7l-3 3V8H1V1z" stroke="#0F1923" strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                      </div>
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

                  <h3 className="font-sans font-bold text-brand-navy text-sm lg:text-base leading-snug group-hover:text-brand-orange transition-colors">
                    {product.name}
                  </h3>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
