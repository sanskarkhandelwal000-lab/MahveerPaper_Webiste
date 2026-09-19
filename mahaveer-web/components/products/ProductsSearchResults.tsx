"use client";

import Link from "next/link";
import { Suspense, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ArrowLeft, Search, Layers, LayoutGrid, Palette, X } from "lucide-react";
import { SwatchResultCard } from "@/components/products/SwatchResultCard";
import { CheckboxDropdown } from "@/components/products/CheckboxDropdown";
import {
  catalogProducts,
  isFscCertified,
  isBiodegradable,
  isRecyclable,
  BOOKS,
  PAPER_TYPE_OPTIONS,
  APPLICATION_OPTIONS,
  COLOUR_GROUP_OPTIONS,
} from "@/data/products";
import { getProductSwatches } from "@/lib/productSwatches";

type DropdownKey = "type" | "app" | "color";

function parseCsv(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").map(s => s.trim()).filter(Boolean);
}
function toCsv(values: string[]): string | null {
  if (values.length === 0) return null;
  return values.join(",");
}

// ── /products/search — the dedicated FILTERED RESULTS page ─────────────────
// Reached by applying any of the three pill-bar filters on the /products
// browse page (or from a direct link, e.g. "FSC Certified" on the
// Sustainability page, or a Book link from a product's breadcrumb). Unlike
// the browse page's curated per-Book carousels, this page shows every
// matching product individually in one flat, scannable grid — with a Book
// tag on each card and a row of Book tabs above the grid — and re-filters
// live as soon as a selection changes, since the whole point of this page
// is "search, then see the whole result set."
function ProductsSearchResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [appliedTypes, setAppliedTypes] = useState<string[]>(() => parseCsv(searchParams.get("paperType")));
  const [appliedApps, setAppliedApps] = useState<string[]>(() => parseCsv(searchParams.get("application")));
  const [appliedColors, setAppliedColors] = useState<string[]>(() => parseCsv(searchParams.get("colour")));

  const [fscOnly, setFscOnly] = useState(() => searchParams.get("fsc") === "1");
  const [brandOnly, setBrandOnly] = useState(() => searchParams.get("brand") === "favini");
  const [biodegradableOnly, setBiodegradableOnly] = useState(() => searchParams.get("biodegradable") === "1");
  const [recyclableOnly, setRecyclableOnly] = useState(() => searchParams.get("recyclable") === "1");

  const [activeBook, setActiveBook] = useState<string | null>(() => searchParams.get("book"));

  const [pendingTypes, setPendingTypes] = useState<string[]>([]);
  const [pendingApps, setPendingApps] = useState<string[]>([]);
  const [pendingColors, setPendingColors] = useState<string[]>([]);

  const [openKey, setOpenKey] = useState<DropdownKey | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const suppressUrlSyncRef = useRef(true);

  // Build the query string that represents the current results-page state —
  // used both to keep the URL shareable and as the "from" link every
  // ProductCard hands to the product page's Back to Results button.
  const buildResultsQuery = useCallback(() => {
    const p = new URLSearchParams();
    const pt = toCsv(appliedTypes);
    const app = toCsv(appliedApps);
    const col = toCsv(appliedColors);
    if (pt) p.set("paperType", pt);
    if (app) p.set("application", app);
    if (col) p.set("colour", col);
    if (fscOnly) p.set("fsc", "1");
    if (brandOnly) p.set("brand", "favini");
    if (biodegradableOnly) p.set("biodegradable", "1");
    if (recyclableOnly) p.set("recyclable", "1");
    if (activeBook) p.set("book", activeBook);
    return p.toString();
  }, [appliedTypes, appliedApps, appliedColors, fscOnly, brandOnly, biodegradableOnly, recyclableOnly, activeBook]);

  // Hydrate from URL on mount / back-forward navigation. This intentionally sets
  // state from an effect: `searchParams` changes on browser back/forward and on
  // external links (Sustainability page, PDP breadcrumb) that this component
  // doesn't control, so local filter state has to be re-derived from it. The
  // suppressUrlSyncRef guard below stops that from feeding back into the
  // URL-sync effect and creating a loop.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    suppressUrlSyncRef.current = true;
    setAppliedTypes(parseCsv(searchParams.get("paperType")));
    setAppliedApps(parseCsv(searchParams.get("application")));
    setAppliedColors(parseCsv(searchParams.get("colour")));
    setFscOnly(searchParams.get("fsc") === "1");
    setBrandOnly(searchParams.get("brand") === "favini");
    setBiodegradableOnly(searchParams.get("biodegradable") === "1");
    setRecyclableOnly(searchParams.get("recyclable") === "1");
    setActiveBook(searchParams.get("book"));
    queueMicrotask(() => { suppressUrlSyncRef.current = false; });
  }, [searchParams]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Push state to URL (replace, no history spam) so the view stays shareable
  useEffect(() => {
    if (suppressUrlSyncRef.current) return;
    const qs = buildResultsQuery();
    const url = qs ? `${pathname}?${qs}` : pathname;
    const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (url !== current) router.replace(url, { scroll: false });
  }, [buildResultsQuery, pathname, router, searchParams]);

  // Persist scroll position for return navigation (same key ProductCard writes on click)
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

  const resultsQueryString = useMemo(() => buildResultsQuery(), [buildResultsQuery]);

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

  // Applying a dropdown re-filters the grid immediately — this page's whole
  // purpose is showing the result set live as filters change.
  function apply(key: DropdownKey) {
    if (key === "type") setAppliedTypes([...pendingTypes]);
    if (key === "app") setAppliedApps([...pendingApps]);
    if (key === "color") setAppliedColors([...pendingColors]);
    setOpenKey(null);
  }

  // Products matching the three pill-bar filters + the link-driven toggles,
  // BEFORE the Book tab narrows it further — this is what the tab counts are
  // computed from, so "Spectrum (12)" always reflects the rest of the filter.
  const baseFiltered = useMemo(() => catalogProducts.filter(p => {
    const matchType = appliedTypes.length === 0 || (p.paperTypes ?? []).some(t => appliedTypes.includes(t));
    const matchApp = appliedApps.length === 0 || (p.applications ?? []).some(a => appliedApps.includes(a));
    const matchColor = appliedColors.length === 0 || (p.colourGroups ?? []).some(c => appliedColors.includes(c));
    const matchFsc = !fscOnly || isFscCertified(p);
    const matchBrand = !brandOnly || p.isFavini;
    const matchBio = !biodegradableOnly || isBiodegradable(p);
    const matchRec = !recyclableOnly || isRecyclable(p);
    return matchType && matchApp && matchColor && matchFsc && matchBrand && matchBio && matchRec;
  }), [appliedTypes, appliedApps, appliedColors, fscOnly, brandOnly, biodegradableOnly, recyclableOnly]);

  // Expand each matching family into one entry per real product — a colour, a
  // GSM group, whatever the family's own colorNames represent (see
  // getProductSwatches) — since "the actual products" is what a customer
  // should see here, not an aggregate family tile with a "12 colours" badge.
  const allItems = useMemo(
    () => baseFiltered.flatMap(product => getProductSwatches(product).map(swatch => ({ product, swatch }))),
    [baseFiltered]
  );

  const bookTabs = useMemo(() => BOOKS
    .map(book => ({ book, count: allItems.filter(it => it.product.book === book).length }))
    .filter(t => t.count > 0), [allItems]);

  const activeBookValid = activeBook && bookTabs.some(t => t.book === activeBook) ? activeBook : null;
  const results = activeBookValid ? allItems.filter(it => it.product.book === activeBookValid) : allItems;

  const hasActiveFilters = appliedTypes.length > 0 || appliedApps.length > 0 || appliedColors.length > 0 || fscOnly || brandOnly || biodegradableOnly || recyclableOnly || !!activeBookValid;

  function clearAll() {
    setAppliedTypes([]); setAppliedApps([]); setAppliedColors([]);
    setPendingTypes([]); setPendingApps([]); setPendingColors([]);
    setFscOnly(false); setBrandOnly(false); setBiodegradableOnly(false); setRecyclableOnly(false);
    setActiveBook(null);
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

  return (
    <div className="bg-white">
      <div className="container-max section-padding pb-8 lg:pb-12">
        {/* Breadcrumb + back to the curated browse page */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-400 mb-6 text-[15px] flex-wrap">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <span className="text-gray-300">&gt;</span>
          <Link href="/products" className="hover:text-brand-orange transition-colors">Products</Link>
          <span className="text-gray-300">&gt;</span>
          <span className="font-medium" style={{ color: "#202020" }}>Search Results</span>
        </nav>

        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-sans font-semibold" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", color: "#202020" }}>
              Search Results
            </h1>
            <p className="text-gray-400 font-normal mt-1" style={{ fontSize: "clamp(1rem,1.5vw,1.25rem)" }}>
              {results.length} {results.length === 1 ? "Product" : "Products"} found
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 pl-2 pr-4 py-2 text-sm font-medium text-brand-navy shadow-sm hover:border-brand-orange/40 hover:text-brand-orange hover:shadow-md transition-all"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            Back to Browse
          </Link>
        </div>

        {/* ── PILL FILTER BAR — same look as the browse page, but every Apply
            re-filters this page's grid live instead of navigating away. ── */}
        <div
          ref={pillRef}
          className={`relative flex items-stretch rounded-full shadow-lg ring-1 ring-black/[0.04] transition-colors duration-200 mb-5 ${openKey ? "bg-[#e8e8e8]" : "bg-gray-50"}`}
        >
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
              <CheckboxDropdown options={PAPER_TYPE_OPTIONS} pending={pendingTypes} setPending={setPendingTypes} showClear onApply={() => apply("type")} />
            )}
          </div>

          <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => toggle("app")}
              className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("app")}`}
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
              <CheckboxDropdown options={APPLICATION_OPTIONS} pending={pendingApps} setPending={setPendingApps} showClear onApply={() => apply("app")} />
            )}
          </div>

          <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => toggle("color")}
              className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("color", "rounded-r-full")}`}
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
              <CheckboxDropdown options={COLOUR_GROUP_OPTIONS} pending={pendingColors} setPending={setPendingColors} showClear onApply={() => apply("color")} />
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {fscOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                FSC Certified
                <button type="button" onClick={() => setFscOnly(false)} aria-label="Remove FSC Certified filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors"><X className="h-3 w-3" /></button>
              </span>
            )}
            {brandOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                Favini
                <button type="button" onClick={() => setBrandOnly(false)} aria-label="Remove Favini filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors"><X className="h-3 w-3" /></button>
              </span>
            )}
            {biodegradableOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                Biodegradable
                <button type="button" onClick={() => setBiodegradableOnly(false)} aria-label="Remove Biodegradable filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors"><X className="h-3 w-3" /></button>
              </span>
            )}
            {recyclableOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-3 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                Recyclable
                <button type="button" onClick={() => setRecyclableOnly(false)} aria-label="Remove Recyclable filter" className="ml-1 h-6 w-6 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-[#d06a18] transition-colors"><X className="h-3 w-3" /></button>
              </span>
            )}
            {activeBookValid && (
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-1.5 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                <span className="text-[10px] font-bold tracking-wide text-white uppercase bg-brand-navy rounded-full px-2 py-0.5">Book</span>{activeBookValid}
                <button type="button" onClick={() => setActiveBook(null)} aria-label={`Remove ${activeBookValid} filter`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors"><X className="h-3 w-3" /></button>
              </span>
            )}
            {appliedTypes.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-1.5 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                <span className="text-[10px] font-bold tracking-wide text-white uppercase bg-brand-orange rounded-full px-2 py-0.5">Type</span>{tag}
                <button type="button" onClick={() => setAppliedTypes(v => v.filter(x => x !== tag))} aria-label={`Remove ${tag}`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors"><X className="h-3 w-3" /></button>
              </span>
            ))}
            {appliedApps.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-1.5 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                <span className="text-[10px] font-bold tracking-wide text-white uppercase bg-brand-orange rounded-full px-2 py-0.5">App</span>{tag}
                <button type="button" onClick={() => setAppliedApps(v => v.filter(x => x !== tag))} aria-label={`Remove ${tag}`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors"><X className="h-3 w-3" /></button>
              </span>
            ))}
            {appliedColors.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-white text-brand-navy text-xs font-medium pl-1.5 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                <span className="text-[10px] font-bold tracking-wide text-white uppercase bg-brand-orange rounded-full px-2 py-0.5">Colour</span>{tag}
                <button type="button" onClick={() => setAppliedColors(v => v.filter(x => x !== tag))} aria-label={`Remove ${tag}`} className="ml-1 h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button type="button" onClick={clearAll} className="bg-white text-brand-navy border border-gray-200 text-xs font-semibold px-3.5 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors ml-1">Clear all</button>
            <button type="button" onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="bg-brand-orange text-white text-xs font-semibold px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(232,121,28,0.35)] hover:bg-[#d06a18] transition-colors inline-flex items-center gap-1.5">
              Copy link
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Book tabs — quick categorisation across whatever the pill-bar filters left */}
        {bookTabs.length > 1 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <button
              type="button"
              onClick={() => setActiveBook(null)}
              className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full transition-colors ${!activeBookValid ? "bg-brand-navy text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              All ({allItems.length})
            </button>
            {bookTabs.map(({ book, count }) => (
              <button
                key={book}
                type="button"
                onClick={() => setActiveBook(book)}
                className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap ${activeBookValid === book ? "bg-brand-navy text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {book} ({count})
              </button>
            ))}
          </div>
        )}

        {/* ── FLAT RESULTS GRID — every matching product shown individually,
            each tagged with its Book, instead of grouped into carousels. ── */}
        {results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-base font-medium">No products match your filters.</p>
            <p className="text-sm mt-1">Try clearing one of the filters above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {results.map(({ product, swatch }, i) => (
              <SwatchResultCard
                key={`${product.id}-${swatch.name}`}
                product={product}
                swatch={swatch}
                delay={0.03 + (i % 8) * 0.04}
                backHref={`/products/search?${resultsQueryString}`}
              />
            ))}
          </div>
        )}

        <p className="text-center text-[11px] leading-relaxed text-neutral-400 mt-12 max-w-3xl mx-auto">
          <span className="font-medium text-neutral-500 not-italic">Please Note:</span>{" "}
          <span className="italic">Images are indicative. Actual paper colour, texture, and finish may vary slightly due to screen display and photography.</span>
        </p>
      </div>
    </div>
  );
}

export function ProductsSearchResults() {
  return (
    <Suspense>
      <ProductsSearchResultsInner />
    </Suspense>
  );
}
