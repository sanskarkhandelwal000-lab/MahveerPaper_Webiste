"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Users, Gem, Globe2 } from "lucide-react";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { cn } from "@/lib/utils";

const whyCards = [
  {
    icon: Users,
    iconColor: "#9333EA",
    bg: "#F3EBF4",
    title: "Designed for Low MOQ Jobs",
    body: "Print only what you need with premium-quality media that delivers exceptional results, even in small quantities.",
  },
  {
    icon: Gem,
    iconColor: "#E23B6E",
    bg: "#FFEEF2",
    title: "Ready Stock",
    body: "Our most popular products are readily available, ensuring faster turnaround times and uninterrupted production.",
  },
  {
    icon: Globe2,
    iconColor: "#14B8A6",
    bg: "#EAF8F3",
    title: "Experts in sustainability",
    body: "Premium print solutions powered by innovation and technical expertise.",
  },
];

const journeyPortfolioItems = [
  "Premium white boards",
  "Texture Papers & Boards",
  "Metallic Papers & Board",
  "Non Tearable & Clear Synthetic Sheets",
  "Chromo & Mirror Coat Self-Adhesive Sheets",
  "Gold & Silver Self-Adhesive Sheets",
  "PVC-Based Self-Adhesive Sheets",
  "Speciality Labels",
];

export function WhyDigiluxTabs() {
  const [tab, setTab] = useState<"why" | "journey">("why");

  return (
    <div>
      {/* Tab pill */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center rounded-full bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => setTab("why")}
            className={cn(
              "rounded-full px-6 py-2.5 text-sm sm:text-base font-medium transition-colors",
              tab === "why" ? "bg-[#00C8B3] text-[#0A1520]" : "text-brand-navy hover:bg-gray-50"
            )}
          >
            Why DigiLux?
          </button>
          <button
            type="button"
            onClick={() => setTab("journey")}
            className={cn(
              "rounded-full px-6 py-2.5 text-sm sm:text-base font-medium transition-colors",
              tab === "journey" ? "bg-[#00C8B3] text-[#0A1520]" : "text-brand-navy hover:bg-gray-50"
            )}
          >
            Our Journey
          </button>
        </div>
      </div>

      {tab === "why" ? (
        <>
          <h2 className="text-center font-sans font-semibold text-white mb-12" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
            Why DigiLux?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start text-left">
          <div>
            <h2 className="font-sans font-semibold text-white mb-10" style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)" }}>
              Our Journey
            </h2>
            <div className="relative hidden lg:block h-[300px]">
              <div className="absolute left-2 top-2 h-[150px] w-[170px] -rotate-6 overflow-hidden rounded-[20px] shadow-lg">
                <Image src="/figma/digilux2/about-collage.jpg" alt="" fill sizes="170px" className="object-cover" aria-hidden="true" />
              </div>
              <div className="absolute left-32 top-32 h-[150px] w-[170px] rotate-6 overflow-hidden rounded-[20px] shadow-lg">
                <Image src="/figma/digilux2/about-collage.jpg" alt="" fill sizes="170px" className="object-cover object-bottom" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[17px] leading-relaxed text-white/80">
              DIGILUX began with a focused range of premium textured papers for digital printing. As customer
              requirements evolved, so did our portfolio.
            </p>
            <p className="mb-8 text-[17px] leading-relaxed text-white/80">
              Today, DIGILUX offers over 40 carefully selected specialty products, helping digital printers deliver
              premium results across a wide range of applications.
            </p>

            <div className="rounded-3xl p-8 lg:p-10 mb-8 bg-white">
              <h3 className="font-sans font-semibold mb-6 text-[#14372B]" style={{ fontSize: "clamp(1.25rem,2vw,1.5rem)" }}>
                Our growing portfolio includes:
              </h3>
              <ul className="flex flex-col gap-4">
                {journeyPortfolioItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3FB65C]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[17px] leading-relaxed text-white/80">
              Every product is stocked in the convenient 13 × 19 inch format, enabling quick production with minimal
              wastage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
