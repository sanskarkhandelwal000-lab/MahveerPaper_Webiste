import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, ImageOff, Sparkles, Layers, Ruler, Palette, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { catalogProducts, COLOR_NAME_HEX } from "@/data/products";

type Props = { params: Promise<{ id: string }> };

// "120 · 250 · 300 GSM" → "120, 250, 300 GSM" (Figma pill format)
function formatGsm(gsm: string): string {
  const unit = /MM/i.test(gsm) ? "MM" : "GSM";
  const base = gsm.replace(/\s*(GSM|MM)\s*$/i, "");
  const values = base.split("·").map(s => s.trim()).filter(Boolean);
  return `${values.join(", ")} ${unit}`;
}

// "63 x 91 CM · 79 x 109 CM" → "63 x 91 CM, 79 x 109 CM" (each value keeps its own unit)
function formatSizes(sizes: string): string {
  return sizes.split("·").map(s => s.trim()).filter(Boolean).join(", ");
}

export async function generateStaticParams() {
  return catalogProducts.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = catalogProducts.find(p => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} | Mahaveer Papers`,
    description: product.description,
    alternates: { canonical: `/products/${id}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = catalogProducts.find(p => p.id === id);
  if (!product) notFound();

  const familySizesLabel = product.sizes ? formatSizes(product.sizes) : null;
  // One card per real named colour when we have that data — falls back to repeating
  // the family name/image for the handful of products with no colour breakdown.
  // GSM and size are per-colour where the family's values genuinely differ by shade
  // (e.g. Burano: most colours are 250 GSM only, Cobalt/Nero also come in 320 GSM;
  // Tube: Red is 70 x 100 CM only, Black/Brown/Petrol are 72 x 102 CM only) — falls
  // back to the family-wide gsm/sizes string when every colour shares the same values.
  const swatches = product.colorNames?.length
    ? product.colorNames.map((name) => ({
        name,
        // unverifiedColors (no confirmed source — see Unmatched_Favini_Colours.xlsx)
        // deliberately get no hex either, so they fall through to the "Photo coming
        // soon" placeholder instead of a guessed colour block.
        hex: product.unverifiedColors?.includes(name) ? undefined : COLOR_NAME_HEX[name],
        gsmLabel: formatGsm(product.colorGsm?.[name] ?? product.gsm),
        sizesLabel: product.colorSizes?.[name]
          ? formatSizes(product.colorSizes[name])
          : familySizesLabel,
      }))
    : Array.from({ length: Math.max(1, product.colors) }, () => ({
        name: product.name,
        hex: undefined as string | undefined,
        gsmLabel: formatGsm(product.gsm),
        sizesLabel: familySizesLabel,
      }));

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">

        {/* ── HERO ── same as Products page: paper-roll photo + heading */}
        <section
          className="relative min-h-[70vh] flex items-end overflow-hidden"
          aria-label="Products hero"
        >
          <Image
            src="/images/mahaveer/products-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,8,0.15) 0%, rgba(10,10,8,0.55) 70%, rgba(10,10,8,0.75) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full container-max section-padding pt-36 pb-10">
            <MotionDiv className="max-w-3xl mb-6">
              <h1
                className="font-display italic font-normal text-white leading-[1.0] mb-5"
                style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)", letterSpacing: "-0.02em" }}
              >
                <span className="text-brand-orange not-italic">Explore</span>
                <br />
                {product.name}{product.isFavini ? " by Favini" : ""}
              </h1>
              <p className="text-white/75 text-lg lg:text-2xl font-medium leading-snug">
                Choose the Perfect Paper for your Project!
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* ── SHADE / TEXTURE GRID ── Figma: breadcrumb, application heading, swatch cards */}
        <section className="bg-white py-10 lg:py-16 px-9">
          {/* Breadcrumb — Figma: Home > Product > {name} */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-400 mb-10 text-[15px]">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span className="text-gray-300">&gt;</span>
            <Link href="/products" className="hover:text-brand-orange transition-colors">Product</Link>
            <span className="text-gray-300">&gt;</span>
            <span className="font-medium" style={{ color: "#202020" }}>{product.name}</span>
          </nav>

          {/* Heading — Figma: application name + product count */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-sans font-semibold" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", color: "#202020" }}>
                {product.app}
              </h2>
              <p className="text-gray-400 font-normal mt-1" style={{ fontSize: "clamp(1rem,1.5vw,1.25rem)" }}>
                {swatches.length} {product.colorNames?.length
                  ? (swatches.length === 1 ? "Shade" : "Shades")
                  : (swatches.length === 1 ? "Variant" : "Variants")}
              </p>
            </div>
            {product.isFavini && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 shadow-sm px-3.5 py-2 shrink-0">
                <span className="text-[10px] font-semibold tracking-[0.14em] text-gray-400 leading-none">BY</span>
                <Image src="/images/favini-logo.svg" alt="Favini" width={64} height={14} className="h-4 w-auto" unoptimized />
                <span className="ml-1 inline-flex items-center rounded-full bg-[#0A1930] text-white text-[10px] font-semibold tracking-wide px-2 py-0.5">FAVINI | ITALY</span>
              </span>
            )}
          </div>

          {/* About this paper — family description + suggested end applications on the
              left, a compact spec panel on the right so the section uses the full
              content width on desktop instead of a narrow card stranded on the left
              with dead space beside it. Orange rail + warm tint on the left card ties
              to the brand accent used in chips/buttons across the rest of the site;
              the right panel reuses the same neutral card language as the swatch grid
              below it, so the two sit together as one coherent block. */}
          <div className="mb-10 lg:mb-14 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            <div
              className="rounded-2xl border border-orange-100/80 bg-gradient-to-br from-orange-50/60 via-white to-white p-6 lg:p-8 shadow-sm"
              style={{ borderLeftWidth: 3, borderLeftColor: "#EA580C" }}
            >
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: "clamp(0.95rem,1.1vw,1.05rem)" }}>
                {product.description}
              </p>
              {product.bestFor && (
                <div className="mt-5 pt-5 border-t border-orange-100">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-orange" strokeWidth={2} />
                    <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-brand-orange">
                      Best For
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.bestFor.split(";").map((use) => (
                      <span
                        key={use}
                        className="inline-flex items-center rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700 shadow-sm"
                      >
                        {use.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* At a Glance — the same GSM/size facts already shown per swatch below,
                surfaced once up top for anyone who wants the spec before scrolling. */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
              <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                At a Glance
              </span>
              <dl className="mt-4 flex flex-col gap-3.5">
                {product.brand && (
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <dt className="flex items-center gap-2 text-[13px] text-gray-500">
                      <Tag className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                      Brand
                    </dt>
                    <dd className="text-[13px] font-semibold text-gray-800 text-right">{product.brand}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                  <dt className="flex items-center gap-2 text-[13px] text-gray-500">
                    <Layers className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                    GSM
                  </dt>
                  <dd className="text-[13px] font-semibold text-gray-800 text-right">{product.gsm}</dd>
                </div>
                {familySizesLabel && (
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <dt className="flex items-center gap-2 text-[13px] text-gray-500">
                      <Ruler className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                      Sizes
                    </dt>
                    <dd className="text-[13px] font-semibold text-gray-800 text-right">{familySizesLabel}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-[13px] text-gray-500">
                    <Palette className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                    {product.colorNames?.length ? "Shades" : "Variants"}
                  </dt>
                  <dd className="text-[13px] font-semibold text-gray-800 text-right">{swatches.length}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Swatch grid — Figma: square texture, envelope chip, blue GSM pill, name */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {swatches.map((swatch, i) => {
              // A real per-colour photo (client-provided, already the true
              // colour) always wins. Everything else without one falls back to
              // a flat hex swatch — NOT a CSS-tinted photo. `mix-blend-mode:
              // color` keeps the *backdrop photo's* luminosity and only swaps
              // in the tint's hue/saturation, so dark/saturated true colours
              // (e.g. Burano's Burgundy #6D071A, Fire Red #C1272D) get dragged
              // up to the light tan backdrop's brightness and render as pale
              // pink/salmon — visibly the wrong colour. A plain hex block is
              // less "photographic" but is never wrong.
              const colorImage = product.colorImages?.[swatch.name];
              const plainHexBlock = !colorImage && !!swatch.hex;

              return (
              <MotionDiv key={`${swatch.name}-${i}`} delay={0.04 + (i % 4) * 0.05}>
                <div
                  className="relative overflow-hidden rounded-sm"
                  style={{
                    aspectRatio: "1/1",
                    backgroundColor: plainHexBlock ? swatch.hex : undefined,
                  }}
                >
                  {colorImage ? (
                    <Image
                      src={colorImage}
                      alt={`${product.name} — ${swatch.name}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  ) : !plainHexBlock ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400">
                      <ImageOff className="h-7 w-7" strokeWidth={1.5} />
                      <span className="text-[11px] font-medium">Photo coming soon</span>
                    </div>
                  ) : null}
                  <span className="absolute bottom-2 right-2 flex h-6 w-7 items-center justify-center rounded-[4px] bg-white shadow-sm">
                    <Mail className="h-3.5 w-3.5 text-gray-700" />
                  </span>
                  <span className="pointer-events-none absolute bottom-1.5 left-1.5 text-[8px] leading-none text-white/75 bg-black/35 backdrop-blur-sm px-1.5 py-1 rounded">
                    Image indicative
                  </span>
                  {/* Favini mark on each swatch image — bottom-right frosted pill */}
                  {product.isFavini && colorImage && (
                    <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2 py-1 shadow-md border border-white/60">
                      <span className="text-[7px] font-semibold tracking-[0.12em] text-gray-400 leading-none">BY</span>
                      <Image src="/images/favini-logo.svg" alt="Favini" width={40} height={10} className="h-2.5 w-auto" unoptimized />
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center border text-[13px] font-medium px-3 py-1 rounded-full"
                    style={{ color: "#00449A", borderColor: "#00449A" }}
                  >
                    {swatch.gsmLabel}
                  </span>
                  {swatch.sizesLabel && (
                    <span
                      className="inline-flex items-center border text-[13px] font-medium px-3 py-1 rounded-full"
                      style={{ color: "#6B7280", borderColor: "#D1D5DB" }}
                    >
                      {swatch.sizesLabel}
                    </span>
                  )}
                </div>
                <h3
                  className="font-sans font-semibold mt-2"
                  style={{ fontSize: "clamp(1.25rem,1.8vw,1.75rem)", color: "#202020" }}
                >
                  {swatch.name}
                </h3>
              </MotionDiv>
              );
            })}
          </div>
          <p className="text-center text-[11px] leading-relaxed text-neutral-400 mt-10 max-w-3xl mx-auto">
            <span className="font-medium text-neutral-500 not-italic">Please Note:</span>{" "}
            <span className="italic">Images are indicative. Actual paper colour, texture, and finish may vary slightly due to screen display and photography.</span>
          </p>
        </section>

      </main>
      <Footer />
    </>
  );
}
