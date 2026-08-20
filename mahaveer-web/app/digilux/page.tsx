import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { DigiLuxCatalog } from "@/components/products/DigiLuxCatalog";
import { WhyDigiluxTabs } from "@/components/digilux/WhyDigiluxTabs";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "DigiLux Papers",
  description:
    "DIGILUX is Mahaveer Papers' dedicated brand for premium digital print media — specialty papers and self-adhesive solutions in the industry's most preferred 13 × 19 inch digital size.",
  alternates: { canonical: "/digilux" },
};

// Figma palette — DigiLux brand microsite (redesign, Aug 2026)
const OLIVE = "#7C7844";
const RUST = "#A63D12";
const ELEVATE_BROWN = "#6E5A36";
const NAVY_DARK = "#1D2939";

const portfolioItems = [
  { label: "Premium white boards", image: "/images/mahaveer/eco-hb-white.jpg" },
  { label: "Texture Papers & Boards", image: "/images/mahaveer/textures-cream.jpg" },
  { label: "Metallic Papers & Board", image: "/images/mahaveer/lustre-yellow-gold.jpg" },
  { label: "Non Tearable & Clear Synthetic Sheets", image: "/images/mahaveer/nt-matt.jpg" },
  { label: "Chromo & Mirror Coat Self-Adhesive Sheets", image: "/images/mahaveer/vanor.jpg" },
  { label: "Gold & Silver Self-Adhesive Sheets", image: "/images/mahaveer/cloth-satin-gold.jpg" },
  { label: "PVC-Based Self-Adhesive Sheets", image: "/images/mahaveer/paperlike-synthetic.jpg" },
  { label: "Speciality Labels", image: "/images/mahaveer/digilux-crystal-ice.jpg" },
];

const applications = [
  {
    title: "FMCG",
    body: "Premium product packaging with eye-catching shelf labels.",
    image: "/figma/digilux2/app-fmcg.jpg",
  },
  {
    title: "Garment Tags",
    body: "Luxury fashion hang tags showcasing premium paper finishes.",
    image: "/figma/digilux2/app-garment-tags.jpg",
  },
  {
    title: "Cosmetic Labels",
    body: "High-end skincare and beauty labels with refined printing.",
    image: "/figma/digilux2/app-cosmetic-labels.jpg",
  },
  {
    title: "Visiting Cards",
    body: "Minimal, premium business card mockups highlighting paper quality.",
    image: "/figma/digilux2/app-visiting-cards.jpg",
  },
  {
    title: "Invitation Cards",
    body: "Elegant invitation cards featuring textured paper, embossing, or foil accents.",
    image: "/figma/digilux2/app-invitation-cards.jpg",
  },
];

// Figma: 4-point sparkle outline used on the "Built for Exceptional Printing" card
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
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: NAVY_DARK }}
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3.5 font-semibold transition-colors hover:bg-black/5"
                style={{ borderColor: NAVY_DARK, color: NAVY_DARK }}
              >
                Request a Sample
              </Link>
            </MotionDiv>
          </div>
        </section>

        {/* ── ABOUT DIGILUX ── navy-to-blue gradient, collage image + copy, wave into white */}
        <section
          className="relative overflow-hidden pt-20 pb-40 lg:pt-28 lg:pb-56"
          style={{ background: "linear-gradient(180deg, #0A131F 0%, #3D79C4 100%)" }}
        >
          <div className="container-max section-padding relative z-10">
            <MotionDiv>
              <h2 className="font-sans font-semibold text-2xl sm:text-3xl mb-10 flex items-center gap-3 flex-wrap text-white">
                About
                <Image
                  src="/images/digilux-logo.png"
                  alt="DigiLux"
                  width={124}
                  height={47}
                  className="h-8 w-auto lg:h-9"
                />
              </h2>
            </MotionDiv>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <MotionDiv direction="left">
                <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/figma/digilux2/about-collage.jpg"
                    alt="Rolled colourful specialty papers"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>
              </MotionDiv>
              <MotionDiv delay={0.1}>
                <p className="font-display text-white/90" style={{ fontSize: "clamp(1.1rem,1.7vw,1.4rem)", lineHeight: 1.6 }}>
                  DIGILUX is a signature collection of premium digital print media and self-adhesive
                  solutions—crafted for those who expect more from every print. Precision-cut to 13 × 19 inches
                  and available across 55 distinctive SKUs.
                </p>
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

        {/* ── OUR PORTFOLIO ── */}
        <MotionSection className="bg-white section-padding pb-20 lg:pb-28 -mt-px">
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-bold tracking-tight mb-4 text-brand-navy" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
                Our Portfolio
              </h2>
              <p className="mb-14 max-w-3xl text-[16px] text-gray-500">
                Explore a diverse portfolio of premium print media crafted for packaging, labels, stationery,
                marketing materials, and luxury print applications. With over 10+ specialty products, DIGILUX offers
                the perfect solution for every creative vision.
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

        {/* ── APPLICATION ── */}
        <MotionSection className="section-padding py-20 lg:py-28" style={{ backgroundColor: NAVY_DARK }}>
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-bold tracking-tight mb-4 text-white" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
                Application
              </h2>
              <p className="mb-14 max-w-4xl text-[16px] text-white/70 leading-relaxed">
                Our papers give you the advantage you need to make your products stand out from the crowd. We
                don&apos;t just supply materials; we deliver sustainable and innovative solutions. Whether you are a
                brand owner, converter, printer, designer or communications agency, our packaging and speciality
                papers give you the advantage you need.
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

        {/* ── PRODUCT ── */}
        <MotionSection className="bg-white section-padding py-20 lg:py-28">
          <div className="container-max">
            <MotionDiv>
              <h2 className="font-sans font-bold tracking-tight mb-4 text-brand-navy" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
                Product
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

        {/* ── WHY DIGILUX? / OUR JOURNEY ── */}
        <MotionSection className="section-padding py-20 lg:py-28" style={{ backgroundColor: NAVY_DARK }}>
          <div className="container-max">
            <WhyDigiluxTabs />
          </div>
        </MotionSection>

        {/* ── ELEVATE EVERY PRINT ── parchment texture + pen */}
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
          <div className="relative z-10 container-max section-padding">
            <MotionDiv>
              <h2 className="font-display font-normal mb-8" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", color: ELEVATE_BROWN }}>
                Elevate Every Print
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <div className="flex flex-col gap-5 max-w-2xl text-[17px] leading-relaxed" style={{ color: OLIVE }}>
                <p>The right paper does more than carry ink—it creates an experience.</p>
                <p>
                  Whether it&apos;s premium packaging, luxury invitations, elegant branding, or high-end labels,
                  specialty papers add depth, texture, character, and value to every printed piece.
                </p>
                <p>When your product is aspirational, your packaging should be too.</p>
                <p>
                  DIGILUX helps transform ordinary prints into memorable experiences that leave a lasting
                  impression.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── BUILT FOR EXCEPTIONAL PRINTING ── */}
        <MotionSection className="bg-white section-padding py-14 lg:py-20">
          <div className="container-max">
            <MotionDiv>
              <div
                className="relative rounded-[32px] px-6 py-14 lg:px-20 lg:py-20 text-center shadow-xl"
                style={{ background: "linear-gradient(135deg, #FFFDF4 0%, #FFF8E4 100%)" }}
              >
                <Sparkle className="absolute left-10 top-8 h-12 w-12 lg:h-16 lg:w-16" />
                <Sparkle className="absolute bottom-8 right-12 h-10 w-10 lg:h-14 lg:w-14 rotate-45" />
                <h2 className="font-display font-normal mb-8" style={{ fontSize: "clamp(1.75rem,2.8vw,2.5rem)", color: RUST }}>
                  Built for Exceptional Printing
                </h2>
                <p className="font-display mx-auto max-w-3xl mb-2" style={{ fontSize: "clamp(1.1rem,1.6vw,1.4rem)", lineHeight: 1.6, color: OLIVE }}>
                  At DIGILUX, we believe creativity deserves the right foundation.
                </p>
                <p className="font-display mx-auto max-w-3xl" style={{ fontSize: "clamp(1.1rem,1.6vw,1.4rem)", lineHeight: 1.6, color: OLIVE }}>
                  By combining premium materials, ready-stock availability, standardized quality, and low MOQ
                  convenience, we enable printers and brands to create exceptional print products—every single time.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── NEED SAMPLES? ── */}
        <MotionSection className="section-padding pb-14 lg:pb-20 bg-white">
          <div
            className="container-max flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6 lg:px-12 lg:py-7"
            style={{ backgroundColor: "#1A2B3C" }}
          >
            <MotionDiv>
              <h2 className="font-display italic font-normal text-2xl lg:text-3xl" style={{ color: "#E9EEF5" }}>
                Need Samples?
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full px-7 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#00449A" }}
              >
                Request DigiLux Sample pack
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
