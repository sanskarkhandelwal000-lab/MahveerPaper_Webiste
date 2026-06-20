import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Leaf, TreePine, Users, Award } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/home/FAQ";
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
    icon: Leaf,
    body: "We are dedicated to reducing the carbon footprint of our paper. Our Climate Action Roadmap outlines our commitments and targets, including a significant reduction in CO₂ emissions by 2030.",
  },
  {
    id: "nature",
    title: "Nature & Forestry",
    icon: TreePine,
    body: "Sustainable forestry and biodiversity are integral to our operations. We ensure that our wood sourcing practices are responsible and that we contribute to the preservation of natural habitats. We also comply with the European Union Deforestation Regulation (EUDR).",
  },
  {
    id: "people",
    title: "People & Society",
    icon: Users,
    body: "We believe in creating a positive impact on society through our business practices. Our focus on social responsibility includes promoting safety, diversity, and community engagement.",
  },
  {
    id: "resources",
    title: "Resources & Certification",
    icon: Award,
    body: "We leverage extensive data, industry expertise, and recognised certifications to demonstrate our ongoing commitment to sustainability. This offers trusted assurance to all our stakeholders.",
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ── HERO ── Figma: "A lasting / commitment to / sustainablity" fs=128 */}
        <section
          className="relative min-h-[85vh] flex items-end overflow-hidden pb-20 lg:pb-32"
          aria-label="Sustainability hero"
        >
          <Image
            src="https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=1920&q=80"
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
                  className="font-display italic text-white leading-[1.0] mb-7"
                  style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)" }}
                >
                  {/* Figma: "A lasting / commitment to / sustainablity" fs=128 — line 1 orange (matches Home/About pattern) */}
                  <span className="text-brand-orange not-italic font-bold">A lasting</span>
                  <br />
                  commitment to
                  <br />
                  sustainability
                </h1>
              </MotionDiv>

              <MotionDiv delay={0.1}>
                <p className="text-white/80 text-base leading-relaxed mb-3 max-w-xl">
                  Every decision we make today, from sourcing to final delivery, is a step
                  toward a more resilient future. Sustainability for us isn't a destination
                  – it's a daily practice that shapes our future, and the future of paper.
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xl">
                  As a trusted partner, we work to ensure that paper remains a sustainable
                  choice for generations to come – for our customers, for society, for the
                  planet.
                </p>
              </MotionDiv>

              <MotionDiv delay={0.2}>
                <Link
                  href="/contact"
                  className="btn-primary"
                >
                  Request Free Quote
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </Link>
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES PAPER SUSTAINABLE? ── */}
        {/* Figma: chip at x=1022, heading at x=990, text at x=990 (right half of 1920px) */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left: decorative image */}
              <MotionDiv direction="left">
                <div className="relative h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-green-50">
                  <Image
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                    alt="Sustainable forestry"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </MotionDiv>

              {/* Right: chip + heading + text */}
              <div className="flex flex-col gap-5 lg:pt-4">
                <MotionDiv delay={0.1}>
                  <span className="chip inline-flex">About Mahaveer papers</span>
                </MotionDiv>
                <MotionDiv delay={0.15}>
                  <h2 className="font-sans font-bold text-display-md text-brand-navy leading-tight">
                    What makes paper{" "}
                    <span className="font-display italic text-brand-orange">sustainable?</span>
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

        {/* ── EXPLORE OUR ACTIONS ── */}
        {/* Figma: "Explore our actions:" heading + 2×2 card grid */}
        <MotionSection className="section-padding py-20 lg:py-24 bg-brand-cream">
          <div className="container-max">
            <MotionDiv className="text-center mb-12 lg:mb-16">
              <h2 className="font-display italic text-brand-orange text-display-md">
                Explore our actions:
              </h2>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
              {actions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <MotionDiv key={action.id} delay={0.1 + i * 0.08}>
                    <div className="bg-white rounded-2xl p-7 lg:p-9 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 shrink-0">
                        <Icon className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy text-xl lg:text-2xl mb-3">
                          {action.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{action.body}</p>
                      </div>
                      <div className="mt-auto pt-2">
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold hover:gap-3 transition-all"
                        >
                          Learn more
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </div>
        </MotionSection>

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
