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
          {/* Background photo */}
          <Image
            src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          {/* Gradient overlay — dark navy at bottom, transparent at top */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,25,35,0.45) 0%, rgba(15,25,35,0.85) 70%, rgba(15,25,35,0.95) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 container-max section-padding pt-32 w-full">
            <div className="max-w-3xl">
              {/* Figma: "Industry" + "that choose us" at fs=128 */}
              <MotionDiv>
                <h1 className="font-display italic text-white leading-[1.0] mb-6">
                  {/* Figma: "Industry" line 1 (orange bold), "that choose us" line 2 (italic white) */}
                  <span className="block text-brand-orange not-italic font-bold" style={{ fontSize: "clamp(3rem,8vw,7rem)" }}>
                    Industry
                  </span>
                  <span className="block" style={{ fontSize: "clamp(3rem,8vw,7rem)" }}>
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

        {/* ── TESTIMONIALS ── */}
        <Testimonials />

        {/* ── CTA ── */}
        <CTA />

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
