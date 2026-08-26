import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompactCTA } from "@/components/home/CompactCTA";
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
    cta: { label: "Browse FSC-Certified Papers", href: "/products?fsc=1" },
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

        {/* ── HERO — "Paper With a Better Purpose" ──
            Revision brief: the hero and the "Paper With a Better Purpose" intro below it
            said much the same thing twice — merged into this one section. */}
        <section
          className="relative min-h-screen flex items-end overflow-hidden pb-20 lg:pb-28"
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
                  className="font-sans font-medium text-brand-navy leading-[1.1] mb-6"
                  style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", letterSpacing: "-0.02em" }}
                >
                  Paper With a <span className="text-brand-orange">Better Purpose</span>
                </h1>
              </MotionDiv>
              <MotionDiv delay={0.1}>
                <p className="text-brand-navy/80 text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
                  Mahaveer Papers is an FSC-certified company. Paper is a biodegradable and
                  recyclable medium of communication, and we supply papers selected to meet
                  high environmental standards.
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

        {/* ── OUR COMMITMENT ── alternating image + text rows (same layout as before) */}
        <MotionSection className="bg-white pt-20 lg:pt-28 pb-16 lg:pb-20">
          <div className="container-max section-padding">
            <MotionDiv className="text-center mb-14 lg:mb-16 max-w-xl mx-auto">
              {/* Blue variant chip — matches the hero's own "Sustainability" chip style */}
              <span
                className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.035em] rounded-full px-3 py-1.5 bg-white border"
                style={{ color: "#00449A", borderColor: "#00449A" }}
              >
                Our Commitment
              </span>
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
                      {/* Revision brief ("Card actions"): one action per card — the
                          "Speak to a Paper Specialist" link that used to repeat on
                          every card is now the single common CTA at the bottom of
                          the page instead. */}
                      {"cta" in action && action.cta && (
                        <Link
                          href={action.cta.href}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0d1b2a]"
                        >
                          {action.cta.label}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
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
                <span className="font-semibold not-italic">Important Product Exception:</span>{" "}
                NT Matt and Paperlike Synthetic are non-biodegradable but recyclable — please
                refer to the individual product information or contact our team for guidance on
                any other speciality synthetic media.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── FINAL CTA ── revision brief: sustainability-specific heading/copy/buttons,
            doubling as the one common "Speak to a Paper Specialist" CTA for this page. */}
        <CompactCTA
          heading="Need Help Choosing Responsibly?"
          body="Tell us your application and certification requirement. Our team will help you identify suitable options."
          primary={{ label: "Speak to a Paper Specialist", href: "/contact?applicationType=Sustainability%2FFSC+Requirement" }}
          secondary={{ label: "Explore FSC-Certified Papers", href: "/products?fsc=1" }}
        />
      </main>
      <Footer />
    </>
  );
}
