"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/categories";

const GAP = 28; // px — gap-7

function useCarousel(total: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(3);
  const [step, setStep] = useState(0);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, total - visible);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const v = w < 640 ? 1 : w < 1024 ? 2 : 3;
    setVisible(v);
    setStep((w - GAP * (v - 1)) / v + GAP);
    setIndex(i => Math.min(i, Math.max(0, total - v)));
  }, [total]);

  useEffect(() => {
    measure();
    const obs = new ResizeObserver(measure);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [measure]);

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(Math.max(0, total - visible), i + 1));

  return { containerRef, index, visible, step, maxIndex: Math.max(0, total - visible), prev, next };
}

export function Categories() {
  const total = categories.length;
  const { containerRef, index, visible, step, maxIndex, prev, next } = useCarousel(total);

  const cardWidth = step > 0 ? step - GAP : 0;

  return (
    <section className="section-padding py-20 lg:py-24 bg-white overflow-hidden" aria-label="Product categories">
      <div className="container-max">

        {/* Header row: heading + arrows */}
        <div className="flex items-center justify-between mb-10 lg:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display italic text-brand-orange"
            style={{ fontSize: "clamp(1.75rem,3.5vw,3rem)" }}
          >
            Category
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous category"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 text-brand-navy hover:border-brand-orange hover:text-brand-orange transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              disabled={index >= maxIndex}
              aria-label="Next category"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white hover:bg-orange-600 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Carousel track */}
        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            className="flex"
            style={{ gap: GAP }}
            animate={{ x: -(index * step) }}
            transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
          >
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                style={{ width: cardWidth > 0 ? cardWidth : undefined, flexShrink: 0 }}
                className={cardWidth === 0 ? "w-full" : undefined}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                >
                  <Link
                    href={cat.href}
                    className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                    aria-label={`Explore ${cat.title}`}
                  >
                    {/* Image */}
                    <div className="relative h-64 sm:h-72 lg:h-[340px] overflow-hidden bg-gray-100">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Tag badge */}
                      {cat.tag && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-brand-orange text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                            {cat.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="p-5 lg:p-6">
                      <h3 className="font-bold text-brand-navy text-xl lg:text-2xl mb-2 group-hover:text-brand-orange transition-colors duration-200">
                        {cat.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {cat.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold">
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {}}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-brand-orange" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
