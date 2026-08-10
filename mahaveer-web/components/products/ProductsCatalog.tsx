"use client";

import Link from "next/link";
import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { catalogProducts, isFscCertified, BOOKS, PAPER_TYPE_OPTIONS, APPLICATION_OPTIONS, COLOUR_GROUP_OPTIONS } from "@/data/products";

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

function ProductsCatalogInner() {
  const searchParams = useSearchParams();
  const [fscOnly, setFscOnly] = useState(() => searchParams.get("fsc") === "1");

  const [appliedTypes,  setAppliedTypes]  = useState<string[]>([]);
  const [appliedApps,   setAppliedApps]   = useState<string[]>([]);
  const [appliedColors, setAppliedColors] = useState<string[]>([]);

  const [pendingTypes,  setPendingTypes]  = useState<string[]>([]);
  const [pendingApps,   setPendingApps]   = useState<string[]>([]);
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

  const filtered = catalogProducts.filter(p => {
    const matchType  = appliedTypes.length  === 0 || (p.paperTypes ?? []).some(t => appliedTypes.includes(t));
    const matchApp   = appliedApps.length   === 0 || (p.applications ?? []).some(a => appliedApps.includes(a));
    const matchColor = appliedColors.length === 0 || (p.colourGroups ?? []).some(c => appliedColors.includes(c));
    const matchFsc   = !fscOnly || isFscCertified(p);
    return matchType && matchApp && matchColor && matchFsc;
  });

  const grouped = BOOKS.map(book => ({
    label: book,
    items: filtered.filter(p => p.book === book),
  })).filter(g => g.items.length > 0);

  const hasActiveFilters = appliedTypes.length > 0 || appliedApps.length > 0 || appliedColors.length > 0 || fscOnly;

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
                  {pillLabel(appliedApps, "What's your end use?")}
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

            {/* Search button — applies all pending selections */}
            <div className="flex items-center px-2 flex-shrink-0">
              <button
                type="button"
                aria-label="Apply filters"
                onClick={applyAll}
                className="bg-brand-orange hover:bg-orange-600 transition-colors text-white rounded-full w-12 h-12 flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {fscOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  FSC Certified
                  <button
                    type="button"
                    onClick={() => setFscOnly(false)}
                    aria-label="Remove FSC Certified filter"
                    className="hover:text-brand-orange"
                  >
                    ×
                  </button>
                </span>
              )}
              {[...appliedTypes, ...appliedApps, ...appliedColors].map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAppliedTypes([]); setAppliedApps([]); setAppliedColors([]);
                  setPendingTypes([]); setPendingApps([]); setPendingColors([]);
                  setFscOnly(false);
                }}
                className="text-brand-orange text-xs font-semibold hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CATALOG ── */}
      <div className="bg-white py-10 lg:py-16 px-9">
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
          <div key={group.label} className="mb-14 lg:mb-20">
            <div className="mb-8 lg:mb-10">
              <h2 className="font-sans font-semibold" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", color: "#202020" }}>
                {group.label}
              </h2>
              <p className="text-gray-400 font-normal mt-1" style={{ fontSize: "clamp(1rem,1.5vw,1.25rem)" }}>
                {group.items.length} Product
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {group.items.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={0.04 + (i % 6) * 0.06} />
              ))}
            </div>
          </div>
        ))}
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
