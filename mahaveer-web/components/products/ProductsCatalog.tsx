"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Search } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { catalogProducts, BOOKS, PRODUCT_TYPES, APP_TYPES } from "@/data/products";

type DropdownKey = "book" | "type" | "app";

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

export function ProductsCatalog() {
  const [appliedBooks, setAppliedBooks] = useState<string[]>([]);
  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedApps,  setAppliedApps]  = useState<string[]>([]);

  const [pendingBooks, setPendingBooks] = useState<string[]>([]);
  const [pendingTypes, setPendingTypes] = useState<string[]>([]);
  const [pendingApps,  setPendingApps]  = useState<string[]>([]);

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
    if (key === "book") setPendingBooks([...appliedBooks]);
    if (key === "type") setPendingTypes([...appliedTypes]);
    if (key === "app")  setPendingApps([...appliedApps]);
    setOpenKey(key);
  }

  function apply(key: DropdownKey) {
    if (key === "book") setAppliedBooks([...pendingBooks]);
    if (key === "type") setAppliedTypes([...pendingTypes]);
    if (key === "app")  setAppliedApps([...pendingApps]);
    setOpenKey(null);
  }

  function applyAll() {
    setAppliedBooks([...pendingBooks]);
    setAppliedTypes([...pendingTypes]);
    setAppliedApps([...pendingApps]);
    setOpenKey(null);
  }

  const filtered = catalogProducts.filter(p => {
    const matchBook = appliedBooks.length === 0 || appliedBooks.includes(p.book);
    const matchType = appliedTypes.length === 0 || appliedTypes.includes(p.type);
    const matchApp  = appliedApps.length  === 0 || appliedApps.includes(p.app);
    return matchBook && matchType && matchApp;
  });

  const grouped = BOOKS.map(book => ({
    label: book,
    items: filtered.filter(p => p.book === book),
  })).filter(g => g.items.length > 0);

  const hasActiveFilters = appliedBooks.length > 0 || appliedTypes.length > 0 || appliedApps.length > 0;

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
      {/* ── PILL FILTER BAR ── */}
      <div className="bg-[#0a1520] py-10 lg:py-14">
        <div className="container-max section-padding">
          <div
            ref={pillRef}
            className={`relative flex items-stretch rounded-full shadow-2xl transition-colors duration-200 ${openKey ? "bg-[#e8e8e8]" : "bg-white"}`}
          >
            {/* Book */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle("book")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("book", "rounded-l-full")}`}
              >
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Book</p>
                <p className="text-gray-400 text-[13px] mt-1 truncate">
                  {pillLabel(appliedBooks, "Which product range?")}
                </p>
              </button>
              {openKey === "book" && (
                <CheckboxDropdown
                  options={BOOKS}
                  pending={pendingBooks}
                  setPending={setPendingBooks}
                  showClear={true}
                  onApply={() => apply("book")}
                />
              )}
            </div>

            <div className={`self-center h-10 w-px flex-shrink-0 transition-colors duration-200 ${openKey ? "bg-[#d0d0d0]" : "bg-gray-200"}`} />

            {/* Paper Type */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggle("type")}
                className={`w-full h-full text-left px-7 py-5 transition-colors duration-200 ${sectionBtn("type", "rounded-2xl")}`}
              >
                <p className="font-semibold text-brand-navy text-[15px] leading-tight">Paper Type</p>
                <p className="text-gray-400 text-[13px] mt-1 truncate">
                  {pillLabel(appliedTypes, "Eco, Metallic, Textured…")}
                </p>
              </button>
              {openKey === "type" && (
                <CheckboxDropdown
                  options={PRODUCT_TYPES}
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
                  options={APP_TYPES}
                  pending={pendingApps}
                  setPending={setPendingApps}
                  showClear={true}
                  onApply={() => apply("app")}
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
              {[...appliedBooks, ...appliedTypes, ...appliedApps].map(tag => (
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
                  setAppliedBooks([]); setAppliedTypes([]); setAppliedApps([]);
                  setPendingBooks([]); setPendingTypes([]); setPendingApps([]);
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
                <MotionDiv key={product.id} delay={0.04 + (i % 6) * 0.06}>
                  <Link href={`/products/${product.id}`} className="group block" aria-label={`View ${product.name}`}>
                    {/* Image container — no padding so image fills edge-to-edge */}
                    <div
                      className="relative rounded-2xl overflow-hidden mb-5 transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    {/* Colour / variant badge — Figma: blue outline pill */}
                    <div className="mb-3">
                      <span
                        className="inline-flex items-center border text-[11px] font-semibold tracking-widest px-3 py-1 rounded-full uppercase"
                        style={{ color: "#00449A", borderColor: "#00449A" }}
                      >
                        {product.colors} {product.colors === 1 ? "COLOUR" : "COLOURS"}
                      </span>
                    </div>

                    {/* Product name — Figma: near-black, semibold */}
                    <h3
                      className="font-sans font-semibold mb-2 group-hover:text-brand-orange transition-colors"
                      style={{ fontSize: "clamp(1.5rem,2.2vw,2rem)", color: "#202020" }}
                    >
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.description}</p>

                    {/* Explore pill */}
                    <div className="inline-flex items-center gap-3 border border-gray-200 group-hover:border-brand-orange rounded-full pl-5 pr-1.5 py-1.5 transition-colors">
                      <span className="text-sm font-medium text-brand-navy">Explore</span>
                      <span className="bg-brand-orange text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
