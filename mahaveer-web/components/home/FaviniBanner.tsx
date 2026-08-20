import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

const GOLD = "#C9A24B";

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
                Official Stockist in India · Made in Italy Since 1736
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
                <span className="text-white">Mahaveer Papers is the official stockist of Favini</span> — bringing Italy&apos;s most celebrated through-coloured, textured and metallic papers to India. Ex-stock, FSC® certified and trusted by designers worldwide.
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

          {/* Image panel — Favini home page banner */}
          <MotionDiv direction="right" className="relative min-h-[340px] lg:min-h-0">
            <div className="absolute inset-0 overflow-hidden lg:rounded-r-3xl">
              <Image
                src="/images/favini/favini-home-page-banner.jpg"
                alt="Favini premium paper — home page banner"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority={false}
              />
            </div>
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
