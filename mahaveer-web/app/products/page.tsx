import type { Metadata } from "next";
import Image from "next/image";
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
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        {/* ── HERO ── Figma: paper-roll photo background, "Bring your / Creativity to life" */}
        <section
          className="relative min-h-[70vh] flex items-end overflow-hidden"
          aria-label="Products hero"
        >
          <Image
            src="/images/banners/products-banner.jpg"
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
              {/* Figma: "Bring your" (orange) + "Creativity to life" (white, italic), Newsreader 400, fs 104/lh 104, ls -2.08px */}
              <h1
                className="font-display italic font-normal text-white leading-[1.0] mb-5"
                style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)", letterSpacing: "-0.02em" }}
              >
                <span className="text-brand-orange not-italic">Bring your</span>
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
