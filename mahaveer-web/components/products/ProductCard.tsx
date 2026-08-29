import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";
import type { CatalogProduct } from "@/data/products";

export function ProductCard({ product, delay = 0, catalogQuery = "" }: { product: CatalogProduct; delay?: number; catalogQuery?: string }) {
  const href = catalogQuery ? `/products/${product.id}?from=${encodeURIComponent(catalogQuery)}` : `/products/${product.id}`;
  return (
    <MotionDiv delay={delay}>
      <Link href={href} onClick={() => sessionStorage.setItem("mp-catalog-scroll", String(window.scrollY))} className="group block" aria-label={`View ${product.name}`}>
        {/* Image container — increased height */}
        <div
          className="relative rounded-xl overflow-hidden mb-4 transition-transform duration-500 group-hover:scale-[1.015]"
          style={{ aspectRatio: "4 / 4.2" }}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400">
              <ImageOff className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-medium">Photo coming soon</span>
            </div>
          )}
          {/* Premium Favini mark — bottom-right frosted pill with wordmark */}
          {product.isFavini && product.image && (
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-white/60">
              <span className="text-[8px] font-semibold tracking-[0.14em] text-gray-400 leading-none">BY</span>
              <Image
                src="/images/favini-logo.svg"
                alt="Favini"
                width={52}
                height={12}
                className="h-3 w-auto"
                unoptimized
              />
            </span>
          )}
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 text-[9px] leading-none text-white/70 bg-black/35 backdrop-blur-sm px-1.5 py-1 rounded">
            Image indicative
          </span>
        </div>

        {/* Colour / variant badge — Figma: blue outline pill */}
        <div className="mb-2.5">
          <span
            className="inline-flex items-center border text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full uppercase"
            style={{ color: "#00449A", borderColor: "#00449A" }}
          >
            {product.colors} {product.colors === 1 ? "COLOUR" : "COLOURS"}
          </span>
        </div>

        {/* Product name — Figma: near-black, semibold */}
        <h3
          className="font-sans font-semibold mb-1.5 group-hover:text-brand-orange transition-colors leading-tight"
          style={{ fontSize: "clamp(1.1rem,1.5vw,1.35rem)", color: "#202020" }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{product.description}</p>

        {/* Explore pill */}
        <div className="inline-flex items-center gap-2.5 border border-gray-200 group-hover:border-brand-orange rounded-full pl-4 pr-1 py-1 transition-colors">
          <span className="text-[13px] font-medium text-brand-navy">Explore</span>
          <span className="bg-brand-orange text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </MotionDiv>
  );
}
