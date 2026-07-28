import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  );
}
