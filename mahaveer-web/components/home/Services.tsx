import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

const serviceCards = [
  {
    id: "specialty",
    name: "Specialty Papers",
    description: "Compared to other industries, paper manufacturing has significant potential to be truly sustainable.",
    image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80",
  },
  {
    id: "printing-writing",
    name: "Printing & Writing Papers",
    description: "Compared to other industries, paper manufacturing has significant potential to be truly sustainable.",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&q=80",
  },
  {
    id: "packaging",
    name: "Packaging Papers",
    description: "Compared to other industries, paper manufacturing has significant potential to be truly sustainable.",
    image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=800&q=80",
  },
  {
    id: "industrial",
    name: "Industrial Papers",
    description: "Compared to other industries, paper manufacturing has significant potential to be truly sustainable.",
    image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=800&q=80",
  },
];

export function Services() {
  return (
    <MotionSection className="bg-brand-cream overflow-hidden">

      {/* ── HEADER ROW ──────────────────────────────────────────────────────
          Figma: LEFT column = chip + heading (x=360)
                 RIGHT column = body paragraph + button (x=990)
          Both columns sit inside the content container, side by side.       */}
      <div className="container-max section-padding pt-20 lg:pt-28 pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* LEFT: chip + heading */}
          <div className="flex flex-col gap-4">
            <MotionDiv>
              <span className="chip inline-flex">Our Services</span>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <h2 className="font-sans font-bold text-display-md text-brand-navy leading-tight">
                We Provide Paper Solutions{" "}
                <span className="font-display italic text-brand-orange">
                  Designed for Every Industry
                </span>
              </h2>
            </MotionDiv>
          </div>

          {/* RIGHT: body text + button (aligned to top of chip, button to heading bottom) */}
          <div className="flex flex-col gap-6 justify-between">
            <MotionDiv delay={0.15}>
              <p className="text-gray-600 leading-relaxed text-sm">
                From sourcing to delivery, we offer end-to-end paper supply solutions
                tailored to your industry, volume, and quality requirements. Whether
                you need specialty papers or bulk industrial grades, Mahaveer Papers
                delivers consistently.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.2}>
              <Link href="/contact" className="btn-primary w-fit">
                Request Free Quote
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* ── CARD CAROUSEL ───────────────────────────────────────────────────
          Figma: cards are BELOW the header row, spanning full viewport width.
          Card 1 starts near the left edge (x≈0 in Figma).
          Cards extend to the right beyond viewport — horizontal scroll.
          Card sizes at 1920px: ~650px wide × ~780px tall.
          Scaled to 1440px (×0.75): ~490px × ~585px.
          We use section-padding for the left start so card 1 aligns with
          the page content left margin, no right padding so cards bleed right. */}
      <div className="flex gap-4 lg:gap-5 overflow-x-auto scrollbar-none pb-20 lg:pb-28 pl-4 sm:pl-6 lg:pl-8 pr-0">
        {serviceCards.map((card) => (
          <div
            key={card.id}
            className="
              group flex-shrink-0 relative cursor-pointer overflow-hidden rounded-2xl bg-gray-200
              w-[72vw] h-[50vw]
              sm:w-[340px] sm:h-[420px]
              lg:w-[460px] lg:h-[560px]
            "
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 340px, 460px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient at bottom — fade from navy to transparent */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/10 to-transparent" />
            {/* Label */}
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-white font-semibold text-base lg:text-xl leading-tight">
                {card.name}
              </p>
              <p className="text-white/60 text-xs lg:text-sm mt-1.5 leading-relaxed line-clamp-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
        {/* Trailing spacer so the last card isn't flush against the edge */}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden="true" />
      </div>
    </MotionSection>
  );
}
