"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Mail } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";
import type { CatalogProduct } from "@/data/products";
import type { ProductSwatch } from "@/lib/productSwatches";
import { slugifySwatchName } from "@/lib/productSwatches";

// One individual product (a single colour/GSM shade of a family) on the
// /products/search results grid — as opposed to ProductCard, which shows one
// tile per whole family. Links straight to that shade on the product page
// (#swatch-<slug>) instead of just the top of the page.
export function SwatchResultCard({
  product,
  swatch,
  delay = 0,
  backHref,
}: {
  product: CatalogProduct;
  swatch: ProductSwatch;
  delay?: number;
  /** Full path+query of the results page this card lives on — carried as
   * ?from= so the product page's Back to Results returns to the same
   * filtered + Book-tabbed view. */
  backHref: string;
}) {
  const href = `/products/${product.id}?from=${encodeURIComponent(backHref)}#swatch-${slugifySwatchName(swatch.name)}`;
  const colorImage = product.colorImages?.[swatch.name] ?? (product.colorNames?.length ? undefined : product.image);
  const plainHexBlock = !colorImage && !!swatch.hex;

  return (
    <MotionDiv delay={delay}>
      <Link
        href={href}
        onClick={() => sessionStorage.setItem("mp-catalog-scroll", String(window.scrollY))}
        className="group block"
        aria-label={`View ${product.name} — ${swatch.label}`}
      >
        <div
          className="relative rounded-xl overflow-hidden mb-4 transition-transform duration-500 group-hover:scale-[1.015]"
          style={{ aspectRatio: "4 / 3.6", backgroundColor: plainHexBlock ? swatch.hex : undefined }}
        >
          {colorImage ? (
            <Image
              src={colorImage}
              alt={`${product.name} — ${swatch.label}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : !plainHexBlock ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400">
              <ImageOff className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-medium">Photo coming soon</span>
            </div>
          ) : null}

          <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center bg-brand-navy/90 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full uppercase">
            {product.book}
          </span>

          {product.isFavini && colorImage && (
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-white/60">
              <span className="text-[8px] font-semibold tracking-[0.14em] text-gray-400 leading-none">BY</span>
              <Image src="/images/favini-logo.svg" alt="Favini" width={52} height={12} className="h-3 w-auto" unoptimized />
            </span>
          )}
          <span className="pointer-events-none absolute bottom-2 right-2 flex h-6 w-7 items-center justify-center rounded-[4px] bg-white shadow-sm">
            <Mail className="h-3.5 w-3.5 text-gray-700" />
          </span>
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 text-[9px] leading-none text-white/70 bg-black/35 backdrop-blur-sm px-1.5 py-1 rounded">
            Image indicative
          </span>
        </div>

        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center border text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ color: "#00449A", borderColor: "#00449A" }}
          >
            {swatch.gsmLabel}
          </span>
          {swatch.sizesLabel && (
            <span className="inline-flex items-center border text-[10px] font-medium px-2.5 py-1 rounded-full text-gray-500 border-gray-300">
              {swatch.sizesLabel}
            </span>
          )}
        </div>

        <h3
          className="font-sans font-semibold mb-1 group-hover:text-brand-orange transition-colors leading-tight"
          style={{ fontSize: "clamp(1.1rem,1.5vw,1.35rem)", color: "#202020" }}
        >
          {swatch.label}
        </h3>
        {swatch.label !== product.name && (
          <p className="text-[13px] text-gray-500">{product.name}</p>
        )}
      </Link>
    </MotionDiv>
  );
}
