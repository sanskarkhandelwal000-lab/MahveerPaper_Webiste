import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
    imageAlt: "Person on a mountain landscape",
    imageLeft: false,
  },
  {
    id: "nature",
    title: "Nature & Forestry",
    body: "Sustainable forestry and biodiversity are integral to our operations. We ensure that our wood sourcing practices are responsible and that we contribute to the preservation of natural habitats. We also comply with the European Union Deforestation Regulation (EUDR).",
    image: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=900&q=80",
    imageAlt: "Butterfly on a leaf in nature",
    imageLeft: true,
  },
  {
    id: "people",
    title: "People & Society",
    body: "We believe in creating a positive impact on society through our business practices. Our focus on social responsibility includes promoting safety, diversity, and community engagement.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80",
    imageAlt: "People in a meeting",
    imageLeft: false,
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
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES PAPER SUSTAINABLE? ── */}
        <MotionSection className="section-padding py-14 lg:py-20 bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: 2×2 image grid */}
              <MotionDiv direction="left">
                <div className="grid grid-cols-2 gap-3" style={{ height: "420px" }}>
                  <div className="relative rounded-2xl overflow-hidden h-full">
                    <Image
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
                      alt="Wood grain texture"
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3 h-full">
                    <div className="relative rounded-2xl overflow-hidden flex-1">
                      <Image
                        src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80"
                        alt="Colorful paper rolls"
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden flex-1">
                      <Image
                        src="https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=500&q=80"
                        alt="Abstract colorful paper"
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
                  <span className="chip inline-flex">About Mahaveer Papers</span>
                </MotionDiv>
                <MotionDiv delay={0.15}>
                  <h2 className="font-sans font-bold text-brand-navy leading-tight"
                    style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)" }}>
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

        {/* ── EXPLORE OUR ACTIONS ── alternating image + text rows */}
        <MotionSection className="bg-white pb-16 lg:pb-20">
          <div className="container-max section-padding">
            <MotionDiv className="text-center mb-10 lg:mb-14">
              <h2
                className="font-sans font-bold text-brand-navy"
                style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)" }}
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
                        className="font-sans font-bold text-brand-navy mb-4"
                        style={{ fontSize: "clamp(1.4rem,2vw,1.75rem)" }}
                      >
                        {action.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
                        {action.body}
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 text-brand-navy text-sm font-medium hover:text-brand-orange transition-colors"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
