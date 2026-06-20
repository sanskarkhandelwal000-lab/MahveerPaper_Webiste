import Image from "next/image";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { siteConfig } from "@/lib/config";

export function About() {
  return (
    <MotionSection className="section-padding py-20 lg:py-28 bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image mosaic: large left + two stacked right */}
          <MotionDiv direction="left">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[480px]">
              {/* Large image spanning both rows */}
              <div className="relative row-span-2 rounded-2xl overflow-hidden bg-amber-100">
                <Image
                  src="https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=600&q=80"
                  alt="Brown paper roll close-up"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              {/* Top-right image */}
              <div className="relative rounded-2xl overflow-hidden bg-blue-100">
                <Image
                  src="https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80"
                  alt="Colorful paper sheets"
                  fill
                  sizes="(max-width: 1024px) 40vw, 20vw"
                  className="object-cover"
                />
              </div>
              {/* Bottom-right image */}
              <div className="relative rounded-2xl overflow-hidden bg-purple-100">
                <Image
                  src="https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400&q=80"
                  alt="Vibrant purple and blue paper textures"
                  fill
                  sizes="(max-width: 1024px) 40vw, 20vw"
                  className="object-cover"
                />
              </div>
            </div>
          </MotionDiv>

          {/* Text content */}
          <div className="flex flex-col gap-6">
            <MotionDiv delay={0.1}>
              <span className="chip inline-flex">About Mahaveer papers</span>
            </MotionDiv>

            <MotionDiv delay={0.15}>
              <h2 className="font-sans font-bold text-display-md text-brand-navy leading-tight">
                A legacy woven into every fibre, designed for the{" "}
                <span className="font-display italic text-brand-orange">
                  modern Visionary.
                </span>
              </h2>
            </MotionDiv>

            <MotionDiv delay={0.2}>
              <p className="text-gray-600 leading-relaxed">
                At Mahaveer Papers, we believe that paper is not merely a substrate;
                it is a catalyst for inspiration. Our curated collection spans the globe,
                from the artisanal mills of Japan to the sustainable forests of Scandinavia.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                Whether for a limited-edition monograph or a global brand identity,
                our papers offer a distinct tactile authority that digital mediums
                simply cannot replicate.
              </p>
            </MotionDiv>

            {/* Stats */}
            <MotionDiv delay={0.25} className="flex items-center gap-12 pt-4 border-t border-gray-100">
              {siteConfig.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold text-brand-navy leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </MotionDiv>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
