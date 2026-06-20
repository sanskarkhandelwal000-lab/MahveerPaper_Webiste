"use client";

import { Quote } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <MotionSection className="section-padding py-20 lg:py-28 bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="mb-12">
          <MotionDiv>
            <span className="chip mb-4 inline-flex">Testimonials</span>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <h2 className="font-sans font-bold text-display-md text-brand-navy leading-tight max-w-lg">
              What Our{" "}
              <span className="font-display italic text-brand-orange">Clients</span>{" "}
              Are Saying
            </h2>
          </MotionDiv>
          <MotionDiv delay={0.15}>
            <p className="mt-3 text-gray-500 max-w-md">
              Real stories from businesses who rely on Mahaveer Papers every day.
            </p>
          </MotionDiv>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <MotionDiv key={t.id} delay={0.1 + i * 0.08}>
              <figure
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow"
                aria-label={`Testimonial from ${t.name}`}
              >
                <Quote className="h-6 w-6 text-brand-orange/40" aria-hidden="true" />
                <blockquote>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            </MotionDiv>
          ))}
        </div>

        {/* Featured large testimonial */}
        {testimonials[4] && (
          <MotionDiv delay={0.4} className="mt-6">
            <figure className="rounded-2xl bg-brand-navy text-white p-8 lg:p-10">
              <Quote className="h-8 w-8 text-brand-orange/60 mb-4" aria-hidden="true" />
              <blockquote>
                <p className="text-lg lg:text-xl font-medium leading-relaxed max-w-3xl">
                  &ldquo;{testimonials[4].quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white font-bold shrink-0">
                  {testimonials[4].name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">— {testimonials[4].name}</p>
                  <p className="text-sm text-white/50">{testimonials[4].location}</p>
                </div>
              </figcaption>
            </figure>
          </MotionDiv>
        )}
      </div>
    </MotionSection>
  );
}
