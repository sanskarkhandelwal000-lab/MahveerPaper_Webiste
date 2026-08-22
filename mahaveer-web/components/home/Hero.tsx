"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion, motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

// Cinematic paper/texture reel — replaces the earlier Ken-Burns still-photo
// carousel with a single continuous looping video for a more premium, "in
// motion" first impression. Autoplay is muted + inline so it satisfies every
// major browser's autoplay policy without a play button; `prefers-reduced-
// motion` users get the poster frame only (no autoplaying video at all).
const HERO_VIDEO_SRC = "/videos/hero.mp4";
const HERO_VIDEO_POSTER = "/images/hero/hero-video-poster.jpg";

// Figma: MP file, node 2001:1215 "Section - Hero section"
export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
      aria-label="Hero"
    >
      {/* Background video — muted/looped/inline so autoplay is allowed everywhere.
          Reduced-motion users get a static poster frame instead (no <video> at
          all), matching the same object-cover framing so nothing shifts. */}
      {prefersReduced ? (
        <Image
          src={HERO_VIDEO_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={HERO_VIDEO_SRC}
          poster={HERO_VIDEO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}

      {/* Light left-side scrim — a much softer assist than before. Legibility now
          mainly comes from the per-glyph text-shadow below, which holds up against
          any frame of the video, so this only needs to take the edge off. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0) 65%)",
        }}
        aria-hidden="true"
      />

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
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.75), 0 1px 4px rgba(0,0,0,0.9)" }}
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
          <div
            className="flex w-full max-w-[570px] flex-col gap-[27px] font-sans text-[18px] leading-[27px] text-[#f5f5f5]"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.9)" }}
          >
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
    </section>
  );
}
