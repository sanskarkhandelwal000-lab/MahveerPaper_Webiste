import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

const GOLD = "#D09F61";

// Figma: Home Page — cross-promotional spotlight introducing the DigiLux
// sub-brand, dropped between Services and the closing CTA. Rendered as an
// inset rounded card (not full-bleed) to match the rest of the page's
// container width.
export function DigiluxBanner() {
  return (
    <MotionSection className="py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto section-padding">
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
          <Image
            src="/figma/digilux2/hero.jpg"
            alt=""
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-right-top"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.05) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-xl">
                <MotionDiv>
                  <Image
                    src="/images/digilux-logo.png"
                    alt="DigiLux — Beyond Ordinary"
                    width={124}
                    height={47}
                    className="h-9 w-auto mb-6"
                  />
                </MotionDiv>
                <MotionDiv delay={0.05}>
                  <h2
                    className="font-display font-normal mb-6"
                    style={{ fontSize: "clamp(2rem,3.5vw,2.75rem)", lineHeight: 1.15 }}
                  >
                    <span className="block text-white">DigiLux</span>
                    <span className="block" style={{ color: GOLD }}>
                      by Mahaveer Papers
                    </span>
                  </h2>
                </MotionDiv>
                <MotionDiv delay={0.1}>
                  <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                    Premium 13 × 19 inch media developed for toner-based digital
                    printing, short-run production and low-quantity requirements.
                  </p>
                </MotionDiv>
              </div>

              <MotionDiv delay={0.15} className="shrink-0">
                <Link
                  href="/digilux"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-brand-dark transition-transform hover:-translate-y-0.5"
                >
                  Explore DigiLux Media
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
