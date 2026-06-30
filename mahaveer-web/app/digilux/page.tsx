import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DigiLuxCatalog } from "@/components/products/DigiLuxCatalog";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "DigiLux Papers",
  description:
    "Mahaveer Papers' exclusive DigiLux range — 24 premium textured, metallic, coated, and specialty papers for high-end printing and packaging.",
  alternates: { canonical: "/digilux" },
};

export default function DigiLuxPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ── HERO ── Same layout as Products page */}
        <section
          className="relative min-h-[70vh] flex items-end overflow-hidden bg-[#0a1520]"
          aria-label="DigiLux hero"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0d1b2a 0%, #0a1520 40%, #111d2c 100%)",
              opacity: 0.98,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full container-max section-padding pt-36 pb-10">
            <MotionDiv className="max-w-3xl mb-6">
              <h1
                className="font-display italic text-white leading-[1.0] mb-5"
                style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)" }}
              >
                <span className="text-brand-orange not-italic font-bold">Bring your</span>
                <br />
                Creativity to life
              </h1>
              <p className="text-white/75 text-lg lg:text-2xl font-medium leading-snug">
                Choose the Perfect Paper for your Project!
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* ── CLIENT: filter bar + product grid ── */}
        <DigiLuxCatalog />

        {/* ── CTA STRIP ── */}
        <MotionSection className="section-padding py-14 lg:py-20 bg-brand-navy">
          <div className="container-max text-center">
            <MotionDiv>
              <h2 className="font-sans font-bold text-display-md text-white mb-4">
                Can&apos;t find what you need?{" "}
                <span className="font-display italic text-brand-orange">Let&apos;s talk.</span>
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto leading-relaxed">
                We stock hundreds of paper varieties. If you don&apos;t see what you&apos;re
                looking for, contact us and we&apos;ll find the perfect match.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.2}>
              <Link href="/contact" className="btn-primary">
                Request a Quote
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </MotionDiv>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </>
  );
}
