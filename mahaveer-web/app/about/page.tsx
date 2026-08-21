import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/home/About";
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
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        {/* ── HERO ── */}
        <section
          className="relative min-h-screen flex items-end overflow-hidden pb-20 lg:pb-28"
          aria-label="About hero"
        >
          {/* Background photo — layered paper-stock swatches */}
          <Image
            src="/images/mahaveer/about-hero.jpg"
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
              {/* Revision brief: "Industries that trust us" → "Three Decades of Speciality-Paper Expertise" (copy only, styling unchanged) */}
              <MotionDiv>
                <h1 className="font-display italic text-white mb-6">
                  <span
                    className="block text-brand-orange not-italic font-normal"
                    style={{
                      fontSize: "clamp(2.5rem,6.5vw,6.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Three Decades of
                  </span>
                  <span
                    className="block font-normal"
                    style={{
                      fontSize: "clamp(2.5rem,6.5vw,6.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Speciality-Paper Expertise
                  </span>
                </h1>
              </MotionDiv>

              <MotionDiv delay={0.1}>
                <p className="text-white/80 text-base leading-relaxed mb-3 max-w-lg">
                  Since 1992, Mahaveer Papers has helped printers, designers, packaging
                  converters and brands choose the right paper for every idea.
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg">
                  Explore curated speciality papers from trusted global mills, backed by
                  ready stock, our Bengaluru–Ahmedabad presence and 30+ years of practical
                  print and application guidance.
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

        {/* Testimonials intentionally omitted — revision brief: remove the
            testimonial section until genuine client quotes, projects or
            approved logos are available (the placeholder copy referenced a
            home-renovation brand and US locations). */}

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
