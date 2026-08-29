"use client";

import Link from "next/link";
import { Suspense, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { catalogProducts, isFscCertified, isBiodegradable, isRecyclable, BOOKS, PAPER_TYPE_OPTIONS, APPLICATION_OPTIONS, COLOUR_GROUP_OPTIONS } from "@/data/products";

type DropdownKey = "type" | "app" | "color";

// Defined outside the component so React never treats this as a new type on re-render
function CheckboxDropdown({
  options,
  pending,
  setPending,
  showClear,
  onApply,
}: {
  options: readonly string[];
  pending: string[];
  setPending: (v: string[]) => void;
  showClear: boolean;
  onApply: () => void;
}) {
  return (
    <div className="absolute top-[calc(100%+12px)] left-0 min-w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="py-2 max-h-72 overflow-y-auto">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={pending.includes(opt)}
              onChange={() =>
                setPending(pending.includes(opt) ? pending.filter(x => x !== opt) : [...pending, opt])
              }
              className="h-4 w-4 rounded border-gray-300 accent-brand-orange cursor-pointer"
            />
            <span className="text-sm text-brand-navy select-none">{opt}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        {showClear ? (
          <button
            type="button"
            onClick={() => setPending([])}
            className="text-brand-orange text-sm font-medium hover:underline"
          >
            Clear all
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold rounded-full pl-4 pr-1 py-1 hover:bg-[#0d1b2a] transition-colors"
        >
          Apply
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </div>
  );
}

function BookCarousel({ label, items, catalogQuery }: { label: string; items: typeof catalogProducts; catalogQuery: string }) {
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
              <ProductCard product={product} delay={0.04 + (i % 6) * 0.06} catalogQuery={catalogQuery} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function parseCsv(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").map(s => s.trim()).filter(Boolean);
}
function toCsv(values: string[]): string | null {
  if (values.length === 0) return null;
  return values.join(",");
}

function ProductsCatalogInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") ?? "");

  const [fscOnly, setFscOnly] = useState(() => searchParams.get("fsc") === "1");
  const [brandOnly, setBrandOnly] = useState(() => searchParams.get("brand") === "favini");
  const [biodegradableOnly, setBiodegradableOnly] = useState(() => searchParams.get("biodegradable") === "1");
  const [recyclableOnly, setRecyclableOnly] = useState(() => searchParams.get("recyclable") === "1");

  const [appliedTypes,  setAppliedTypes]  = useState<string[]>(() => parseCsv(searchParams.get("paperType")));
  const [appliedApps,   setAppliedApps]   = useState<string[]>(() => parseCsv(searchParams.get("application")));
  const [appliedColors, setAppliedColors] = useState<string[]>(() => parseCsv(searchParams.get("colour")));

  const [pendingTypes,  setPendingTypes]  = useState<string[]>([]);
  const [pendingApps,   setPendingApps]   = useState<string[]>([]);
  const [pendingColors, setPendingColors] = useState<string[]>([]);

  const [openKey, setOpenKey] = useState<DropdownKey | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const suppressUrlSyncRef = useRef(true);

  // Build the query string that represents current catalogue state (theme: brand navy + orange accent preserved)
  const buildCatalogQuery = useCallback(() => {
    const p = new URLSearchParams();
    const pt = toCsv(appliedTypes);
    const app = toCsv(appliedApps);
    const col = toCsv(appliedColors);
    if (pt) p.set("paperType", pt);
    if (app) p.set("application", app);
    if (col) p.set("colour", col);
    if (searchQuery.trim()) p.set("search", searchQuery.trim());
    if (fscOnly) p.set("fsc", "1");
    if (brandOnly) p.set("brand", "favini");
    if (biodegradableOnly) p.set("biodegradable", "1");
    if (recyclableOnly) p.set("recyclable", "1");
    return p.toString();
  }, [appliedTypes, appliedApps, appliedColors, searchQuery, fscOnly, brandOnly, biodegradableOnly, recyclableOnly]);

  // Hydrate from URL on mount / back-forward navigation (P0: shareability + state memory)
  useEffect(() => {
    suppressUrlSyncRef.current = true;
    setAppliedTypes(parseCsv(searchParams.get("paperType")));
    setAppliedApps(parseCsv(searchParams.get("application")));
    setAppliedColors(parseCsv(searchParams.get("colour")));
    setSearchQuery(searchParams.get("search") ?? "");
    setSearchInput(searchParams.get("search") ?? "");
    setFscOnly(searchParams.get("fsc") === "1");
    setBrandOnly(searchParams.get("brand") === "favini");
    setBiodegradableOnly(searchParams.get("biodegradable") === "1");
    setRecyclableOnly(searchParams.get("recyclable") === "1");
    // allow next sync to push
    queueMicrotask(() => { suppressUrlSyncRef.current = false; });
  }, [searchParams]);

  // Push state to URL (replace, no history spam) — P0 URL state
  useEffect(() => {
    if (suppressUrlSyncRef.current) return;
    const qs = buildCatalogQuery();
    const url = qs ? `${pathname}?${qs}` : pathname;
    const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (url !== current) router.replace(url, { scroll: false });
  }, [buildCatalogQuery, pathname, router, searchParams]);

  // Persist scroll position for return navigation
  useEffect(() => {
    const key = "mp-catalog-scroll";
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const y = parseInt(saved, 10);
      if (!isNaN(y) && y > 0) window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      sessionStorage.removeItem(key);
    }
    const onBeforeUnload = () => sessionStorage.setItem(key, String(window.scrollY));
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const catalogQueryString = useMemo(() => buildCatalogQuery(), [buildCatalogQuery]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(key: DropdownKey) {
    if (openKey === key) { setOpenKey(null); return; }
    if (key === "type")  setPendingTypes([...appliedTypes]);
    if (key === "app")   setPendingApps([...appliedApps]);
    if (key === "color") setPendingColors([...appliedColors]);
    setOpenKey(key);
  }

  function apply(key: DropdownKey) {
    if (key === "type")  setAppliedTypes([...pendingTypes]);
    if (key === "app")   setAppliedApps([...pendingApps]);
    if (key === "color") setAppliedColors([...pendingColors]);
    setOpenKey(null);
  }

  function applyAll() {
    setAppliedTypes([...pendingTypes]);
    setAppliedApps([...pendingApps]);
    setAppliedColors([...pendingColors]);
    setOpenKey(null);
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = catalogProducts.filter(p => {
    const matchType  = appliedTypes.length  === 0 || (p.paperTypes ?? []).some(t => appliedTypes.includes(t));
    const matchApp   = appliedApps.length   === 0 || (p.applications ?? []).some(a => appliedApps.includes(a));
    const matchColor = appliedColors.length === 0 || (p.colourGroups ?? []).some(c => appliedColors.includes(c));
    const matchFsc   = !fscOnly || isFscCertified(p);
    const matchBrand = !brandOnly || p.isFavini;
    const matchBio   = !biodegradableOnly || isBiodegradable(p);
    const matchRec   = !recyclableOnly || isRecyclable(p);
    const hay = `${p.name} ${p.description} ${p.brand ?? ""} ${p.paperTypes?.join(" ") ?? ""} ${(p.colourGroups ?? []).join(" ")} ${p.book}`.toLowerCase();
    const matchSearch = !normalizedSearch || hay.includes(normalizedSearch);
    return matchType && matchApp && matchColor && matchFsc && matchBrand && matchBio && matchRec && matchSearch;
  });

  const grouped = BOOKS.map(book => ({
    label: book,
    items: filtered.filter(p => p.book === book),
  })).filter(g => g.items.length > 0);

  const hasActiveFilters = appliedTypes.length > 0 || appliedApps.length > 0 || appliedColors.length > 0 || fscOnly || brandOnly || biodegradableOnly || recyclableOnly || !!normalizedSearch;

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
            className={`relative flex items-stretch rounded-full shadow-2xl transition-colors duration-200 ${openKey ? "bg-[#e8e8e8]" : "bg-white"}`}
          >
            {/* Paper Type */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle("type")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("type", "rounded-l-full")}`}
              >
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Paper Type</p>
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
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Application</p>
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
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Colour</p>
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

            {/* Apply button — brand orange pill (search removed per request) */}
            <div className="flex items-center px-2 flex-shrink-0">
              <button
                type="button"
                aria-label="Apply filters"
                onClick={() => applyAll()}
                className="bg-brand-orange hover:bg-[#d06a18] active:bg-[#b85e14] transition-colors text-white rounded-full w-12 h-12 flex items-center justify-center shadow-[0_4px_14px_rgba(232,121,28,0.35)]"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active filter chips + Copy link — theme: white glass pills + orange accent + navy hover */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {normalizedSearch && (
                <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  <Search className="h-3 w-3 text-brand-orange" />
                  “{normalizedSearch}”
                  <button type="button" onClick={() => { setSearchInput(""); setSearchQuery(""); }} aria-label="Clear search" className="ml-1 h-6 w-6 rounded-full bg-brand-navy text-white flex items-center justify-center hover:bg-black transition-colors">×</button>
                </span>
              )}
              {fscOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  FSC Certified
                  <button type="button" onClick={() => setFscOnly(false)} aria-label="Remove FSC Certified filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors">×</button>
                </span>
              )}
              {brandOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  Favini
                  <button type="button" onClick={() => setBrandOnly(false)} aria-label="Remove Favini filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors">×</button>
                </span>
              )}
              {biodegradableOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  Biodegradable
                  <button type="button" onClick={() => setBiodegradableOnly(false)} aria-label="Remove Biodegradable filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors">×</button>
                </span>
              )}
              {recyclableOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  Recyclable
                  <button type="button" onClick={() => setRecyclableOnly(false)} aria-label="Remove Recyclable filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors">×</button>
                </span>
              )}
              {appliedTypes.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  <span className="text-[10px] font-bold tracking-wide text-brand-orange uppercase">Type</span>{tag}
                  <button type="button" onClick={() => setAppliedTypes(v => v.filter(x => x !== tag))} aria-label={`Remove ${tag}`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors">×</button>
                </span>
              ))}
              {appliedApps.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  <span className="text-[10px] font-bold tracking-wide text-brand-orange uppercase">App</span>{tag}
                  <button type="button" onClick={() => setAppliedApps(v => v.filter(x => x !== tag))} aria-label={`Remove ${tag}`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors">×</button>
                </span>
              ))}
              {appliedColors.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full border border-white shadow-sm">
                  <span className="text-[10px] font-bold tracking-wide text-brand-orange uppercase">Colour</span>{tag}
                  <button type="button" onClick={() => setAppliedColors(v => v.filter(x => x !== tag))} aria-label={`Remove ${tag}`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors">×</button>
                </span>
              ))}
              <button type="button" onClick={() => { setAppliedTypes([]); setAppliedApps([]); setAppliedColors([]); setPendingTypes([]); setPendingApps([]); setPendingColors([]); setFscOnly(false); setBrandOnly(false); setBiodegradableOnly(false); setRecyclableOnly(false); setSearchInput(""); setSearchQuery(""); }} className="bg-white/15 backdrop-blur text-white border border-white/20 text-xs font-semibold px-3 py-2 rounded-full hover:bg-white hover:text-brand-navy hover:border-white transition-colors ml-1">Clear all</button>
              <button type="button" onClick={() => { const url = window.location.href; navigator.clipboard.writeText(url); }} className="bg-brand-orange text-white text-xs font-semibold px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(232,121,28,0.35)] hover:bg-[#d06a18] transition-colors inline-flex items-center gap-1.5">
                Copy link
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CATALOG ── */}
      <div className="bg-white py-8 lg:py-12 px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-400 mb-10 text-[15px]">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <span className="text-gray-300">&gt;</span>
          <span className="font-medium" style={{ color: "#202020" }}>Product</span>
        </nav>

        {grouped.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-base font-medium">No products match your filters.</p>
            <p className="text-sm mt-1">Try adjusting the selection above.</p>
          </div>
        )}

        {grouped.map(group => (
          <BookCarousel key={group.label} label={group.label} items={group.items} catalogQuery={catalogQueryString} />
        ))}
        <p className="text-center text-[11px] leading-relaxed text-neutral-400 mt-6 max-w-3xl mx-auto">
          <span className="font-medium text-neutral-500 not-italic">Please Note:</span>{" "}
          <span className="italic">Images are indicative. Actual paper colour, texture, and finish may vary slightly due to screen display and photography.</span>
        </p>
      </div>
    </>
  );
}

export function ProductsCatalog() {
  return (
    <Suspense>
      <ProductsCatalogInner />
    </Suspense>
  );
}
