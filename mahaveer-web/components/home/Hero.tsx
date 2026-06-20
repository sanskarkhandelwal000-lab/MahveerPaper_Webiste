"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useReducedMotion, motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1920&q=80"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-navy/60" aria-hidden="true" />

      <div className="relative z-10 container-max section-padding pt-32 pb-24 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Three-line heading — Playfair Display throughout */}
          <motion.h1
            variants={prefersReduced ? {} : itemVariants}
            className="font-display text-display-xl leading-[1.05] mb-7"
          >
            <span className="text-brand-orange not-italic font-bold">The Foundation</span>
            <br />
            <span className="italic text-white">of Exceptional</span>
            <br />
            <span className="italic text-white">Print</span>
          </motion.h1>

          <motion.p
            variants={prefersReduced ? {} : itemVariants}
            className="text-white/80 text-base leading-relaxed mb-4 max-w-md"
          >
            Engineered paper solutions crafted for performance, consistency, and
            scale—trusted by businesses that demand more from every sheet.
          </motion.p>

          <motion.p
            variants={prefersReduced ? {} : itemVariants}
            className="text-white/60 text-sm leading-relaxed mb-10 max-w-md"
          >
            From fine printing to industrial applications, Mahaveer Papers delivers
            precision-made paper products designed to elevate quality, efficiency,
            and reliability across industries.
          </motion.p>

          <motion.div variants={prefersReduced ? {} : itemVariants}>
            {/* Dark pill button matching Figma hero — navy bg with orange circle accent */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-navy/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Request Free Quote
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange flex-shrink-0">
                <ChevronRight className="h-3.5 w-3.5 text-white" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
