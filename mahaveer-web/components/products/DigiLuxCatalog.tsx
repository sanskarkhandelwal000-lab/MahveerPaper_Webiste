"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";

const digiluxProducts = [
  { id: "eco-hb-white", name: "Eco HB White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Plain", image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80" },
  { id: "mp398", name: "MP 398 HB Needle Point White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400&q=80" },
  { id: "mp456", name: "MP 456 Fine Toie Cream", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400&q=80" },
  { id: "mp486a", name: "MP 486 HB Design Bag White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80" },
  { id: "mp536", name: "MP 536 HB Valentino White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80" },
  { id: "mp541", name: "MP 541 Toyle Moyne Cream", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "mp800", name: "MP 800 HB Classic Linen White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=80" },
  { id: "mp811", name: "MP 811 Kriss Kross White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80" },
  { id: "mp815", name: "MP 815 HB Fine Toie White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80" },
  { id: "mp897", name: "MP 897 HB Toyle Moyne White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80" },
  { id: "mp1182", name: "MP 1182 HB Canvas Linen White", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400&q=80" },
  { id: "mp1207", name: "MP 1207 HB K-Linen", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400&q=80" },
  { id: "mp1214", name: "MP 1214 HB White Net", gsm: "300 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80" },
  { id: "mp1215", name: "MP 1215 K White Linen", gsm: "135 GSM", size: "13 × 19 Inch", type: "Textured", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80" },
  { id: "vanor", name: "Vanor", gsm: "285 GSM", size: "13 × 19 Inch", type: "Coated", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "kraft-board", name: "Kraft Board", gsm: "280 GSM", size: "13 × 19 Inch", type: "Plain", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=80" },
  { id: "transluscent", name: "Transluscent Clear", gsm: "285 GSM", size: "13 × 19 Inch", type: "Plain", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80" },
  { id: "pearl-white", name: "HB Pearl White", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80" },
  { id: "ice-white", name: "HB Ice White", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic", image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80" },
  { id: "yellow-gold", name: "HB Yellow Gold", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic", image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400&q=80" },
  { id: "light-gold", name: "Light Gold Fine Toie", gsm: "285 GSM", size: "13 × 19 Inch", type: "Metallic", image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400&q=80" },
  { id: "kent-ivory", name: "Kent Ivory", gsm: "290 GSM", size: "13 × 19 Inch", type: "Plain", image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80" },
  { id: "non-tearable-125", name: "Non Tearable (125 Micron)", gsm: "125 Micron", size: "13 × 19 Inch", type: "Non Tearable", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80" },
  { id: "non-tearable-200", name: "Non Tearable (200 Micron)", gsm: "200 Micron", size: "13 × 19 Inch", type: "Non Tearable", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

const thicknesses = ["All", "135 GSM", "280 GSM", "285 GSM", "290 GSM", "300 GSM", "125 Micron", "200 Micron"];
const sizes = ["All Sizes", "13 × 19 Inch"];
const paperTypes = ["All Types", "Plain", "Textured", "Coated", "Metallic", "Non Tearable"];

const typeColors: Record<string, string> = {
  Plain: "bg-gray-100 text-gray-700",
  Textured: "bg-amber-50 text-amber-800",
  Coated: "bg-blue-50 text-blue-700",
  Metallic: "bg-yellow-50 text-yellow-700",
  "Non Tearable": "bg-red-50 text-red-700",
};

export function DigiLuxCatalog() {
  const [activeThickness, setActiveThickness] = useState("All");
  const [activeSize, setActiveSize] = useState("All Sizes");
  const [activeType, setActiveType] = useState("All Types");

  const filtered = digiluxProducts.filter((p) => {
    const matchThickness = activeThickness === "All" || p.gsm === activeThickness;
    const matchSize = activeSize === "All Sizes" || p.size === activeSize;
    const matchType = activeType === "All Types" || p.type === activeType;
    return matchThickness && matchSize && matchType;
  });

  return (
    <>
      {/* ── FILTER BAR ── Figma: Thickness | Size | Paper Type */}
      <div className="bg-brand-navy/95 backdrop-blur-sm border-t border-white/10">
        <div className="container-max section-padding py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 gap-4 sm:gap-0">
            <div className="sm:pr-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Thickness</p>
              <p className="text-sm text-white/60 mb-2 font-medium">What&apos;s the thickness?</p>
              <div className="relative">
                <select value={activeThickness} onChange={(e) => setActiveThickness(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer">
                  {thicknesses.map((t) => <option key={t} value={t} className="text-brand-navy bg-white">{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
            </div>
            <div className="sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Size</p>
              <p className="text-sm text-white/60 mb-2 font-medium">What&apos;s the paper Size</p>
              <div className="relative">
                <select value={activeSize} onChange={(e) => setActiveSize(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer">
                  {sizes.map((s) => <option key={s} value={s} className="text-brand-navy bg-white">{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
            </div>
            <div className="sm:pl-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Paper Type</p>
              <p className="text-sm text-white/60 mb-2 font-medium">What&apos;s the type?</p>
              <div className="relative">
                <select value={activeType} onChange={(e) => setActiveType(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer">
                  {paperTypes.map((t) => <option key={t} value={t} className="text-brand-navy bg-white">{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATALOG ── */}
      <div className="section-padding py-10 lg:py-14 bg-white">
        <div className="container-max">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display italic text-brand-orange" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              DigiLux
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              {filtered.length} Product
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {filtered.map((product, i) => (
              <MotionDiv key={product.id} delay={0.04 + (i % 12) * 0.04}>
                <Link href="/contact"
                  className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                  aria-label={`Enquire about ${product.name}`}
                >
                  <div className="relative h-44 lg:h-52 overflow-hidden bg-gray-50">
                    <Image src={product.image} alt={product.name} fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[product.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {product.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 lg:p-5">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs text-gray-400 font-medium">{product.gsm}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400 font-medium">{product.size}</span>
                    </div>
                    <h3 className="font-display italic text-brand-navy text-lg lg:text-xl leading-snug group-hover:text-brand-orange transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No products match your filters.</p>
              <p className="text-sm mt-1">Try adjusting the filter options above.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
