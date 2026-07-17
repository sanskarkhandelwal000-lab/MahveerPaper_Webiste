import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "DigiLux Papers",
  description:
    "DIGILUX is Mahaveer Papers' dedicated brand for premium digital print media — specialty papers and self-adhesive solutions in the industry's most preferred 13 × 19 inch digital size.",
  alternates: { canonical: "/digilux" },
};

// Figma palette — DigiLux brand microsite
const OLIVE = "#7C7844";        // body / accent text
const INK = "#1A1A1A";          // near-black sans headings
const CREAM = "#FBF5E7";        // warm section background
const RUST = "#A63D12";         // promise heading
const BROWN = "#8A4D1E";        // need-samples heading + button
const ELEVATE_BROWN = "#6E5A36"; // elevate heading

const portfolioItems = [
  "Premium white boards",
  "Texture Papers & Board (White & Ivory)",
  "Metallic Papers & Board",
  "Non-Tearable Synthetic Sheets",
  "Cromo & Mirror Coat Boards",
  "Gold & Silver Boards",
  "PVC-Based Self-Adhesive Sheets",
  "Specialty Print Media for Digital Production",
];

const whyItems = [
  {
    title: "Designed for Low MOQ Jobs:",
    body: "Produce premium work without investing in large quantities.",
  },
  {
    title: "Standardized Quality:",
    body: "Reliable shade, finish, thickness, and print performance across every batch.",
  },
  {
    title: "Ready Stock:",
    body: "Fast availability means faster deliveries to your customers.",
  },
  {
    title: "Wide Product Range:",
    body: "One trusted brand for multiple premium print media requirements.",
  },
  {
    title: "Optimized for Digital Printing:",
    body: "Carefully selected products designed to perform consistently on modern digital presses.",
  },
];

// Figma: 4-point sparkle outline used on the Promise card
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="#8B6914"
      strokeWidth="1.25"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" />
    </svg>
  );
}

export default function DigiLuxPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>

        {/* ── HERO ── Figma: fanned grey paper sheets, serif cream heading bottom-left */}
        <section
          className="relative min-h-[80vh] flex items-end overflow-hidden pb-24 lg:pb-32"
          aria-label="DigiLux hero"
        >
          <Image
            src="/figma/digilux-hero.jpg"
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
                "linear-gradient(to bottom, rgba(10,10,8,0.25) 0%, rgba(10,10,8,0.45) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 container-max section-padding w-full">
            <MotionDiv>
              <h1
                className="font-display font-normal mb-4"
                style={{
                  fontSize: "clamp(2.5rem,5vw,4.5rem)",
                  lineHeight: 1.05,
                  color: "#F2EDDA",
                }}
              >
                Print Beyond Ordinary
              </h1>
              <p className="text-white/85 text-base lg:text-xl">
                Premium Digital Print Media by Mahaveer Papers
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* ── INTRO ── centered serif olive paragraphs */}
        <MotionSection className="bg-white section-padding py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <MotionDiv>
              <p
                className="font-display mb-10"
                style={{
                  fontSize: "clamp(1.25rem,1.9vw,1.75rem)",
                  lineHeight: 1.5,
                  color: OLIVE,
                }}
              >
                DIGILUX is Mahaveer Papers&apos; dedicated brand for premium digital print
                media, created to empower printers, designers, converters, and brands with
                high-quality specialty papers and self-adhesive solutions in the
                industry&apos;s most preferred 13 × 19 inch digital size.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <p
                className="font-display"
                style={{
                  fontSize: "clamp(1.25rem,1.9vw,1.75rem)",
                  lineHeight: 1.5,
                  color: OLIVE,
                }}
              >
                Launched in 2023, DIGILUX was born from a simple vision—to make premium
                print media accessible for short-run and low MOQ jobs without compromising
                on quality, consistency, or creativity.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── OUR JOURNEY ── */}
        <MotionSection className="bg-white section-padding py-16 lg:py-24">
          <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: heading + pinned swatch cards */}
            <div>
              <MotionDiv>
                <h2
                  className="font-sans font-semibold tracking-tight mb-10"
                  style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)", color: INK }}
                >
                  Our Journey
                </h2>
              </MotionDiv>
              <MotionDiv delay={0.1}>
                {/* Figma: two rotated, pinned colour swatch cards */}
                <div className="relative hidden lg:block h-[340px]">
                  <div className="absolute left-2 top-4 h-[170px] w-[190px] -rotate-6 overflow-hidden rounded-[22px] shadow-lg">
                    <Image
                      src="/figma/colored-papers.jpg"
                      alt=""
                      fill
                      sizes="190px"
                      className="object-cover"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="absolute left-36 top-40 h-[170px] w-[190px] rotate-6 overflow-hidden rounded-[22px] shadow-lg">
                    <Image
                      src="/figma/colored-papers.jpg"
                      alt=""
                      fill
                      sizes="190px"
                      className="object-cover object-bottom"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="absolute left-24 top-2 h-2.5 w-2.5 rounded-full bg-[#E0447C]" aria-hidden="true" />
                  <span className="absolute left-56 top-[152px] h-2.5 w-2.5 rounded-full bg-[#E0447C]" aria-hidden="true" />
                </div>
              </MotionDiv>
            </div>

            {/* Right: olive copy + green portfolio card + serif note */}
            <div>
              <MotionDiv delay={0.1}>
                <p className="mb-4 text-[17px] leading-relaxed" style={{ color: OLIVE }}>
                  DIGILUX began with a focused range of premium textured papers for digital
                  printing. As customer requirements evolved, so did our portfolio.
                </p>
                <p className="mb-8 text-[17px] leading-relaxed" style={{ color: OLIVE }}>
                  Today, DIGILUX offers over *40 carefully selected specialty products*,
                  helping digital printers deliver premium results across a wide range of
                  applications.
                </p>
              </MotionDiv>

              <MotionDiv delay={0.15}>
                <div
                  className="rounded-3xl p-8 lg:p-10 mb-8"
                  style={{
                    background: "linear-gradient(135deg, #E9F5E6 0%, #F4FBF0 60%, #EDF8EC 100%)",
                  }}
                >
                  <h3
                    className="font-sans font-semibold mb-8"
                    style={{ fontSize: "clamp(1.35rem,2vw,1.75rem)", color: "#14372B" }}
                  >
                    Our growing portfolio includes:
                  </h3>
                  <ul className="flex flex-col gap-5">
                    {portfolioItems.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3FB65C]">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-[16px] text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionDiv>

              <MotionDiv delay={0.2}>
                <p
                  className="font-display text-[17px] leading-relaxed"
                  style={{ color: OLIVE }}
                >
                  Every product is stocked in the convenient *13 × 19 inch* format, enabling
                  quick production with minimal wastage.
                </p>
              </MotionDiv>
            </div>
          </div>
        </MotionSection>

        {/* ── WHY DIGILUX? ── */}
        <MotionSection className="bg-white section-padding py-16 lg:py-24">
          <div className="container-max">
            <MotionDiv>
              <h2
                className="font-sans font-semibold tracking-tight mb-12"
                style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)", color: INK }}
              >
                Why DigiLux?
              </h2>
            </MotionDiv>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <MotionDiv direction="left">
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "10/8" }}>
                  <Image
                    src="/figma/colored-papers.jpg"
                    alt="Fanned colourful paper swatches"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </MotionDiv>
              <div className="flex flex-col gap-8">
                {whyItems.map((item, i) => (
                  <MotionDiv key={item.title} delay={0.08 + i * 0.05}>
                    <p className="font-semibold text-[17px] mb-0.5" style={{ color: "#6B672F" }}>
                      {item.title}
                    </p>
                    <p className="text-[16px] leading-relaxed" style={{ color: OLIVE }}>
                      {item.body}
                    </p>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ── APPLICATIONS ── 12 swatch cards */}
        <MotionSection className="bg-white section-padding py-16 lg:py-24">
          <div className="container-max">
            <MotionDiv>
              <h2
                className="font-sans font-semibold tracking-tight mb-4"
                style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)", color: INK }}
              >
                Applications
              </h2>
              <p className="mb-12 text-[16px]" style={{ color: OLIVE }}>
                DIGILUX products are trusted for a wide variety of commercial print and
                packaging applications.
              </p>
            </MotionDiv>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <MotionDiv key={i} delay={0.04 + (i % 4) * 0.05}>
                  <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src="/figma/digilux-swatch.jpg"
                      alt="Speckled specialty paper swatch"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 right-2 flex h-6 w-7 items-center justify-center rounded-[4px] bg-white shadow-sm">
                      <Mail className="h-3.5 w-3.5 text-gray-700" />
                    </span>
                  </div>
                  <p className="mt-3 font-display text-[19px]" style={{ color: OLIVE }}>
                    Visiting Cards
                  </p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── ELEVATE EVERY PRINT ── parchment background */}
        <MotionSection className="relative overflow-hidden py-16 lg:py-24">
          <Image
            src="/figma/digilux-parchment.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div className="relative z-10 container-max section-padding">
            <MotionDiv>
              <h2
                className="font-display font-normal mb-8"
                style={{ fontSize: "clamp(2rem,3.5vw,3rem)", color: ELEVATE_BROWN }}
              >
                Elevate Every Print
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <div className="flex flex-col gap-6 max-w-3xl text-[17px] leading-relaxed" style={{ color: OLIVE }}>
                <p>The right paper does more than carry ink—it creates an experiences.</p>
                <p>
                  Whether it&apos;s premium packaging, luxury invitations, elegant branding,
                  or high-end labels, specialty papers add depth, texture, character, and
                  value to every printed piece.
                </p>
                <p>When your product is aspirational, your packaging should be too.</p>
                <p>
                  DIGILUX helps transform ordinary prints into memorable experiences that
                  leave a lasting impression.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── THE DIGILUX PROMISE ── */}
        <MotionSection className="bg-white section-padding py-14 lg:py-20">
          <div className="container-max">
            <MotionDiv>
              <div
                className="relative rounded-[32px] px-6 py-14 lg:px-20 lg:py-20 text-center shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #FFFDF4 0%, #FFF8E4 100%)",
                }}
              >
                <Sparkle className="absolute left-10 top-8 h-12 w-12 lg:h-16 lg:w-16" />
                <Sparkle className="absolute bottom-8 right-12 h-10 w-10 lg:h-14 lg:w-14 rotate-45" />
                <h2
                  className="font-display font-normal mb-8"
                  style={{ fontSize: "clamp(1.75rem,2.8vw,2.5rem)", color: RUST }}
                >
                  The DIGILUX Promise
                </h2>
                <p
                  className="font-display mx-auto max-w-3xl mb-2"
                  style={{ fontSize: "clamp(1.1rem,1.6vw,1.4rem)", lineHeight: 1.6, color: OLIVE }}
                >
                  At DIGILUX, we believe creativity deserves the right foundation.
                </p>
                <p
                  className="font-display mx-auto max-w-3xl"
                  style={{ fontSize: "clamp(1.1rem,1.6vw,1.4rem)", lineHeight: 1.6, color: OLIVE }}
                >
                  By combining premium materials, ready-stock availability, standardized
                  quality, and low MOQ convenience, we enable printers and brands to create
                  exceptional print products—every single time.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── NEED SAMPLES? ── */}
        <MotionSection className="section-padding pb-14 lg:pb-20 bg-white">
          <div
            className="container-max flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-8 lg:px-14 lg:py-10"
            style={{ backgroundColor: CREAM }}
          >
            <MotionDiv>
              <h2
                className="font-display font-normal"
                style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)", color: BROWN }}
              >
                Need Samples?
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-2xl px-8 py-4 font-semibold text-white text-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: BROWN }}
              >
                Contact Us
              </Link>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
