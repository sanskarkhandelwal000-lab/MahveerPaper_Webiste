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
    "Mahaveer Papers is committed to sustainable paper sourcing, eco-friendly manufacturing, and building a greener future for the paper industry.",
  alternates: { canonical: "/sustainability" },
};

const actions = [
  {
    id: "climate",
    title: "Climate",
    body: "We are dedicated to reducing the carbon footprint of our paper. Our Climate Action Roadmap outlines our commitments and targets, including a significant reduction in CO₂ emissions by 2030.",
    image: "https://images.unsplash.com/photo-1500049242364-5f500807cdd7?w=900&q=80",
    imageAlt: "Two hikers pausing to look at a mountain view",
    imageLeft: false,
  },
  {
    id: "nature",
    title: "Nature & Forestry",
    body: "Sustainable forestry and biodiversity are integral to our operations. We ensure that our wood sourcing practices are responsible and that we contribute to the preservation of natural habitats. We also comply with the European Union Deforestation Regulation (EUDR).",
    image: "https://images.unsplash.com/photo-1623612374192-bb28178ed476?w=900&q=80",
    imageAlt: "Butterfly on a leaf in nature",
    imageLeft: true,
  },
  {
    id: "people",
    title: "People & Society",
    body: "We believe in creating a positive impact on society through our business practices. Our focus on social responsibility includes promoting safety, diversity, and community engagement.",
    image: "https://images.unsplash.com/photo-1758518727477-3885839edee7?w=900&q=80",
    imageAlt: "Colleagues talking on a sofa in a modern office",
    imageLeft: false,
  },
  {
    id: "resources",
    title: "Resources & Certification",
    body: "We leverage extensive data, industry expertise, and recognized certifications to demonstrate our ongoing commitment to sustainability. This offers trusted assurance to all our stakeholders.",
    image: "https://images.unsplash.com/photo-1728496120908-4fa5eb92ebee?w=900&q=80",
    imageAlt: "Person writing on a document",
    imageLeft: true,
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>

        {/* ── HERO ── */}
        <section
          className="relative min-h-[85vh] flex items-end overflow-hidden pb-20 lg:pb-32"
          aria-label="Sustainability hero"
        >
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80"
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
                  sustainablity
                </h1>
              </MotionDiv>
              <MotionDiv delay={0.1}>
                <p className="text-white/80 text-base leading-relaxed mb-3 max-w-xl">
                  Every decision we make today, from sourcing to final delivery, is a step
                  toward a more resilient future. Sustainability for us isn't a destination
                  – it's a daily practice that shapes our future, and the future of paper.
                </p>
                <p className="text-white/80 text-base leading-relaxed mb-10 max-w-xl">
                  As a trusted partner, we work to ensure that paper remains a sustainable
                  choice for generations to come – for our customers, for society, for the
                  planet.
                </p>
              </MotionDiv>
              <MotionDiv delay={0.2}>
                <Link href="/contact" className="btn-primary">
                  Request Free Quote
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
                        src="/figma/hero-bg.jpg"
                        alt="Colorful paper rolls"
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
                      Paper is a renewable material when sourced from wood harvested in
                      sustainably managed forests. Healthy forests act as carbon sinks,
                      absorbing CO₂ from the atmosphere and helping mitigate climate change.
                      Through responsible sourcing and sustainable manufacturing processes,
                      paper becomes an invaluable resource that supports the circular economy.
                      Even as much as 70% of graphic paper produced in Europe is being
                      recycled and reused.
                    </p>
                    <p>
                      Compared to other industries, paper manufacturing has significant
                      potential to be truly sustainable. The paper industry is highly
                      certified, relying on a fully renewable raw material and producing a
                      recyclable product. By using renewable resources to create recyclable
                      goods, the industry contributes to a sustainable future.
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
