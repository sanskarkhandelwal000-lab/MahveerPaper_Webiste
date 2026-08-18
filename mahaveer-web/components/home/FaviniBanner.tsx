import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Warm champagne-gold accent — distinct from DigiLux's gold (#D09F61) and the
// site's orange, chosen to read as "premium Italian" rather than either of
// those. Used sparingly: eyebrow text, hairline dividers, CTA border.
const GOLD = "#C9A24B";

// Figma-less: this section didn't exist before — added per request to give
// Favini (Mahaveer's premium Italian speciality-paper line) its own dedicated,
// luxurious homepage spotlight, styled after the existing DigiluxBanner
// pattern (same inset rounded card, dark gradient, logo + heading + CTA) but
// with a right-hand mosaic of three real Favini colour/finish photos instead
// of one stretched background image — the source photos are 500×500 crops,
// so a full-bleed stretch would look soft; three panels at a smaller display
// size stay crisp instead.
export function FaviniBanner() {
  return (
    <MotionSection className="py-20 lg:py-28 bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto section-padding">
        <div
          className="relative overflow-hidden rounded-2xl lg:rounded-3xl grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]"
          style={{
            background: "linear-gradient(135deg, #0d1117 0%, #171a21 55%, #10131a 100%)",
          }}
        >
          {/* Text panel */}
          <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-14 lg:py-20 flex flex-col justify-center">
            <MotionDiv>
              <p
                className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-5"
                style={{ color: GOLD }}
              >
                Mahaveer Papers Presents
              </p>
            </MotionDiv>
            <MotionDiv delay={0.05}>
              <Image
                src="/images/favini-logo-white.svg"
                alt="Favini"
                width={236}
                height={59}
                unoptimized
                className="h-10 sm:h-12 w-auto mb-7"
              />
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <h2
                className="font-display font-normal text-white mb-6"
                style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", lineHeight: 1.2 }}
              >
                Graphic speciality papers,
                <br />
                <span className="italic" style={{ color: GOLD }}>crafted in Italy.</span>
              </h2>
            </MotionDiv>
            <MotionDiv delay={0.15}>
              <p className="text-white/70 text-base leading-relaxed mb-9 max-w-md">
                Mahaveer Papers is proud to bring Favini&apos;s colour, texture and metallic
                collections to India — a range trusted by designers and printers worldwide
                for exceptional finish, depth and print performance.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.2}>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products?brand=favini"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-brand-dark transition-transform hover:-translate-y-0.5"
                >
                  Explore the Favini Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-4 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(201,162,75,0.5)" }}
                >
                  Talk to Our Team
                </Link>
              </div>
            </MotionDiv>
          </div>

          {/* Image mosaic panel — three real Favini finishes: deep black embossed
              cover, warm burgundy through-colour, brushed metallic gold — a
              palette that reads "premium" on its own even before the copy. */}
          <MotionDiv direction="right" className="relative min-h-[320px] lg:min-h-0">
            <div className="absolute inset-0 grid grid-rows-3 gap-[3px] p-[3px]">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/favini/classy-cover-nero.jpg"
                  alt="Favini Classy Cover — deep black embossed finish"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/images/favini/burano-burgundy.jpg"
                  alt="Favini Burano — burgundy through-coloured paper"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/images/favini/majestic-real-gold.jpg"
                  alt="Favini Majestic — brushed metallic gold finish"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Left-edge fade so the mosaic blends into the text panel on wide screens */}
            <div
              className="hidden lg:block absolute inset-y-0 left-0 w-24 pointer-events-none"
              style={{ background: "linear-gradient(90deg, #10131a 0%, rgba(16,19,26,0) 100%)" }}
              aria-hidden="true"
            />
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}
