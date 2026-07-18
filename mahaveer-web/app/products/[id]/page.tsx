import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { catalogProducts } from "@/data/products";

type Props = { params: Promise<{ id: string }> };

// "120 · 250 · 300 GSM" → "120, 250, 300 GSM" (Figma pill format)
function formatGsm(gsm: string): string {
  const unit = /MM/i.test(gsm) ? "MM" : "GSM";
  const base = gsm.replace(/\s*(GSM|MM)\s*$/i, "");
  const values = base.split("·").map(s => s.trim()).filter(Boolean);
  return `${values.join(", ")} ${unit}`;
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

  const gsmLabel = formatGsm(product.gsm);
  const swatchCount = Math.max(1, product.colors);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>

        {/* ── HERO ── same as Products page: paper-roll photo + heading */}
        <section
          className="relative min-h-[70vh] flex items-end overflow-hidden"
          aria-label="Products hero"
        >
          <Image
            src="/figma/hero-bg.jpg"
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
                <span className="text-brand-orange not-italic">Bring your</span>
                <br />
                Creativity to life
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
          <div className="mb-10 lg:mb-14">
            <h2 className="font-sans font-semibold" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", color: "#202020" }}>
              {product.app}
            </h2>
            <p className="text-gray-400 font-normal mt-1" style={{ fontSize: "clamp(1rem,1.5vw,1.25rem)" }}>
              {swatchCount} Product
            </p>
          </div>

          {/* Swatch grid — Figma: square texture, envelope chip, blue GSM pill, name */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: swatchCount }).map((_, i) => (
              <MotionDiv key={i} delay={0.04 + (i % 4) * 0.05}>
                <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src={product.image}
                    alt={`${product.name} texture swatch`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 right-2 flex h-6 w-7 items-center justify-center rounded-[4px] bg-white shadow-sm">
                    <Mail className="h-3.5 w-3.5 text-gray-700" />
                  </span>
                </div>
                <div className="mt-4">
                  <span
                    className="inline-flex items-center border text-[13px] font-medium px-3 py-1 rounded-full"
                    style={{ color: "#00449A", borderColor: "#00449A" }}
                  >
                    {gsmLabel}
                  </span>
                </div>
                <h3
                  className="font-sans font-semibold mt-2"
                  style={{ fontSize: "clamp(1.25rem,1.8vw,1.75rem)", color: "#202020" }}
                >
                  {product.name}
                </h3>
              </MotionDiv>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
