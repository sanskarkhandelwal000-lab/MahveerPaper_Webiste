"use client";

import { useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { faqs as defaultFaqs } from "@/data/faqs";
import { cn } from "@/lib/utils";
import type { FAQ as FAQItem } from "@/types";

// Revision brief (About Us Page Brief): the About page's FAQ block should stay
// limited to company-related questions — items/heading/subtitle are overridable
// so About can pass its own curated set instead of the general ordering/product FAQs.
export function FAQ({
  items = defaultFaqs,
  eyebrow = "FAQs",
  heading = (
    <>
      Frequently Asked <span className="text-brand-orange">Questions</span>
    </>
  ),
  subtitle = "We know choosing paper comes with big questions. Here are answers to the ones we hear most — so you can feel confident from the start.",
}: {
  items?: FAQItem[];
  eyebrow?: string;
  heading?: ReactNode;
  subtitle?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <MotionSection className="section-padding py-20 lg:py-28 bg-brand-gray">
      <div className="container-max max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <MotionDiv>
            <span className="chip mb-4 inline-flex">{eyebrow}</span>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <h2 className="font-sans font-medium text-display-md text-brand-ink leading-tight">
              {heading}
            </h2>
          </MotionDiv>
          <MotionDiv delay={0.15}>
            <p className="mt-4 text-brand-body leading-relaxed">{subtitle}</p>
          </MotionDiv>
        </div>

        {/* Accordion */}
        <dl className="flex flex-col gap-2">
          {items.map((faq, i) => (
            <MotionDiv key={faq.id} delay={0.1 + i * 0.06}>
              <div
                className={cn(
                  "border rounded-xl overflow-hidden transition-colors duration-200",
                  openId === faq.id
                    ? "border-brand-orange/40 bg-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange"
                    aria-expanded={openId === faq.id}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span
                      className={cn(
                        "font-medium transition-colors",
                        openId === faq.id ? "text-brand-ink" : "text-gray-700"
                      )}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                        openId === faq.id
                          ? "bg-brand-orange text-white"
                          : "bg-gray-100 text-gray-500"
                      )}
                      aria-hidden="true"
                    >
                      {openId === faq.id ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {openId === faq.id && (
                    <motion.dd
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            </MotionDiv>
          ))}
        </dl>
      </div>
    </MotionSection>
  );
}
