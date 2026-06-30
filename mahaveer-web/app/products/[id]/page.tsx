import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { catalogProducts } from "@/data/products";

type Props = { params: Promise<{ id: string }> };

// "120 · 250 · 300 GSM" → ["120", "250", "300"] + unit
function parseWeights(gsm: string): { values: string[]; unit: string } {
  const unit = /MM/i.test(gsm) ? "MM" : "GSM";
  const base = gsm.replace(/\s*(GSM|MM)\s*$/i, "");
  const values = base.split("·").map(s => s.trim()).filter(Boolean);
  return { values, unit };
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

  const { values: weightValues, unit: weightUnit } = parseWeights(product.gsm);

  const related = catalogProducts
    .filter(p => p.book === product.book && p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>

        {/* ──────────────────────────────────────────────────────
            HERO — full-width dark showcase (Favini-style)
            Product image centered and large; name prominent above
        ─────────────────────────────────────────────────────── */}
        <section className="bg-[#0a1520] min-h-screen flex flex-col pt-28 overflow-hidden">

          {/* Breadcrumb */}
          <div className="container-max section-padding">
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-12">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              <span>/</span>
              <span className="text-brand-orange">{product.book}</span>
              <span>/</span>
              <span className="text-gray-400">{product.name}</span>
            </nav>
          </div>

          {/* Centred title block */}
          <MotionDiv className="text-center px-6 mb-10">
            <span className="inline-flex items-center bg-brand-orange/15 text-brand-orange text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              {product.book}
            </span>

            <h1
              className="font-display italic text-white leading-[1.0] mb-6"
              style={{ fontSize: "clamp(3rem,8vw,7rem)" }}
            >
              {product.name}
            </h1>

            {/* Type · Application · Colours */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="border border-white/20 text-white/60 text-xs font-medium px-4 py-1.5 rounded-full">
                {product.type}
              </span>
              <span className="border border-white/20 text-white/60 text-xs font-medium px-4 py-1.5 rounded-full">
                {product.app}
              </span>
              <span className="border border-white/20 text-white/60 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                {product.colors} {product.colors === 1 ? "Colour" : "Colours"}
              </span>
            </div>
          </MotionDiv>

          {/* Large product image — bleeds into bottom of dark section */}
          <MotionDiv delay={0.12} className="flex-1 flex items-end justify-center px-6">
            <div
              className="relative w-full max-w-[480px] lg:max-w-[580px] rounded-t-2xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: "1 / 1.05" }}
            >
              {/* Subtle vignette so image fades into the dark bg at the edges */}
              <div className="absolute inset-0 z-10 pointer-events-none"
                style={{ boxShadow: "inset 0 0 80px 20px #0a1520" }} />
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 90vw, 580px"
                className="object-cover"
              />
            </div>
          </MotionDiv>

          {/* Scroll cue */}
          <div className="flex justify-center py-6 text-white/30 animate-bounce">
            <ChevronDown className="w-6 h-6" />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            TWO-COLUMN INTRO (mirrors Favini's "Cos'è X" section)
            Left: description + CTAs  |  Right: specs + weight chips
        ─────────────────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div className="container-max section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

              {/* Left — "What is [Product]" */}
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                  About this paper
                </p>
                <h2
                  className="font-sans font-bold text-brand-navy mb-6 leading-tight"
                  style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)" }}
                >
                  What is {product.name}?
                </h2>
                <p className="text-gray-600 text-[16px] leading-relaxed mb-10">
                  {product.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="inline-flex items-center gap-3 bg-brand-navy hover:bg-[#0d1b2a] text-white text-sm font-semibold rounded-full px-6 py-3.5 transition-colors"
                  >
                    Request a Quote
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href={`/contact?product=Sample%20of%20${encodeURIComponent(product.name)}`}
                    className="inline-flex items-center border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-sm font-semibold rounded-full px-6 py-3.5 transition-colors"
                  >
                    Request Sample
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-4">We&apos;ll reply within 24 hours.</p>
              </div>

              {/* Right — specs + weight chips (mirrors Favini's right-col tech info) */}
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-6">
                  Specifications
                </p>

                {/* Spec rows */}
                <dl className="divide-y divide-gray-100 mb-10">
                  {[
                    { label: "Catalogue Book", value: product.book },
                    { label: "Paper Type",     value: product.type },
                    { label: "Best For",       value: product.app },
                    { label: "Colours / Finishes",
                      value: `${product.colors} ${product.colors === 1 ? "variant" : "variants"}` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-3.5 gap-4">
                      <dt className="text-sm text-gray-500">{row.label}</dt>
                      <dd className="text-sm font-semibold text-brand-navy text-right">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Available weights — like Favini's grammage listing */}
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">
                    Available weights
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weightValues.map(w => (
                      <span
                        key={w}
                        className="inline-flex items-center border-2 border-brand-navy text-brand-navy text-sm font-bold px-5 py-2 rounded-full"
                      >
                        {w} <span className="ml-1 text-gray-400 font-normal text-xs">{weightUnit}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            RELATED PRODUCTS — same book (Favini has this too)
        ─────────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-[#f8f7f5] py-14 lg:py-20">
            <div className="container-max section-padding">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                    From the same collection
                  </p>
                  <h2 className="font-sans font-bold text-brand-navy text-2xl lg:text-3xl">
                    More from {product.book}
                  </h2>
                </div>
                <Link href="/products" className="text-sm text-brand-orange hover:underline font-medium">
                  View all products
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p, i) => (
                  <MotionDiv key={p.id} delay={0.04 + i * 0.08}>
                    <Link href={`/products/${p.id}`} className="group block">

                      <div
                        className="relative rounded-2xl overflow-hidden mb-5"
                        style={{ aspectRatio: "4/5" }}
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      </div>

                      <span className="inline-flex items-center border border-gray-300 text-gray-500 text-[11px] font-semibold tracking-widest px-3 py-1 rounded-full uppercase mb-2">
                        {p.colors} {p.colors === 1 ? "Colour" : "Colours"}
                      </span>
                      <h3 className="font-bold text-brand-navy text-base group-hover:text-brand-orange transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{p.gsm}</p>

                      <div className="mt-3 inline-flex items-center gap-2 text-sm text-brand-orange font-medium group-hover:gap-3 transition-all">
                        View paper <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
