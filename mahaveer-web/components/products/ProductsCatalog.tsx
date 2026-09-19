"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Search, Layers, LayoutGrid, Palette } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { CheckboxDropdown } from "@/components/products/CheckboxDropdown";
import { catalogProducts, BOOKS, PAPER_TYPE_OPTIONS, APPLICATION_OPTIONS, COLOUR_GROUP_OPTIONS } from "@/data/products";

type DropdownKey = "type" | "app" | "color";

function BookCarousel({ label, items }: { label: string; items: typeof catalogProducts }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth : el.clientWidth * 0.32;
    // gap-8 = 32px
    el.scrollBy({ left: dir * (cardWidth + 32) * 2, behavior: "smooth" });
  };

  return (
    <div className="mb-14 lg:mb-20">
      <div className="mb-8 lg:mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-sans font-semibold" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", color: "#202020" }}>
            {label}
          </h2>
          <p className="text-gray-400 font-normal mt-1" style={{ fontSize: "clamp(1rem,1.5vw,1.25rem)" }}>
            {items.length} Product
          </p>
        </div>
        {/* desktop arrow pair when carousel overflows — matches pill in screenshot */}
        {items.length > 3 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              className={`h-10 w-10 rounded-full border bg-white flex items-center justify-center shadow-sm transition ${canLeft ? "border-gray-200 hover:bg-gray-50 text-gray-700" : "border-gray-100 text-gray-300 cursor-default"}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              className={`h-10 w-10 rounded-full border bg-white flex items-center justify-center shadow-sm transition ${canRight ? "border-gray-200 hover:bg-gray-50 text-gray-700" : "border-gray-100 text-gray-300 cursor-default"}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative group/row">
        {/* edge pill arrows — pointer-events-none container so wheel/vertical scroll passes through; buttons themselves re-enable pointer */}
        {canRight && (
          <div className="absolute right-0 top-[44%] -translate-y-1/2 translate-x-1/2 z-10 hidden lg:flex pointer-events-none">
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(1)}
              className="pointer-events-auto flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-[72px] h-[52px] hover:bg-gray-50 transition"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" strokeWidth={1.75} />
            </button>
          </div>
        )}
        {canLeft && (
          <div className="absolute left-0 top-[44%] -translate-y-1/2 -translate-x-1/2 z-10 hidden lg:flex pointer-events-none">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              className="pointer-events-auto flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-[72px] h-[52px] hover:bg-gray-50 transition"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" strokeWidth={1.75} />
            </button>
          </div>
        )}

        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-2 -mx-1 px-1 overscroll-x-contain touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onWheel={(e) => {
            // Allow vertical wheel to still scroll the page when over the carousel.
            // Without this, wheel events get consumed by the horizontal scroller and page scroll feels stuck.
            const el = scrollerRef.current;
            if (!el) return;
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              // vertical wheel: let page scroll — prevent this scroller from capturing it
              // by manually scrolling the page and not preventing default horizontally
              return;
            }
          }}
        >
          {items.map((product, i) => (
            <div
              key={product.id}
              className="flex-shrink-0 snap-start basis-[88%] sm:basis-[calc((100%-32px)/2)] lg:basis-[calc((100%-64px)/3)] min-w-0"
              onClick={() => sessionStorage.setItem("mp-catalog-scroll", String(window.scrollY))}
            >
              <ProductCard product={product} delay={0.04 + (i % 6) * 0.06} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── /products — the default catalogue BROWSE page ──────────────────────────
// Always shows every product, grouped into the curated per-Book carousels
// (unchanged from the original design). The pill bar at the top lets a
// visitor stage a Paper Type / Application / Colour selection, but this page
// itself never filters in place — hitting the search button hands the
// selection off to /products/search, a dedicated results page built for
// scanning a filtered list (flat grid, live re-filtering, Book tags). See
// ProductsSearchResults.tsx.
export function ProductsCatalog() {
  const router = useRouter();

  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedApps, setAppliedApps] = useState<string[]>([]);
  const [appliedColors, setAppliedColors] = useState<string[]>([]);

  const [pendingTypes, setPendingTypes] = useState<string[]>([]);
  const [pendingApps, setPendingApps] = useState<string[]>([]);
  const [pendingColors, setPendingColors] = useState<string[]>([]);

  const [openKey, setOpenKey] = useState<DropdownKey | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(key: DropdownKey) {
    if (openKey === key) { setOpenKey(null); return; }
    if (key === "type") setPendingTypes([...appliedTypes]);
    if (key === "app") setPendingApps([...appliedApps]);
    if (key === "color") setPendingColors([...appliedColors]);
    setOpenKey(key);
  }

  function apply(key: DropdownKey) {
    if (key === "type") setAppliedTypes([...pendingTypes]);
    if (key === "app") setAppliedApps([...pendingApps]);
    if (key === "color") setAppliedColors([...pendingColors]);
    setOpenKey(null);
  }

  // The orange search button: commit whichever dropdown is still open, then
  // hand the whole selection off to the dedicated results page.
  function goSearch() {
    const types = openKey === "type" ? pendingTypes : appliedTypes;
    const apps = openKey === "app" ? pendingApps : appliedApps;
    const colors = openKey === "color" ? pendingColors : appliedColors;
    setOpenKey(null);
    if (types.length === 0 && apps.length === 0 && colors.length === 0) return;
    const p = new URLSearchParams();
    if (types.length) p.set("paperType", types.join(","));
    if (apps.length) p.set("application", apps.join(","));
    if (colors.length) p.set("colour", colors.join(","));
    router.push(`/products/search?${p.toString()}`);
  }

  function pillLabel(applied: string[], placeholder: string) {
    if (applied.length === 0) return placeholder;
    if (applied.length === 1) return applied[0];
    return `${applied.length} selected`;
  }

  function sectionBtn(key: DropdownKey, extraRadius = "") {
    if (!openKey) return `hover:bg-gray-50 ${extraRadius}`;
    if (openKey === key) return `bg-white shadow-sm ${extraRadius}`;
    return extraRadius;
  }

  const grouped = BOOKS.map(book => ({
    label: book,
    items: catalogProducts.filter(p => p.book === book),
  })).filter(g => g.items.length > 0);

  return (
    <>
      {/* ── PILL FILTER BAR ── pulled up over the hero photo (negative margin) as a
          translucent glass bar, blended into the image instead of its own solid band.
          The tint fades to fully transparent by the end so it never leaves a hard-edged
          band once it clears the photo — it just dissolves into the white catalog
          section that follows. */}
      <div className="relative z-20 -mt-40 lg:-mt-52 bg-gradient-to-b from-black/0 via-black/30 to-transparent pt-20 pb-6 lg:pt-28 lg:pb-8">
        <div className="container-max section-padding">
          <div
            ref={pillRef}
            className={`relative flex items-stretch rounded-full shadow-2xl ring-1 ring-black/[0.04] transition-colors duration-200 ${openKey ? "bg-[#e8e8e8]" : "bg-white"}`}
          >
            {/* Paper Type */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle("type")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("type", "rounded-l-full")}`}
              >
                <p className="flex items-center gap-1.5 font-semibold text-brand-navy text-[15px] leading-tight">
                  <Layers className="h-3.5 w-3.5 text-brand-orange" strokeWidth={2} />
                  Paper Type
                </p>
                <p className="text-gray-400 text-[13px] mt-1 truncate">
                  {pillLabel(appliedTypes, "Eco, Metallic, Textured…")}
                </p>
              </button>
              {openKey === "type" && (
                <CheckboxDropdown
                  options={PAPER_TYPE_OPTIONS}
                  pending={pendingTypes}
                  setPending={setPendingTypes}
                  showClear={true}
                  onApply={() => apply("type")}
                />
              )}
            </div>

            <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

            {/* Application */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle("app")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("app", "rounded-2xl")}`}
              >
                <p className="flex items-center gap-1.5 font-semibold text-brand-navy text-[15px] leading-tight">
                  <LayoutGrid className="h-3.5 w-3.5 text-brand-orange" strokeWidth={2} />
                  Application
                </p>
                <p className="text-gray-400 text-[13px] mt-1 truncate">
                  {pillLabel(appliedApps, "Select an application")}
                </p>
              </button>
              {openKey === "app" && (
                <CheckboxDropdown
                  options={APPLICATION_OPTIONS}
                  pending={pendingApps}
                  setPending={setPendingApps}
                  showClear={true}
                  onApply={() => apply("app")}
                />
              )}
            </div>

            <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

            {/* Colour */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle("color")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("color", "rounded-2xl")}`}
              >
                <p className="flex items-center gap-1.5 font-semibold text-brand-navy text-[15px] leading-tight">
                  <Palette className="h-3.5 w-3.5 text-brand-orange" strokeWidth={2} />
                  Colour
                </p>
                <p className="text-gray-400 text-[13px] mt-1 truncate">
                  {pillLabel(appliedColors, "White, Black, Gold…")}
                </p>
              </button>
              {openKey === "color" && (
                <CheckboxDropdown
                  options={COLOUR_GROUP_OPTIONS}
                  pending={pendingColors}
                  setPending={setPendingColors}
                  showClear={true}
                  onApply={() => apply("color")}
                />
              )}
            </div>

            {/* Search — stages whichever dropdown is open, then opens the dedicated
                filtered-results page (/products/search) with the selection. */}
            <div className="flex items-center px-2 flex-shrink-0">
              <button
                type="button"
                aria-label="Search with these filters"
                onClick={goSearch}
                className="bg-brand-orange hover:bg-[#d06a18] active:bg-[#b85e14] transition-all hover:scale-105 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-[0_4px_14px_rgba(232,121,28,0.35)]"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATALOG ── */}
      <div className="bg-white py-8 lg:py-12 px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-400 mb-10 text-[15px]">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <span className="text-gray-300">&gt;</span>
          <span className="font-medium" style={{ color: "#202020" }}>Product</span>
        </nav>

        {grouped.map(group => (
          <BookCarousel key={group.label} label={group.label} items={group.items} />
        ))}
        <p className="text-center text-[11px] leading-relaxed text-neutral-400 mt-6 max-w-3xl mx-auto">
          <span className="font-medium text-neutral-500 not-italic">Please Note:</span>{" "}
          <span className="italic">Images are indicative. Actual paper colour, texture, and finish may vary slightly due to screen display and photography.</span>
        </p>
      </div>
    </>
  );
}
