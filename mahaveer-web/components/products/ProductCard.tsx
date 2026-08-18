import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";
import type { CatalogProduct } from "@/data/products";

export function ProductCard({ product, delay = 0 }: { product: CatalogProduct; delay?: number }) {
  return (
    <MotionDiv delay={delay}>
      <Link href={`/products/${product.id}`} className="group block" aria-label={`View ${product.name}`}>
        {/* Image container — no padding so image fills edge-to-edge */}
        <div
          className="relative rounded-2xl overflow-hidden mb-5 transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ aspectRatio: "4/5" }}
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
  );
}
