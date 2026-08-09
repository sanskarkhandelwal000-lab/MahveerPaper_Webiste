"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion, motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

// Licensed Adobe Stock photography — premium colour-paper photography for a
// cohesive, high-end rotation rather than a single static banner.
const HERO_SLIDES = [
  "/images/hero/slide-1.jpg",
  "/images/hero/slide-2.jpg",
  "/images/hero/slide-3.jpg",
  "/images/hero/slide-4.jpg",
];

const SLIDE_INTERVAL_MS = 6000;

// Figma: MP file, node 2001:1215 "Section - Hero section"
export function Hero() {
  const prefersReduced = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  // Self-resetting timeout (rather than a plain interval) so the timer — and
  // the progress bar's fill animation, which restarts via the `activeSlide`
  // key — stay perfectly in sync whether a slide change comes from autoplay
  // or a manual click on a segment.
  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => {
      setActiveSlide((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [activeSlide, prefersReduced]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
      aria-label="Hero"
    >
      {/* Background carousel — all slides stay mounted and pre-loaded; only
          opacity crosses over, so there's never a pop-in delay on transition.
          Each slide drifts slowly and continuously (Ken Burns), independent
          of the crossfade, so nothing ever "resets" abruptly. */}
      {HERO_SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover object-center animate-hero-zoom transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === activeSlide ? 1 : 0 }}
          aria-hidden="true"
        />
      ))}
      {/* Dark overlay — Figma "Overlay", black @ 65% opacity */}
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

      <div
        className="relative z-10 flex w-full flex-col gap-8 md:gap-16 lg:gap-[128px]
                   pt-28 sm:pt-32 lg:pt-[230px] pb-10 lg:pb-[60px]
                   px-4 sm:px-8 lg:px-10 lg:mx-auto lg:max-w-[1200px]"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-[818px] flex-col"
        >
          {/* Two-line heading — Newsreader, orange regular + white italic (unchanged styling) */}
          <motion.h1
            variants={prefersReduced ? {} : itemVariants}
            className="flex flex-col gap-2 lg:gap-3 font-display text-display-xl tracking-[-0.02em]"
          >
            <span className="not-italic font-normal leading-[1] text-brand-orange">
              Speciality papers.
            </span>
            <span className="italic font-normal leading-[1] text-white">
              Beyond ordinary.
            </span>
          </motion.h1>
        </motion.div>

        <motion.div
          variants={prefersReduced ? {} : itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-6 lg:gap-10"
        >
          <div className="flex w-full max-w-[570px] flex-col gap-[27px] font-sans text-[18px] leading-[27px] text-[#f5f5f5]">
            <p>
              Since 1992, Mahaveer Papers has helped printers, designers, packaging
              converters and brands choose the right paper for every idea.
            </p>
            <p>
              Explore premium papers from trusted global mills, supported by ready
              stock and practical print and application guidance.
            </p>
          </div>

          <Link href="/products" className="btn-primary">
            Explore Papers
            <span className="btn-icon-badge">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Slide progress — segmented bar doubles as a slide count/position
          indicator and a click-to-jump control. Filled segments = watched,
          animating segment = current (fills over one dwell period), empty = upcoming. */}
      <div
        className="absolute bottom-6 right-4 z-10 flex items-center gap-2 sm:right-8 lg:right-10"
        role="tablist"
        aria-label="Hero slides"
      >
        {HERO_SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === activeSlide}
            aria-label={`Go to slide ${i + 1} of ${HERO_SLIDES.length}`}
            onClick={() => setActiveSlide(i)}
            className="relative h-[3px] w-8 overflow-hidden rounded-full bg-white/25 transition-colors hover:bg-white/40 sm:w-10"
          >
            {i < activeSlide && <span className="absolute inset-0 bg-white/80" aria-hidden="true" />}
            {i === activeSlide && (
              <span
                key={activeSlide}
                className="absolute inset-y-0 left-0 bg-white"
                style={
                  prefersReduced
                    ? { width: "100%" }
                    : { animation: `hero-progress ${SLIDE_INTERVAL_MS}ms linear forwards` }
                }
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
