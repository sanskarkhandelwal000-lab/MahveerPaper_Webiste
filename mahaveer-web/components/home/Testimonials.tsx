"use client";

import Image from "next/image";
import { Camera, Quote } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const cards = testimonials.slice(0, 4);
  const featured = testimonials[4];

  return (
    <MotionSection className="section-padding py-20 lg:py-28 bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10">
          <MotionDiv>
            <span className="chip mb-4 inline-flex">
              <Camera className="h-3.5 w-3.5" />
              Testimonials
            </span>
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
              Real Stories from Homeowners Who Trusted Livohaus for Their Home
            </p>
          </MotionDiv>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5 items-stretch">
          {/* 2x2 quote card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map((t, i) => (
              <MotionDiv key={t.id} delay={0.1 + i * 0.08}>
                <figure
                  className="flex h-full flex-col gap-4 rounded-2xl bg-gray-50 p-6"
                  aria-label={`Testimonial from ${t.name}`}
                >
                  <blockquote>
                    <p className="text-gray-700 leading-relaxed text-[15px]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={t.avatar}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-navy text-sm leading-tight">
                          {t.name}
                        </p>
                        <p className="text-xs text-gray-400 leading-tight">{t.location}</p>
                      </div>
                    </div>
                    <Quote
                      className="h-6 w-6 shrink-0 fill-brand-orange text-brand-orange rotate-180"
                      aria-hidden="true"
                    />
                  </figcaption>
                </figure>
              </MotionDiv>
            ))}
          </div>

          {/* Featured image with quote overlay */}
          {featured && (
            <MotionDiv delay={0.4} className="min-h-[360px] lg:min-h-0">
              <figure className="relative h-full min-h-[360px] overflow-hidden rounded-2xl">
                <Image
                  src="/figma/testimonial-paper-fan.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.5) 45%, rgba(10,10,10,0) 75%)",
                  }}
                  aria-hidden="true"
                />
                <blockquote className="absolute inset-x-0 bottom-0 p-8">
                  <p className="font-display italic text-white text-lg leading-snug mb-3">
                    &ldquo;{featured.quote}&rdquo;
                  </p>
                  <figcaption className="text-sm italic text-white/90">
                    - {featured.name}, {featured.location}
                  </figcaption>
                </blockquote>
              </figure>
            </MotionDiv>
          )}
        </div>
      </div>
    </MotionSection>
  );
}
