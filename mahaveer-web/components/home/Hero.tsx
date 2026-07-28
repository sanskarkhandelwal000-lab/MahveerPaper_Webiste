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

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setActiveSlide((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <section
      className="relative min-h-[600px] lg:aspect-[1920/1037] flex items-center overflow-hidden bg-black"
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
                   pt-16 sm:pt-24 lg:pt-[230px] pb-10 lg:pb-[60px]
                   px-4 sm:px-8 lg:px-10 lg:mx-auto lg:max-w-[1200px]"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-[818px] flex-col"
        >
          {/* Two-line heading — Newsreader, orange regular + white italic */}
          <motion.h1
            variants={prefersReduced ? {} : itemVariants}
            className="flex flex-col gap-2 lg:gap-3 font-display text-display-xl tracking-[-0.02em]"
          >
            <span className="not-italic font-normal leading-[1] text-brand-orange">
              The Foundation
            </span>
            <span className="italic font-normal leading-[1] text-white">
              of Exceptional Print
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
              Engineered paper solutions crafted for performance, consistency, and
              scale—trusted by businesses that demand more from every sheet.
            </p>
            <p>
              From fine printing to industrial applications, Mahaveer Papers delivers
              precision-made paper products designed to elevate quality, efficiency,
              and reliability across industries.
            </p>
          </div>

          <Link href="/contact" className="btn-primary">
            Request Free Quote
            <span className="btn-icon-badge">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
