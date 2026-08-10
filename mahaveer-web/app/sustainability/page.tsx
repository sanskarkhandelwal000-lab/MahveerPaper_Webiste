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
    "How Mahaveer Papers selects responsible mills, verifies FSC and recycled-content claims, and helps printers choose sustainable speciality papers.",
  alternates: { canonical: "/sustainability" },
};

// Revision brief: remove UPM's Climate Action Roadmap / 2030 targets / EUDR
// language (copied content, not Mahaveer's own). Rebuild around Mahaveer's
// actual role — a curator and stockist that selects and verifies ranges from
// certified mills — and ground every claim in real per-product data rather
// than unsubstantiated company-wide statements.
const actions = [
  {
    id: "sourcing",
    title: "Responsible Sourcing",
    body: "Mahaveer Papers is an FSC-certified company, and a large part of our portfolio carries FSC certification. Not every product does — so we show the certification status on every product page, and you're welcome to browse our FSC-certified range online or call our team to check a specific product before you buy.",
    image: "/images/mahaveer/sustainability-sourcing.jpg",
    imageAlt: "Responsible Sourcing card next to an FSC certificate of registration and swing tags",
    imageLeft: false,
    cta: { label: "Browse FSC-Certified Products", href: "/products?fsc=1" },
  },
  {
    id: "certified-ranges",
    title: "Certified & Alternative-Fibre Ranges",
    body: "Many ranges in our catalogue carry FSC Mix Credit where applicable, and a number stock recycled or alternative-fibre content — for example, our Pure Bamboo Natural range uses renewable bamboo fibre. We show the exact certification and fibre note on every product page instead of a single sustainability badge for the whole catalogue.",
    image: "/images/mahaveer/sustainability-certified.jpg",
    imageAlt: "Certified & Alternative-Fibre Ranges card next to FSC Mix and Pure Bamboo Natural swatches",
    imageLeft: true,
  },
  {
    id: "recyclability",
    title: "Recyclability & End-of-Life",
    body: "All of our products are both biodegradable and recyclable, with one exception: our Non-Tearable media range is not biodegradable, though it remains fully recyclable. We flag this clearly on the Non-Tearable product page rather than applying one blanket claim across the whole range.",
    image: "/images/mahaveer/sustainability-recyclability.jpg",
    imageAlt: "Recyclability & End-of-Life card next to recyclable paper packaging and synthetic-media swing tags",
    imageLeft: false,
  },
  {
    id: "guidance",
    title: "Practical Guidance, Not Guesswork",
    body: "Choosing a sustainable paper is rarely just one decision — it depends on the fibre, the finish, the certification you need and how the piece will be used or disposed of. Our team helps you weigh those trade-offs for your specific job, and points you to the mill or certificate documentation when you need it for a client or compliance requirement.",
    image: "/images/mahaveer/sustainability-guidance.jpg",
    imageAlt: "A paper selection guide sheet being marked up alongside FSC certification documents",
    imageLeft: true,
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
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,25,35,0.35) 0%, rgba(15,25,35,0.8) 60%, rgba(15,25,35,0.95) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 container-max section-padding pt-32 w-full">
            <div className="max-w-3xl">
              <MotionDiv>
                <h1
                  className="font-display italic font-normal text-white leading-[1.0] mb-7"
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
                <p className="text-white/80 text-base leading-relaxed mb-3 max-w-xl">
                  Every decision we make today, from sourcing to final delivery, is a step
                  toward a more resilient future. Sustainability for us isn&apos;t a destination
                  – it&apos;s a daily practice that shapes our future, and the future of paper.
                </p>
                <p className="text-white/80 text-base leading-relaxed mb-10 max-w-xl">
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

        {/* ── WHAT MAKES PAPER SUSTAINABLE? ── */}
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
                    About Mahaveer Papers
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
                    What makes paper{" "}
                    <span className="text-brand-orange">sustainable?</span>
                  </h2>
                </MotionDiv>
                <MotionDiv delay={0.2}>
                  <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm">
                    <p>
                      Paper is a renewable material when it&apos;s sourced from wood harvested
                      in sustainably managed forests. Healthy, well-managed forests act as
                      carbon sinks and support the circular economy — paper made this way can
                      be recycled and reused many times over before it&apos;s finally
                      biodegraded.
                    </p>
                    <p>
                      What separates a genuinely sustainable range from a generic claim is
                      verification: an FSC or equivalent certificate, a documented recycled or
                      alternative-fibre content, and clarity on what happens at end of life.
                      That&apos;s the standard we hold every range we stock to, and the detail
                      we show on each product page.
                    </p>
                  </div>
                </MotionDiv>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ── EXPLORE OUR ACTIONS ── alternating image + text rows */}
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
                Explore our actions:
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
                        Learn more
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
          </div>
        </MotionSection>

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
