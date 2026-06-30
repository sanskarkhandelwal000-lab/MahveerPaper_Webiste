import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductsCatalog } from "@/components/products/ProductsCatalog";
import { MotionDiv } from "@/components/ui/MotionDiv";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Mahaveer Papers' full range of packaging papers, printing & writing papers, specialty boards, and DigiLux premium papers.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ── HERO ── Figma: dark textured background, "Bring your / Creativity to life" */}
        <section
          className="relative min-h-[70vh] flex items-end overflow-hidden bg-[#0a1520]"
          aria-label="Products hero"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.08'/%3E%3C/rect%3E%3C/svg%3E")`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0d1b2a 0%, #0a1520 40%, #111d2c 100%)",
              opacity: 0.98,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full container-max section-padding pt-36 pb-10">
            <MotionDiv className="max-w-3xl mb-6">
              {/* Figma: "Bring your" (orange, bold) + "Creativity to life" (white, italic) */}
              <h1
                className="font-display italic text-white leading-[1.0] mb-5"
                style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)" }}
              >
                <span className="text-brand-orange not-italic font-bold">Bring your</span>
                <br />
                Creativity to life
              </h1>
              {/* Figma: fs=49 subtitle */}
              <p className="text-white/75 text-lg lg:text-2xl font-medium leading-snug">
                Choose the Perfect Paper for your Project!
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* ── CLIENT: filter bar + catalog grid ── */}
        <ProductsCatalog />
      </main>
      <Footer />
    </>
  );
}
