"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Home } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Figma Product.pdf card description (same placeholder on every card)
const FIGMA_DESC = "Compared to other industries, paper manufacturing has significant potential to be truly sustainable.";

const allProducts = [
  { id: "kraft",      name: "Kraft",             category: "Packaging",          colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=600&q=80", href: "/digilux" },
  { id: "majestic",   name: "Majestic",           category: "Packaging",          colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&q=80", href: "/digilux" },
  { id: "tube",       name: "Tube",               category: "Packaging",          colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=600&q=80", href: "/digilux" },
  { id: "liner",      name: "Liner",              category: "Packaging",          colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", href: "/digilux" },
  { id: "corrugated", name: "Corrugated Medium",  category: "Packaging",          colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=80", href: "/digilux" },
  { id: "duplex",     name: "Duplex Board",       category: "Packaging",          colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", href: "/digilux" },
  { id: "bond",       name: "Bond Paper",         category: "Printing & Writing", colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&q=80", href: "/digilux" },
  { id: "offset",     name: "Offset Paper",       category: "Printing & Writing", colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80", href: "/digilux" },
  { id: "newsprint",  name: "Newsprint",          category: "Printing & Writing", colors: 1, description: FIGMA_DESC, image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80", href: "/digilux" },
];

const categories = ["All", "Packaging", "Printing & Writing", "School & Office", "Specialty"];
const applications = ["All Applications", "Commercial Printing", "Packaging", "Publishing", "Industrial"];
const shades = ["All Colours", "White", "Cream", "Kraft Brown", "Natural", "Metallic"];

export function ProductsCatalog() {
  const [activeCategory, setActiveCategory] = useState("Packaging");
  const [activeApplication, setActiveApplication] = useState("All Applications");
  const [activeShade, setActiveShade] = useState("All Colours");

  const filtered = allProducts.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <>
      {/* ── FILTER BAR ── Fixed to bottom of hero */}
      <div className="bg-brand-navy/95 backdrop-blur-sm border-t border-white/10">
        <div className="container-max section-padding py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 gap-4 sm:gap-0">
            <div className="sm:pr-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Application</p>
              <p className="text-sm text-white/60 mb-2 font-medium">What&apos;s your Project?</p>
              <div className="relative">
                <select value={activeApplication} onChange={(e) => setActiveApplication(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer">
                  {applications.map((a) => <option key={a} value={a} className="text-brand-navy bg-white">{a}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
            </div>
            <div className="sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Categories</p>
              <p className="text-sm text-white/60 mb-2 font-medium">What&apos;s your Category?</p>
              <div className="relative">
                <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer">
                  {categories.map((c) => <option key={c} value={c} className="text-brand-navy bg-white">{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
            </div>
            <div className="sm:pl-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Colour</p>
              <p className="text-sm text-white/60 mb-2 font-medium">What&apos;s your Shade?</p>
              <div className="relative">
                <select value={activeShade} onChange={(e) => setActiveShade(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer">
                  {shades.map((s) => <option key={s} value={s} className="text-brand-navy bg-white">{s}</option>)}
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
            <Link href="/" className="hover:text-brand-orange transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-brand-navy font-medium">Product</span>
          </nav>

          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display italic text-brand-orange" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h2>
            <p className="text-sm text-gray-400 font-medium">{filtered.length} Product</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filtered.map((product, i) => (
              <MotionDiv key={product.id} delay={0.05 + i * 0.06}>
                <Link href={product.href}
                  className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                  aria-label={`Explore ${product.name}`}
                >
                  <div className="relative h-52 lg:h-64 overflow-hidden bg-gray-100">
                    <Image src={product.image} alt={product.name} fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center text-xs font-semibold bg-white/90 text-brand-navy px-2 py-0.5 rounded-full">
                        {product.colors} colour{product.colors !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 lg:p-6">
                    <h3 className="font-display italic text-brand-navy text-2xl lg:text-3xl mb-2 group-hover:text-brand-orange transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-500 leading-relaxed mb-4">{product.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold">
                      Explore <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
