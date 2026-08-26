import Image from "next/image";
import { Users, Gem, ShieldCheck, TrendingUp } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Revision brief (DigiLux page — clarify the sub-brand):
// - "Why DigiLux" — swap "Experts in sustainability" for "Consistent Quality"
//   and add a "Growing Portfolio" card.
// - "Low MOQ" — add the 100/200-sheet packet detail to the Low MOQ card.
const whyCards = [
  {
    icon: Users,
    iconColor: "#9333EA",
    bg: "#F3EBF4",
    title: "Designed for Low MOQ Jobs",
    body: "Print only what you need with premium-quality media that delivers exceptional results, even in small quantities. Most DigiLux media is available in convenient 100-sheet packets, with selected products packed in 200 sheets — customers can begin with as little as one packet.",
  },
  {
    icon: Gem,
    iconColor: "#E23B6E",
    bg: "#FFEEF2",
    title: "Ready Stock",
    body: "Our most popular products are readily available, ensuring faster turnaround times and uninterrupted production.",
  },
  {
    icon: ShieldCheck,
    iconColor: "#14B8A6",
    bg: "#EAF8F3",
    title: "Consistent Quality",
    body: "Carefully selected media designed to support dependable results across repeat requirements.",
  },
  {
    icon: TrendingUp,
    iconColor: "#D97706",
    bg: "#FEF3E2",
    title: "Growing Portfolio",
    body: "Expanded from approximately 30 products at launch to 55 SKUs today.",
  },
];

// Revision brief (section I): the "Why DigiLux? / Our Journey" tab toggle was
// unreliable, so both are now shown as two normal stacked sections instead of
// tab-gated content — no interaction required to read either one.
export function WhyDigiluxTabs() {
  return (
    <div className="flex flex-col gap-20 lg:gap-28">
      {/* ── WHY DIGILUX? ── */}
      <div>
        <h2 className="text-center font-sans font-semibold text-white mb-12" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
          Why DigiLux?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {whyCards.map((card, i) => (
            <MotionDiv key={card.title} delay={0.05 + i * 0.08}>
              <div
                className="rounded-2xl px-8 py-10 h-full flex flex-col items-center text-center gap-4"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon className="h-9 w-9" style={{ color: card.iconColor }} strokeWidth={1.5} />
                <h3 className="font-sans font-semibold text-[#14141A] text-xl">{card.title}</h3>
                <p className="text-[#5B5B66] text-[15px] leading-relaxed">{card.body}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>

      {/* ── OUR JOURNEY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center text-left">
        <div>
          <h2 className="font-sans font-semibold text-white mb-10" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
            Our Journey
          </h2>
          {/* Larger collage filling the column, plus a floating stat card — the
              small pair of thumbnails previously left a lot of empty space below.
              Two distinct DigiLux photos rather than the same image twice. */}
          <div className="relative hidden lg:block h-[460px]">
            <div className="absolute left-0 top-4 h-[280px] w-[240px] -rotate-6 overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/10">
              <Image src="/figma/digilux2/about-collage.jpg" alt="" fill sizes="240px" className="object-cover" aria-hidden="true" />
            </div>
            <div className="absolute left-[190px] top-32 h-[280px] w-[240px] rotate-6 overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/10">
              <Image src="/figma/digilux2/app-invitation-cards.jpg" alt="" fill sizes="240px" className="object-cover" aria-hidden="true" />
            </div>
            {/* Floating stat card */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-2xl bg-white shadow-2xl px-6 py-4 flex items-center gap-4">
              <div>
                <p className="font-sans font-bold text-2xl leading-none" style={{ color: "#1D2939" }}>55 SKUs</p>
                <p className="text-xs text-gray-500 mt-1">Since 2023</p>
              </div>
              <div className="h-8 w-px bg-gray-200" aria-hidden="true" />
              <div>
                <p className="font-sans font-bold text-2xl leading-none" style={{ color: "#1D2939" }}>200+</p>
                <p className="text-xs text-gray-500 mt-1">Digital Presses</p>
              </div>
            </div>
          </div>
          {/* Compact stacked version for smaller screens, where the absolute layout above is hidden */}
          <div className="relative lg:hidden h-[220px] mb-2">
            <div className="absolute left-2 top-0 h-[150px] w-[170px] -rotate-6 overflow-hidden rounded-[20px] shadow-lg">
              <Image src="/figma/digilux2/about-collage.jpg" alt="" fill sizes="170px" className="object-cover" aria-hidden="true" />
            </div>
            <div className="absolute left-32 top-16 h-[150px] w-[170px] rotate-6 overflow-hidden rounded-[20px] shadow-lg">
              <Image src="/figma/digilux2/app-invitation-cards.jpg" alt="" fill sizes="170px" className="object-cover" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div>
          {/* Revision brief (page length): keep the 2023 → ~30 products → 55 SKUs →
              ~200 presses journey, but the full category checklist was a repeat of the
              "Our Portfolio" grid above — removed here to avoid the duplication. */}
          <p className="mb-8 text-[17px] leading-relaxed text-white/80">
            DigiLux began in 2023 with approximately 30 products and around 50 digital-print
            customers in Bengaluru. The portfolio has since grown to 55 SKUs and serves around
            200 digital printing presses, supported by consistent quality and ready availability.
          </p>

          <p className="text-[17px] leading-relaxed text-white/80">
            Every product is stocked in the convenient 13 × 19 inch format, enabling quick production with minimal
            wastage.
          </p>
        </div>
      </div>
    </div>
  );
}
