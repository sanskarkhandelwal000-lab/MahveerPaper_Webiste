import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DigiLuxCatalog } from "@/components/products/DigiLuxCatalog";
import { WhyDigiluxTabs } from "@/components/digilux/WhyDigiluxTabs";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "DigiLux Papers",
  description:
    "DigiLux is Mahaveer Papers' dedicated brand for premium digital print media — speciality papers and self-adhesive solutions in the industry's most preferred 13 × 19 inch digital size.",
  alternates: { canonical: "/digilux" },
};

// Figma palette — DigiLux brand microsite (redesign, Aug 2026)
const OLIVE = "#7C7844";
const RUST = "#A63D12";
const NAVY_DARK = "#1D2939";

// Revision brief (Terminology): "Metallic Papers & Boards" and "Non-Tearable" used
// consistently (was "& Board" / "Non Tearable" without the hyphen).
const portfolioItems = [
  { label: "Premium white boards", image: "/images/mahaveer/eco-hb-white.jpg" },
  { label: "Texture Papers & Boards", image: "/images/mahaveer/textures-cream.jpg" },
  { label: "Metallic Papers & Boards", image: "/images/mahaveer/lustre-yellow-gold.jpg" },
  { label: "Non-Tearable & Clear Synthetic Sheets", image: "/images/mahaveer/nt-matt.jpg" },
  { label: "Chromo & Mirror Coat Self-Adhesive Sheets", image: "/images/mahaveer/vanor.jpg" },
  { label: "Gold & Silver Self-Adhesive Sheets", image: "/images/mahaveer/cloth-satin-gold.jpg" },
  { label: "PVC-Based Self-Adhesive Sheets", image: "/images/mahaveer/paperlike-synthetic.jpg" },
  { label: "Speciality Labels", image: "/images/mahaveer/digilux-crystal-ice.jpg" },
];

// Revision brief (Application cards): action-oriented copy naming the materials used,
// not mockup-instruction language (e.g. "highlighting paper quality" / "mockups").
const applications = [
  {
    title: "FMCG",
    body: "Create standout product packaging and shelf labels using textured and metallic boards.",
    image: "/figma/digilux2/app-fmcg.jpg",
  },
  {
    title: "Garment Tags",
    body: "Create premium hang tags using textured boards and speciality finishes.",
    image: "/figma/digilux2/app-garment-tags.jpg",
  },
  {
    title: "Cosmetic Labels",
    body: "Create refined skincare and beauty labels using premium white boards and metallics.",
    image: "/figma/digilux2/app-cosmetic-labels.jpg",
  },
  {
    title: "Visiting Cards",
    body: "Create distinctive short-run visiting cards using textured, metallic and premium boards.",
    image: "/figma/digilux2/app-visiting-cards.jpg",
  },
  {
    title: "Invitation Cards",
    body: "Create elegant invitation cards using textured paper, foil accents and premium boards.",
    image: "/figma/digilux2/app-invitation-cards.jpg",
  },
];

// Revision brief (section C): the proof strip under the intro — never more than four figures.
const proofStrip = ["55 SKUs", "13 × 19 Inches", "Low MOQ", "Ready Stock"];

// Figma: 4-point sparkle outline used on the merged "Prints Well. Cuts Well." card
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
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        {/* ── HERO ── paper-fan photo + headline (nav is the shared floating capsule) */}
        <section className="relative min-h-screen flex items-end overflow-hidden bg-black pb-20 lg:pb-28" aria-label="DigiLux hero">
          <Image
            src="/figma/digilux2/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
            aria-hidden="true"
          />

          <div className="relative z-10 container-max section-padding w-full">
            <MotionDiv>
              {/* Revision brief ("Parent brand"): the header keeps the Mahaveer Papers
                  logo on every page now, so DigiLux is positioned as a sub-brand here
                  in the hero instead — "DigiLux by Mahaveer Papers". */}
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5 text-sm font-semibold"
                style={{ borderColor: NAVY_DARK, color: NAVY_DARK }}
              >
                DigiLux by Mahaveer Papers
              </span>
              <h1
                className="font-display font-normal mb-4"
                style={{ fontSize: "clamp(2.5rem,5.5vw,4.75rem)", lineHeight: 1.05 }}
              >
                <span className="block" style={{ color: NAVY_DARK }}>Crafted for</span>
                <span className="block" style={{ color: RUST }}>Extraordinary Prints</span>
              </h1>
              <p className="text-base lg:text-xl mb-8" style={{ color: "rgba(29,41,57,0.75)" }}>
                Premium Digital Print Media by Mahaveer Papers
              </p>
            </MotionDiv>
            <MotionDiv delay={0.1} className="flex flex-wrap items-center gap-4">
              <Link
                href="/digilux#products"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: NAVY_DARK }}
              >
                Explore DigiLux Media
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact?applicationType=DigiLux+Sample+Pack"
                className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3.5 font-semibold transition-colors hover:bg-black/5"
                style={{ borderColor: NAVY_DARK, color: NAVY_DARK }}
              >
                Request a Sample Pack
              </Link>
            </MotionDiv>
          </div>
        </section>

        {/* ── WHAT IS DIGILUX? ── navy-to-blue gradient, collage image + copy, proof strip, wave into white */}
        <section
          className="relative overflow-hidden pt-20 pb-40 lg:pt-28 lg:pb-56"
          style={{ background: "linear-gradient(180deg, #0A131F 0%, #3D79C4 100%)" }}
        >
          <div className="container-max section-padding relative z-10">
            <MotionDiv>
              {/* Revision brief ("Broken heading"): render the name as text, not an
                  <Image> logo swapped in mid-sentence — that rendered as a missing/
                  broken name on slow connections and screen readers. */}
              <h2 className="font-sans font-semibold text-2xl sm:text-3xl mb-10 text-white">
                What is <span style={{ color: "#00C8B3" }}>DigiLux</span>?
              </h2>
            </MotionDiv>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <MotionDiv direction="left">
                <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#e8ddd0]">
                  <Image
                    src="/figma/digilux2/whatisdigilux.jpg"
                    alt="What is DigiLux — premium textured box crafted from DigiLux board"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-contain"
                  />
                </div>
              </MotionDiv>
              <MotionDiv delay={0.1}>
                <p className="font-display text-white/90 mb-10" style={{ fontSize: "clamp(1.1rem,1.7vw,1.4rem)", lineHeight: 1.6 }}>
                  DigiLux by Mahaveer Papers is a premium collection of cut-size media for
                  toner-based digital printing. Available primarily in the popular 13 × 19 inch
                  format, the collection includes textured boards, metallic boards, premium
                  white boards, self-adhesive sheets and selected speciality media.
                </p>
                {/* Proof strip — max four figures (revision brief, section C) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {proofStrip.map((fact) => (
                    <div key={fact} className="border-l-2 pl-3" style={{ borderColor: "#00C8B3" }}>
                      <p className="font-sans font-bold text-white text-lg lg:text-xl leading-tight">{fact}</p>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            </div>
          </div>

          {/* wave divider into white */}
          <svg
            className="absolute bottom-0 left-0 w-full text-white"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* ── MACHINE COMPATIBILITY ── moved near the top per revision brief (section D),
            ahead of Applications and the product listing. */}
        <MotionSection className="bg-white section-padding py-14 lg:py-20">
          <div className="container-max">
            <div
              className="rounded-2xl border-2 px-6 py-8 lg:px-10 lg:py-10"
              style={{ borderColor: "#00C8B3", backgroundColor: "#F0FBFA" }}
            >
              <h2 className="font-sans font-bold mb-3" style={{ fontSize: "clamp(1.35rem,2.2vw,1.75rem)", color: NAVY_DARK }}>
                Designed for Toner-Based Digital Printing
              </h2>
              <p className="text-[15px] lg:text-base leading-relaxed text-gray-600 max-w-3xl">
                Tested on selected Canon machines and used by customers operating Canon, Konica
                Minolta, Ricoh and Xerox digital presses. HP Indigo is not recommended. A trial is
                advised before production on any unverified machine.
              </p>
            </div>
          </div>
        </MotionSection>

        {/* ── PORTFOLIO CATEGORIES ── */}
        <MotionSection className="bg-white section-padding pb-20 lg:pb-28">
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-bold tracking-tight mb-4 text-brand-navy" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
                Our Portfolio
              </h2>
              <p className="mb-14 max-w-3xl text-[16px] text-gray-500">
                DigiLux offers a versatile collection for different digital-print and
                short-run requirements.
              </p>
            </MotionDiv>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
              {portfolioItems.map((item, i) => (
                <MotionDiv key={item.label} delay={0.03 + (i % 5) * 0.05}>
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100 shadow-sm">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-[15px] leading-snug text-gray-600">{item.label}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── APPLICATIONS ── */}
        <MotionSection className="section-padding py-20 lg:py-28" style={{ backgroundColor: NAVY_DARK }}>
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-bold tracking-tight mb-4 text-white" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
                Applications
              </h2>
              <p className="mb-14 max-w-4xl text-[16px] text-white/70 leading-relaxed">
                DigiLux helps digital printers produce premium short-run work using textured
                boards, metallic media, self-adhesive sheets and selected speciality materials.
              </p>
            </MotionDiv>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {applications.map((app, i) => (
                <MotionDiv key={app.title} delay={0.04 + i * 0.06}>
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={app.image}
                      alt={app.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-sans font-bold text-sm mb-2 tracking-wide" style={{ color: "#00C8B3" }}>
                    {app.title.toUpperCase()}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-white/70">{app.body}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── DIGILUX PRODUCT LISTING ── */}
        <MotionSection id="products" className="bg-white section-padding py-20 lg:py-28 scroll-mt-[92px]">
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-bold tracking-tight mb-4 text-brand-navy" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
                Products
              </h2>
              <p className="mb-12 max-w-3xl text-[16px] text-gray-500">
                Explore our curated range of premium digital print media, crafted to deliver exceptional quality,
                vibrant print performance, and versatile applications. From labels and packaging to stationery and
                branding, every product is designed to help your ideas stand out.
              </p>
            </MotionDiv>
            <DigiLuxCatalog />
          </div>
        </MotionSection>

        {/* ── WHY DIGILUX? / OUR JOURNEY ── two stacked sections, no tab interaction (section I) */}
        <MotionSection className="section-padding py-20 lg:py-28" style={{ backgroundColor: NAVY_DARK }}>
          <div className="container-max">
            <WhyDigiluxTabs />
          </div>
        </MotionSection>

        {/* ── PRINTS WELL. CUTS WELL. ── merged "Elevate Every Print" + "Built for Exceptional
            Printing" into one section (revision brief, section J) — parchment texture + pen. */}
        <MotionSection
          className="relative overflow-hidden py-20 lg:py-28"
          style={{
            backgroundColor: "#EFE9D8",
            backgroundImage: "url(/figma/digilux2/parchment-large.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="pointer-events-none absolute -top-2 right-4 h-64 w-72 lg:h-80 lg:w-96 lg:right-16 select-none">
            <Image
              src="/figma/digilux2/parchment-pen.jpg"
              alt=""
              fill
              sizes="400px"
              className="object-contain object-top mix-blend-multiply opacity-95"
              aria-hidden="true"
            />
          </div>
          <Sparkle className="pointer-events-none absolute left-10 top-10 h-10 w-10 lg:h-14 lg:w-14 opacity-70" />
          <div className="relative z-10 container-max section-padding">
            <MotionDiv>
              <h2 className="font-display font-normal mb-6 max-w-2xl" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", color: RUST }}>
                Prints Well. Cuts Well. Your Outputs Look Better.
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <p className="max-w-2xl text-[17px] leading-relaxed" style={{ color: OLIVE }}>
                DigiLux combines selected media, ready-stock availability and convenient quantities
                to help digital printers produce premium short-run work with confidence.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── SAMPLE-PACK CTA ── "Experience DigiLux" (revision brief, section K).
            This replaces the full general enquiry form — no ContactForm on this page. */}
        <MotionSection className="section-padding py-14 lg:py-20 bg-white">
          <div
            className="container-max flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-10 lg:px-12 lg:py-12"
            style={{ backgroundColor: "#1A2B3C" }}
          >
            <MotionDiv className="max-w-xl">
              <h2 className="font-display italic font-normal text-2xl lg:text-3xl mb-2" style={{ color: "#E9EEF5" }}>
                Experience DigiLux
              </h2>
              <p className="text-white/70 text-base border-l-2 pl-3" style={{ borderColor: "#00C8B3" }}>
                Request a sample pack containing selected textures, metallics, premium boards and speciality
                digital media.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.1} className="shrink-0">
              <Link
                href="/contact?applicationType=DigiLux+Sample+Pack"
                className="inline-flex items-center rounded-full px-7 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#00449A" }}
              >
                Request DigiLux Sample Pack
              </Link>
            </MotionDiv>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </>
  );
}
