import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/home/About";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/home/FAQ";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Mahaveer Papers — our legacy, values, and commitment to delivering world-class paper solutions for every industry.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ── HERO ── */}
        <section
          className="relative min-h-[75vh] flex items-end overflow-hidden pb-20 lg:pb-28"
          aria-label="About hero"
        >
          {/* Background photo — Figma: abstract dark paper-wave render */}
          <Image
            src="/figma/about-hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          {/* Gradient overlay — subtle bottom darkening for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,8,0.15) 0%, rgba(10,10,8,0.55) 70%, rgba(10,10,8,0.7) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 container-max section-padding pt-32 w-full">
            <div className="max-w-3xl">
              {/* Figma/Framer: "Industry that choose us", Newsreader 400, fs 104/lh 104, ls -2.08px */}
              <MotionDiv>
                <h1 className="font-display italic text-white mb-6">
                  {/* "Industry" line 1 (orange, not italic), "that choose us" line 2 (italic white) */}
                  <span
                    className="block text-brand-orange not-italic font-normal"
                    style={{
                      fontSize: "clamp(2.5rem,6.5vw,6.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Industry
                  </span>
                  <span
                    className="block font-normal"
                    style={{
                      fontSize: "clamp(2.5rem,6.5vw,6.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    that choose us
                  </span>
                </h1>
              </MotionDiv>

              <MotionDiv delay={0.1}>
                <p className="text-white/80 text-base leading-relaxed mb-3 max-w-lg">
                  Engineered paper solutions crafted for performance, consistency, and
                  scale—trusted by businesses that demand more from every sheet.
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg">
                  From fine printing to industrial applications, Mahaveer Papers delivers
                  precision-made paper products designed to elevate quality, efficiency,
                  and reliability across industries.
                </p>
              </MotionDiv>

              <MotionDiv delay={0.2}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-navy/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  Contact Us
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange flex-shrink-0">
                    <ChevronRight className="h-3.5 w-3.5 text-white" />
                  </span>
                </Link>
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* ── ABOUT SECTION (reuse home component) ── */}
        <About />

        {/* ── CTA ── */}
        <CTA />

        {/* ── TESTIMONIALS ── */}
        <Testimonials />

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
