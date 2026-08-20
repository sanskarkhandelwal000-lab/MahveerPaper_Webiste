import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Mahaveer Papers is an FSC-certified company committed to responsibly sourced, biodegradable and recyclable paper for premium printing and packaging.",
  alternates: { canonical: "/sustainability" },
};

// Revision brief (per client feedback): keep the original design (2×2 image
// grid intro + four alternating image/text cards) intact — only the copy
// changes, to the client's own simpler "Paper With a Better Purpose" text.
const actions = [
  {
    id: "fsc",
    title: "FSC-Certified Company",
    body: "Mahaveer Papers is an FSC-certified company. FSC certification supports responsible forest management and provides greater transparency in the paper supply chain.",
    image: "/images/mahaveer/sustainability-sourcing.jpg",
    imageAlt: "FSC-Certified Company card next to an FSC certificate of registration and swing tags",
    imageLeft: false,
    // Links straight to the pre-filtered FSC view (ProductsCatalog reads ?fsc=1) rather
    // than a generic browse link, since this card is specifically about certification.
    cta: { label: "Browse FSC-Certified Products", href: "/products?fsc=1" },
  },
  {
    id: "biodegradable",
    title: "Biodegradable",
    body: "Paper naturally breaks down over time, unlike many conventional plastic-based materials. This makes it a responsible choice for print, communication and packaging.",
    image: "/images/mahaveer/sustainability-certified.jpg",
    imageAlt: "Biodegradable card next to natural fibre paper stock",
    imageLeft: true,
    cta: { label: "Browse Biodegradable Papers", href: "/products?biodegradable=1" },
  },
  {
    id: "recyclable",
    title: "Recyclable",
    body: "Paper can be collected, recycled and converted into new paper products, helping reduce waste and keeping valuable fibres in use for longer.",
    image: "/images/mahaveer/sustainability-recyclability.jpg",
    imageAlt: "Recyclable card next to recyclable paper packaging",
    imageLeft: false,
    cta: { label: "Browse Recyclable Papers", href: "/products?recyclable=1" },
  },
  {
    id: "standards",
    title: "High Environmental Standards",
    body: "We carefully select papers from trusted mills and responsible sources. Many of our ranges include FSC-certified, recycled and alternative-fibre options designed to meet modern environmental expectations.",
    image: "/images/mahaveer/sustainability-guidance.jpg",
    imageAlt: "High Environmental Standards card next to FSC certification documents",
    imageLeft: true,
    // This card is about picking the right responsible option, not a single filter — so
    // it CTAs to the team rather than a product link, matching its "guidance" role.
    cta: { label: "Get Expert Guidance", href: "/contact" },
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">

        {/* ── HERO ── */}
        <section
          className="relative min-h-screen flex items-end overflow-hidden pb-20 lg:pb-32"
          aria-label="Sustainability hero"
        >
          <Image
            src="/images/mahaveer/sustainability-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div className="relative z-10 container-max section-padding pt-32 w-full">
            <div className="max-w-3xl">
              <MotionDiv>
                <h1
                  className="font-display italic font-normal text-brand-navy leading-[1.0] mb-7"
                  style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)", letterSpacing: "-0.02em" }}
                >
                  <span className="text-brand-orange not-italic">A lasting</span>
                  <br />
                  commitment to
                  <br />
                  sustainability
                </h1>
              </MotionDiv>
              <MotionDiv delay={0.1}>
                <p className="text-brand-navy/80 text-base leading-relaxed mb-3 max-w-xl">
                  Every decision we make today, from sourcing to final delivery, is a step
                  toward a more resilient future. Sustainability for us isn&apos;t a destination
                  – it&apos;s a daily practice that shapes our future, and the future of paper.
                </p>
                <p className="text-brand-navy/80 text-base leading-relaxed mb-10 max-w-xl">
                  As a trusted partner, we work to ensure that paper remains a sustainable
                  choice for generations to come – for our customers, for society, for the
                  planet.
                </p>
              </MotionDiv>
              <MotionDiv delay={0.2}>
                <Link href="/contact" className="btn-primary">
                  Check Price & Availability
                  <span className="btn-icon-badge">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* ── PAPER WITH A BETTER PURPOSE ── (same 2×2 image grid + text layout as before) */}
        <MotionSection className="section-padding py-14 lg:py-20 bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: 2×2 image grid — same images as Home/About mosaic */}
              <MotionDiv direction="left">
                <div className="grid grid-cols-2 gap-3" style={{ height: "420px" }}>
                  <div className="relative rounded-2xl overflow-hidden h-full">
                    <Image
                      src="/figma/paper-roll.jpg"
                      alt="Brown paper roll close-up"
                      fill
                      sizes="25vw"
                      className="object-cover object-bottom"
                    />
                  </div>
                  <div className="flex flex-col gap-3 h-full">
                    <div className="relative rounded-2xl overflow-hidden flex-1">
                      <Image
                        src="/images/hero/slide-4.jpg"
                        alt="Folded speciality paper sheets in warm tones"
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden flex-1">
                      <Image
                        src="/figma/colored-papers.jpg"
                        alt="Vibrant purple and blue paper textures"
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </MotionDiv>

              {/* Right: chip + heading + body */}
              <div className="flex flex-col gap-5">
                <MotionDiv delay={0.1}>
                  {/* Blue variant chip — Figma: border/text #00449A, distinct from site-wide orange chip */}
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.035em] rounded-full px-3 py-1.5 bg-white border"
                    style={{ color: "#00449A", borderColor: "#00449A" }}
                  >
                    Sustainability
                  </span>
                </MotionDiv>
                <MotionDiv delay={0.15}>
                  <h2
                    className="font-sans font-medium"
                    style={{
                      fontSize: "clamp(1.75rem,3vw,2.5rem)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.04em",
                      color: "#262626",
                    }}
                  >
                    Paper With a{" "}
                    <span className="text-brand-orange">Better Purpose</span>
                  </h2>
                </MotionDiv>
                <MotionDiv delay={0.2}>
                  <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm">
                    <p>
                      At Mahaveer Papers, sustainability begins with responsible sourcing. As an
                      FSC-certified company, we are committed to supplying high-quality papers
                      from responsible and trusted sources. Our papers are selected to meet high
                      environmental standards while delivering the performance required for
                      premium printing and packaging.
                    </p>
                    <p>
                      Paper is made from renewable natural fibres. It is biodegradable and
                      recyclable, making it one of the most environmentally responsible mediums
                      for communication, printing and packaging. When sourced responsibly and
                      recycled correctly, paper can be reused and returned to the natural cycle
                      with minimal environmental impact.
                    </p>
                  </div>
                </MotionDiv>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ── OUR COMMITMENT ── alternating image + text rows (same layout as before) */}
        <MotionSection className="bg-white pb-16 lg:pb-20">
          <div className="container-max section-padding">
            <MotionDiv className="text-center mb-10 lg:mb-14">
              <h2
                className="font-sans font-semibold"
                style={{
                  fontSize: "clamp(1.5rem,2.5vw,2rem)",
                  lineHeight: 1.5,
                  color: "#202020",
                }}
              >
                Our commitment:
              </h2>
            </MotionDiv>

            <div className="flex flex-col gap-10 lg:gap-14">
              {actions.map((action, i) => (
                <MotionDiv key={action.id} delay={0.08 + i * 0.06}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${action.imageLeft ? "" : ""}`}>

                    {/* Text block */}
                    <div className={action.imageLeft ? "lg:order-2" : "lg:order-1"}>
                      <h3
                        className="font-sans font-semibold mb-4"
                        style={{ fontSize: "clamp(1.4rem,2vw,1.5rem)", lineHeight: 1.333, color: "#202020" }}
                      >
                        {action.title}
                      </h3>
                      <p
                        className="mb-6 max-w-md"
                        style={{ fontSize: "16px", lineHeight: "24px", letterSpacing: "0.16px", color: "#2E2E2E" }}
                      >
                        {action.body}
                      </p>
                      {"cta" in action && action.cta && (
                        <Link
                          href={action.cta.href}
                          className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0d1b2a]"
                        >
                          {action.cta.label}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {/* Learn more — icon-left circular badge, matches Figma "Component 2" */}
                      <Link
                        href="/contact"
                        className="group relative inline-flex h-8 items-center rounded-full pl-10 pr-5 text-sm font-medium transition-colors"
                        style={{ color: "#2E2E2E" }}
                      >
                        <span
                          className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform group-hover:translate-x-0.5"
                          style={{ borderColor: "#2E2E2E" }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="M1 9L9 1M9 1H2.5M9 1V7.5" stroke="#2E2E2E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        Speak to a Paper Specialist
                      </Link>
                    </div>

                    {/* Image block */}
                    <div className={action.imageLeft ? "lg:order-1" : "lg:order-2"}>
                      <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                        <Image
                          src={action.image}
                          alt={action.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Choose Paper Responsibly — closing note, same simple text style as the rest of the page */}
            <MotionDiv delay={0.3}>
              <p className="text-center text-gray-600 leading-relaxed text-sm max-w-2xl mx-auto mt-4">
                Every paper has different characteristics, certifications and applications. Our
                team can help you select the right paper based on your printing process,
                packaging requirement and sustainability preference.
              </p>
              <p className="text-center text-gray-500 text-xs italic leading-relaxed max-w-2xl mx-auto mt-4">
                <span className="font-semibold not-italic">Good to know:</span> Some speciality
                synthetic and non-tearable media have different biodegradability and recycling
                properties. Please refer to the individual product information or contact our
                team for guidance.
              </p>
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
