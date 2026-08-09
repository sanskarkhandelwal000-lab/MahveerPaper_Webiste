import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { Counter } from "@/components/ui/Counter";
import { siteConfig } from "@/lib/config";

// Figma: MP file, node 2001:1231 "Section - About section"
export function About() {
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

            <MotionDiv delay={0.15}>
              <h2 className="font-sans font-medium text-display-md text-brand-ink">
                A legacy woven into every fibre, designed for the{" "}
                <span className="text-brand-orange">
                  modern Visionary.
                </span>
              </h2>
            </MotionDiv>

            <MotionDiv delay={0.2} className="flex flex-col text-[18px] leading-[27px] text-brand-body">
              <p>
                At Mahaveer Papers, we believe that paper is not merely a substrate;
                it is a catalyst for inspiration. Our curated collection spans the globe,
                from the artisanal mills of Japan to the sustainable forests of Scandinavia.
              </p>
              <p>
                Whether for a limited-edition monograph or a global brand identity,
                our papers offer a distinct tactile authority that digital mediums
                simply cannot replicate.
              </p>
            </MotionDiv>
          </div>

          {/* Stats */}
          <MotionDiv delay={0.25} className="flex items-start gap-6">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <p className="text-[48px] font-semibold leading-[48px] text-brand-ink tabular-nums">
                  <Counter value={stat.value} />
                </p>
                <p className="text-[16px] leading-[24px] text-brand-body">{stat.label}</p>
              </div>
            ))}
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}
