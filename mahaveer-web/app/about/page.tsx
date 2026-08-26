import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, BookOpen, Building2, ShieldCheck, Lightbulb, Compass, Handshake, MapPin, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/home/About";
import { FAQ } from "@/components/home/FAQ";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";
import { companyFaqs } from "@/data/faqs";

// Revision brief (About Us Page Brief):
// - Retain H1 "Three Decades of Speciality-Paper Expertise".
// - Custom title/description (not the generic "world-class ... for every industry" line).
// - OG image should show genuine Mahaveer Papers stock/premises, not a stock photo.
export const metadata: Metadata = {
  title: { absolute: "About Mahaveer Papers | Speciality Paper Experts Since 1992" },
  description:
    "Learn about Mahaveer Papers, a speciality-paper sourcing, stocking and distribution company established in Bengaluru in 1992, with a presence in Ahmedabad.",
  alternates: { canonical: "/about" },
  openGraph: {
    images: [{ url: "/images/mahaveer/about-hero.jpg" }],
  },
};

const whyTrust = [
  "Established in 1992 with more than three decades of market experience.",
  "Long-standing relationships built through honest recommendations and dependable service.",
  "Presence in Bengaluru and Ahmedabad.",
  "Practical knowledge of paper, printing and finishing requirements.",
  "An FSC-certified company committed to responsible sourcing.",
  "Personal assistance, samples and guidance before customers make a decision.",
];

const values = [
  { icon: Compass, title: "Knowledge", body: "Recommendations based on experience, not guesswork." },
  { icon: ShieldCheck, title: "Reliability", body: "Consistency in communication, quality and service." },
  { icon: Handshake, title: "Relationships", body: "Long-term partnerships are more important than one-time transactions." },
  { icon: Lightbulb, title: "Responsibility", body: "Clear information and responsibly sourced options wherever applicable." },
];

const locations = [
  { name: "Bengaluru", role: "Head Office", detail: "Cottonpet, Bengaluru" },
  { name: "Ahmedabad", role: "Branch Office", detail: "Dudheshwar, Ahmedabad" },
];

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
                <p className="text-white/80 text-base leading-relaxed mb-10 max-w-lg">
                  Since 1992, Mahaveer Papers has helped printers, designers, packaging
                  converters and brands choose paper with confidence. Our experience,
                  dependable sourcing and practical knowledge have shaped relationships
                  that continue across generations.
                </p>
              </MotionDiv>

              <MotionDiv delay={0.2}>
                <Link
                  href="/contact?applicationType=General+Paper+Requirement"
                  className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-navy/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  Speak to Our Team
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange flex-shrink-0">
                    <ChevronRight className="h-3.5 w-3.5 text-white" />
                  </span>
                </Link>
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* ── OUR JOURNEY ── */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-white">
          <div className="container-max max-w-3xl">
            <MotionDiv>
              <span className="chip mb-4 inline-flex">
                <BookOpen className="h-3.5 w-3.5" />
                Our Journey
              </span>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <p className="text-[18px] leading-[27px] text-brand-body">
                Established in Bengaluru in 1992, Mahaveer Papers began with a commitment
                to dependable service and the right material for every requirement. Over
                three decades, we have grown through long-standing customer relationships,
                carefully selected paper collections and a deep understanding of the print
                and paper trade. Today, our presence extends across Bengaluru and Ahmedabad
                while the same personal approach continues to guide the business.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── WHO WE ARE TODAY ── */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-brand-gray">
          <div className="container-max max-w-3xl">
            <MotionDiv>
              <span className="chip mb-4 inline-flex">
                <Building2 className="h-3.5 w-3.5" />
                Who We Are Today
              </span>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <p className="text-[18px] leading-[27px] text-brand-body">
                Mahaveer Papers is a speciality-paper sourcing, stocking and distribution
                company. We work with trusted domestic and international mills, maintain
                selected papers in ready stock and help customers make informed choices
                through practical guidance.{" "}
                <span className="font-medium text-brand-ink">
                  We are not a paper manufacturer
                </span>{" "}
                — every recommendation is grounded in what we source, stock and know
                firsthand.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── ABOUT SECTION (short homepage-style summary, reused) ── */}
        <About />

        {/* ── WHY CUSTOMERS TRUST MAHAVEER ── */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-white">
          <div className="container-max max-w-4xl">
            <MotionDiv>
              <h2 className="font-sans font-medium text-display-md text-brand-ink mb-10">
                Why Customers Trust{" "}
                <span className="text-brand-orange">Mahaveer</span>
              </h2>
            </MotionDiv>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {whyTrust.map((point, i) => (
                <MotionDiv key={point} delay={0.05 + i * 0.05}>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                    </span>
                    <span className="text-[16px] leading-[24px] text-brand-body">{point}</span>
                  </li>
                </MotionDiv>
              ))}
            </ul>
          </div>
        </MotionSection>

        {/* ── VALUES ── */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-brand-gray">
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-medium text-display-md text-brand-ink mb-10 text-center">
                Our <span className="text-brand-orange">Values</span>
              </h2>
            </MotionDiv>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <MotionDiv key={value.title} delay={0.05 + i * 0.06}>
                  <div className="h-full rounded-2xl bg-white border border-gray-200 p-6 flex flex-col gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10">
                      <value.icon className="h-5 w-5 text-brand-orange" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-sans font-semibold text-brand-ink text-lg">{value.title}</h3>
                    <p className="text-[15px] leading-relaxed text-brand-body">{value.body}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── PEOPLE AND RELATIONSHIPS ── */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-white">
          <div className="container-max max-w-3xl">
            <MotionDiv>
              <span className="chip mb-4 inline-flex">
                <Handshake className="h-3.5 w-3.5" />
                People &amp; Relationships
              </span>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <p className="text-[18px] leading-[27px] text-brand-body">
                Behind Mahaveer Papers is a team that understands paper and listens
                carefully to customer requirements. Our approach is personal: understand
                the need, recommend responsibly and support the customer beyond the sale.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── LOCATIONS ── */}
        <MotionSection className="section-padding py-20 lg:py-28 bg-brand-gray">
          <div className="container-max max-w-3xl">
            <MotionDiv>
              <h2 className="font-sans font-medium text-display-md text-brand-ink mb-10">
                Our <span className="text-brand-orange">Locations</span>
              </h2>
            </MotionDiv>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {locations.map((loc, i) => (
                <MotionDiv key={loc.name} delay={0.05 + i * 0.08}>
                  <div className="rounded-2xl bg-white border border-gray-200 p-6 flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                      <MapPin className="h-5 w-5 text-brand-orange" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand-orange mb-1">
                        {loc.role}
                      </p>
                      <h3 className="font-sans font-semibold text-brand-ink text-lg mb-1">{loc.name}</h3>
                      <p className="text-[15px] text-brand-body">{loc.detail}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
            <MotionDiv delay={0.2}>
              <p className="mt-6 text-sm text-brand-body">
                Full addresses and contact details are on our{" "}
                <Link href="/contact" className="text-brand-orange font-medium underline underline-offset-2">
                  Contact page
                </Link>
                .
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── FAQ — company-related questions only (revision brief) ── */}
        <FAQ
          items={companyFaqs}
          eyebrow="About Mahaveer Papers"
          heading={
            <>
              Company{" "}
              <span className="text-brand-orange">FAQs</span>
            </>
          }
          subtitle="A few common questions about who we are and how we work."
        />

        {/* ── CLOSING CTA ── */}
        <MotionSection className="relative overflow-hidden py-24 lg:py-32">
          <Image
            src="/images/mahaveer/cta-ready-to-elevate.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#171717]/60" aria-hidden="true" />

          <div className="relative z-10 container-max section-padding text-center">
            <MotionDiv delay={0.1}>
              <h2 className="font-sans font-medium text-display-lg text-white mx-auto mb-5 max-w-3xl">
                Let&apos;s Build Something{" "}
                <span className="text-brand-orange">Beyond Ordinary</span>
              </h2>
            </MotionDiv>

            <MotionDiv delay={0.15}>
              <p className="text-[#E5E5E5] text-[18px] leading-[27px] max-w-[600px] mx-auto mb-10">
                Whether you are exploring a new idea or looking for dependable paper
                support, our team is here to guide you.
              </p>
            </MotionDiv>

            <MotionDiv delay={0.2} className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact?applicationType=General+Paper+Requirement" className="btn-outline">
                Speak to a Paper Specialist
                <span className="btn-icon-badge">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link href="/contact" className="btn-light">
                Contact Us
                <span className="btn-icon-badge">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </MotionDiv>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </>
  );
}
