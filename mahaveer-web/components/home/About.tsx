import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Award, MapPin } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { siteConfig } from "@/lib/config";

const FACT_ICONS = [CalendarDays, Award, MapPin];

// Figma: MP file, node 2001:1231 "Section - About section"
// `showCta` is off when this same short summary is reused on the About page
// itself, so it doesn't link to the page it's already on.
export function About({ showCta = true }: { showCta?: boolean }) {
  return (
    <MotionSection className="bg-white px-4 sm:px-8 lg:px-10 py-16 lg:py-[100px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
        {/* Image mosaic: large left (top-aligned) + two stacked right (offset down ~64px per Figma) */}
        <MotionDiv direction="left" className="flex w-full shrink-0 items-start gap-4 lg:w-[570px]">
          <div className="relative h-[350px] w-1/2 shrink-0 overflow-hidden rounded-[10px] sm:h-[437px] lg:w-[313.5px]">
            <Image
              src="/figma/paper-roll.jpg"
              alt="Brown paper roll close-up"
              fill
              sizes="(max-width: 1024px) 50vw, 314px"
              className="object-cover object-bottom"
            />
          </div>
          <div className="mt-6 flex w-1/2 shrink-0 flex-col gap-4 sm:mt-8 lg:mt-16 lg:w-[240.5px]">
            <div className="relative h-[160px] overflow-hidden rounded-[10px] sm:h-[153px]">
              <Image
                src="/figma/about-layers.jpg"
                alt="Fanned stack of textured speciality paper swatches"
                fill
                sizes="(max-width: 1024px) 40vw, 240px"
                className="object-cover"
              />
            </div>
            <div className="relative h-[190px] overflow-hidden rounded-[10px] sm:h-[268px]">
              <Image
                src="/figma/colored-papers.jpg"
                alt="Rolled sheet of textured paper resting on flat sheets"
                fill
                sizes="(max-width: 1024px) 40vw, 240px"
                className="object-cover"
              />
            </div>
          </div>
        </MotionDiv>

        {/* Text content */}
        <div className="flex w-full flex-1 flex-col gap-10 lg:gap-[100px]">
          <div className="flex flex-col gap-4">
            <MotionDiv delay={0.1}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue bg-white px-3 py-[5px] text-[14px] font-medium uppercase tracking-[0.7px] text-brand-blue">
                <BadgeCheck className="h-3.5 w-3.5" />
                About Mahaveer papers
              </span>
            </MotionDiv>

            {/* Revision brief (Homepage — required corrections, "About block"): new
                heading, copy and CTA — this is the short homepage summary; the fuller
                company story lives on the About page. */}
            <MotionDiv delay={0.15}>
              <h2 className="font-sans font-medium text-display-md text-brand-ink">
                Speciality-Paper Expertise{" "}
                <span className="text-brand-orange">Since 1992.</span>
              </h2>
            </MotionDiv>

            <MotionDiv delay={0.2} className="flex flex-col text-[18px] leading-[27px] text-brand-body">
              <p>
                Mahaveer Papers is a speciality-paper sourcing, stocking and distribution
                company with a presence in Bengaluru and Ahmedabad. We combine carefully
                selected papers, dependable availability and practical knowledge
                developed over more than three decades.
              </p>
            </MotionDiv>

            {showCta && (
              <MotionDiv delay={0.22}>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline underline-offset-4 w-fit"
                >
                  Our Story
                  <span aria-hidden="true">→</span>
                </Link>
              </MotionDiv>
            )}
          </div>

          {/* Proof facts — revision brief: static, not animated (an animated
              count-up briefly rendered as "0" / "0+" before settling). Icon-led
              tiles rather than plain divider-separated text, for a more premium feel. */}
          <MotionDiv delay={0.25} className="flex flex-wrap items-center gap-x-8 gap-y-5">
            {siteConfig.stats.map((fact, i) => {
              const Icon = FACT_ICONS[i];
              return (
                <div key={fact} className="flex items-center gap-3">
                  {Icon && (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                      <Icon className="h-5 w-5 text-brand-orange" strokeWidth={1.75} />
                    </span>
                  )}
                  <span className="text-[17px] font-semibold text-brand-ink whitespace-nowrap">{fact}</span>
                </div>
              );
            })}
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}
