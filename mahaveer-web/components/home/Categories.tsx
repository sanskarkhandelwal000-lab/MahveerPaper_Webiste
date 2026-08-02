"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

const AUTO_SCROLL_INTERVAL_MS = 3500;
const RESUME_AFTER_INTERACTION_MS = 6000;

// Figma: MP file, node 2001:1271 "Section - Collection Grid"
export function Categories() {
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  function scrollByDirection(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    const atStart = el.scrollLeft <= 8;
    if (direction === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
    }
  }

  // Pauses auto-scroll for a while after any manual interaction (arrow click,
  // drag/swipe), then lets it resume — rather than stopping it forever.
  function pauseAutoScroll() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pausedRef.current) scrollByDirection(1);
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-brand-gray overflow-hidden" aria-label="Product categories">
      <div className="container-max section-padding">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-sans font-medium text-display-md text-brand-orange-light text-center mb-10 lg:mb-14"
        >
          Explore Our Catalogues
        </motion.h2>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={pauseAutoScroll}
        onTouchStart={pauseAutoScroll}
        className="flex gap-8 lg:gap-10 overflow-x-auto scrollbar-none pb-4 pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-1280px)/2))] pr-0">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex-shrink-0 w-[72vw] sm:w-[320px] lg:w-[360px]"
          >
            <Link
              href={cat.href}
              className="group block"
              aria-label={`Explore ${cat.title}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 320px, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                    <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                    <span className="text-xs font-medium">Photo coming soon</span>
                  </div>
                )}
              </div>
              <div className="pt-6">
                <h3 className="font-sans font-normal text-brand-orange text-2xl lg:text-[32px] leading-[1.2] lg:leading-[38.4px] tracking-[-0.64px] mb-2">
                  {cat.title}
                </h3>
                <p className="font-manrope text-sm text-[#434752] leading-relaxed mb-3">
                  {cat.description}
                </p>
                <ArrowUpRight className="h-2.5 w-2.5 text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </div>
            </Link>
          </motion.div>
        ))}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden="true" />
      </div>

      {/* Arrow controls — scroll the track above by ~one screenful, wrapping at either end */}
      <div className="container-max section-padding">
        <div className="flex items-center justify-center gap-3 mt-8 lg:mt-10">
          <button
            type="button"
            onClick={() => {
              scrollByDirection(-1);
              pauseAutoScroll();
            }}
            aria-label="Scroll catalogues left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              scrollByDirection(1);
              pauseAutoScroll();
            }}
            aria-label="Scroll catalogues right"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
