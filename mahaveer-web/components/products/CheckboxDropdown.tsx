"use client";

import { ArrowRight } from "lucide-react";

// Shared by the /products browse page's pill bar and the /products/search
// results page's pill bar. Defined once so both stay visually identical.
export function CheckboxDropdown({
  options,
  pending,
  setPending,
  showClear,
  onApply,
  applyLabel = "Apply",
}: {
  options: readonly string[];
  pending: string[];
  setPending: (v: string[]) => void;
  showClear: boolean;
  onApply: () => void;
  applyLabel?: string;
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
          {applyLabel}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </div>
  );
}
