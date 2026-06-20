import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { categories } from "@/data/categories";

export function Categories() {
  return (
    <MotionSection className="section-padding py-20 lg:py-24 bg-white">
      <div className="container-max">

        {/* Section heading — Figma: "Category" at fs=40 centered in content area.
            Same scale as other section headings. Rendered in display italic orange. */}
        <MotionDiv className="text-center mb-10 lg:mb-14">
          <h2 className="font-display italic text-brand-orange text-display-md">
            Category
          </h2>
        </MotionDiv>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {categories.map((cat, i) => (
            <MotionDiv key={cat.id} delay={0.1 + i * 0.1}>
              <Link
                href={cat.href}
                className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                aria-label={`Explore ${cat.title}`}
              >
                {/* Photo — Figma card images ~493px at 1920px → ~380px at 1440px */}
                <div className="relative h-64 sm:h-80 lg:h-[380px] overflow-hidden bg-gray-100">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Text area */}
                <div className="p-5 lg:p-6">
                  {/* Figma: card title fs=32 at 1920px → text-2xl at 1440px */}
                  <h3 className="font-bold text-brand-navy text-xl lg:text-2xl mb-2 group-hover:text-brand-orange transition-colors">
                    {cat.title}
                  </h3>
                  {/* Figma: description fs=14 */}
                  <p className="text-xs lg:text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-orange text-sm font-medium">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
