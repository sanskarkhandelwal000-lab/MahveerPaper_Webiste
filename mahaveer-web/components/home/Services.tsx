"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { serviceApplications } from "@/data/serviceApplications";

const DRIFT_PX_PER_FRAME = 0.6;
const RESUME_AFTER_INTERACTION_MS = 6000;

// Cards duplicated once so the continuous drift can wrap seamlessly at the
// halfway point — the second copy is visually identical to the first, so the
// reset is imperceptible (standard infinite-marquee technique). This drift is
// deliberately a different scroll feel from the Categories section's discrete
// jump-to-next-card auto-advance — a slow, continuous glide instead.
const marqueeCards = [...serviceApplications, ...serviceApplications];

// Figma: MP file, node 2001:1317 "Service Section"
export function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pauseDrift() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  }

  function scrollByDirection(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    pauseDrift();
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  useEffect(() => {
    let rafId: number;
    function tick() {
      const el = trackRef.current;
      if (el) {
        if (!pausedRef.current) el.scrollLeft += DRIFT_PX_PER_FRAME;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  return (
    <MotionSection className="bg-brand-gray overflow-hidden">
      <div className="container-max section-padding pt-20 lg:pt-28 pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT: chip + heading */}
          <div className="flex flex-col gap-4">
            <MotionDiv>
              <span className="chip inline-flex">
                <Settings className="h-3.5 w-3.5" />
                Our Services
              </span>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <h2 className="font-sans font-medium text-display-md text-brand-ink leading-tight">
                <span className="text-brand-orange">We Provide</span>{" "}
                Paper Solutions Designed for Every Industry
              </h2>
            </MotionDiv>
          </div>

          {/* RIGHT: body text + button */}
          <div className="flex flex-col gap-6 justify-between">
            <MotionDiv delay={0.15}>
              <p className="text-brand-body leading-[27px] text-[18px]">
                From sourcing to delivery, we offer end-to-end paper solutions tailored to
                your project, budget, and timeline. Whether it&apos;s a single premium
                run or a bulk supply order, Mahaveer Papers makes it seamless.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.2}>
              <Link href="/contact" className="btn-primary w-fit">
                Check Price & Availability
                <span className="btn-icon-badge">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </MotionDiv>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={pauseDrift}
        onTouchStart={pauseDrift}
        className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-none pb-10 lg:pb-14 pl-4 sm:pl-6 lg:pl-8 pr-0"
      >
        {marqueeCards.map((card, i) => (
          <Link
            key={`${card.id}-${i}`}
            href={card.href}
            aria-label={`Explore ${card.title} papers`}
            className="
              group flex-shrink-0 relative cursor-pointer overflow-hidden rounded-[10px] bg-gray-200
              w-[72vw] h-[86.4vw]
              sm:w-[340px] sm:h-[408px]
              lg:w-[500px] lg:h-[600px]
            "
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 340px, 500px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient at bottom — Figma: #171717 solid fading to transparent over the bottom ~1/3 of the card */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#171717] to-transparent" />
            <span className="absolute top-6 right-6 inline-flex items-center border border-white/40 text-white text-[11px] font-semibold tracking-widest px-3 py-1 rounded-full uppercase backdrop-blur-sm">
              {card.productCount} Products
            </span>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-brand-gray font-medium text-lg lg:text-[24px] leading-tight lg:leading-[28.8px] lg:tracking-[-0.48px]">
                {card.title}
              </p>
              <p className="text-[#D4D4D4] text-sm lg:text-[16px] mt-1.5 leading-relaxed lg:leading-[24px] line-clamp-2">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden="true" />
      </div>

      {/* Arrow controls — scroll the track above by ~one screenful, wrapping via the drift loop */}
      <div className="container-max section-padding">
        <div className="flex items-center justify-center gap-3 -mt-4 lg:-mt-6 pb-16 lg:pb-20">
          <button
            type="button"
            onClick={() => scrollByDirection(-1)}
            aria-label="Scroll services left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection(1)}
            aria-label="Scroll services right"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </MotionSection>
  );
}
