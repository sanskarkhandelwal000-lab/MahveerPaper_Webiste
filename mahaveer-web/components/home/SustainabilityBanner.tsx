import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Revision brief (Homepage — required corrections, "Sustainability"): compact block
// introducing sustainability credentials, with a link through to the full page.
export function SustainabilityBanner() {
  return (
    <MotionSection className="section-padding py-16 lg:py-20 bg-white">
      <div className="container-max">
        <MotionDiv>
          <div className="rounded-2xl lg:rounded-3xl bg-[#EAF8F3] px-6 py-10 sm:px-10 lg:px-14 lg:py-14 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
              <Leaf className="h-6 w-6 text-[#14B8A6]" strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <h2 className="font-sans font-semibold text-brand-ink text-2xl lg:text-3xl mb-3">
                Paper With a Better Purpose
              </h2>
              <p className="text-brand-body text-[16px] lg:text-[18px] leading-relaxed max-w-2xl">
                Mahaveer Papers is an FSC-certified company. Paper is biodegradable and
                recyclable, and we offer responsibly sourced options selected to meet
                high environmental standards.
              </p>
            </div>
            <Link
              href="/sustainability"
              className="inline-flex items-center gap-2.5 bg-[#14B8A6] text-white text-[16px] font-medium pl-5 pr-1.5 py-1.5 rounded-full shrink-0 hover:bg-[#0f9d8d] transition-colors"
            >
              Our Sustainability Commitment
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
