import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Card titles, copy and images exactly as in the Figma home page design (frame 35:1217).
const serviceCards = [
  {
    id: "specialty",
    name: "Kitchen Specialty Papers",
    description: "Smart, stylish kitchens built for daily living.",
    image: "/figma/svc-kitchen.jpg",
  },
  {
    id: "printing-writing",
    name: "Printing & Writing Papers",
    description: "Modern, functional bathrooms with lasting comfort and quality.",
    image: "/figma/svc-printing.jpg",
  },
  {
    id: "packaging",
    name: "Packaging Papers",
    description: "Extend your home with inviting patios, decks, and garden zones.",
    image: "/figma/svc-packaging.jpg",
  },
  {
    id: "bulk-supply",
    name: "Bulk Supply & Distribution Finishing",
    description: "Built-ins, trim, flooring, lighting — we sweat the small stuff.",
    image: "/figma/svc-bulk.jpg",
  },
];

// Figma: MP file, node 2001:1317 "Service Section"
export function Services() {
  return (
    <MotionSection className="bg-brand-gray overflow-hidden">
      <div className="container-max section-padding pt-20 lg:pt-28 pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT: chip + heading */}
          <div className="flex flex-col gap-4">
            <MotionDiv>
              <span className="chip inline-flex">
                <Settings className="h-3.5 w-3.5" />
                Our Services
              </span>
            </MotionDiv>
            <MotionDiv delay={0.1}>
              <h2 className="font-sans font-medium text-display-md text-brand-ink leading-tight">
                <span className="text-brand-orange">We Provide</span>{" "}
                Paper Solutions Designed for Every Industry
              </h2>
            </MotionDiv>
          </div>

          {/* RIGHT: body text + button */}
          <div className="flex flex-col gap-6 justify-between">
            <MotionDiv delay={0.15}>
              <p className="text-brand-body leading-[27px] text-[18px]">
                From design to delivery, we offer end-to-end solutions tailored to
                your space, style, and schedule. Whether you&apos;re updating one room or
                remodeling your entire home, Mahaveer Papers makes it seamless.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.2}>
              <Link href="/contact" className="btn-primary w-fit">
                Request Free Quote
                <span className="btn-icon-badge">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </MotionDiv>
          </div>
        </div>
      </div>

      <div className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-none pb-20 lg:pb-28 pl-4 sm:pl-6 lg:pl-8 pr-0">
        {serviceCards.map((card) => (
          <div
            key={card.id}
            className="
              group flex-shrink-0 relative cursor-pointer overflow-hidden rounded-[10px] bg-gray-200
              w-[72vw] h-[86.4vw]
              sm:w-[340px] sm:h-[408px]
              lg:w-[500px] lg:h-[600px]
            "
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 340px, 500px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient at bottom — Figma: #171717 solid fading to transparent over the bottom ~1/3 of the card */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#171717] to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-brand-gray font-medium text-lg lg:text-[24px] leading-tight lg:leading-[28.8px] lg:tracking-[-0.48px]">
                {card.name}
              </p>
              <p className="text-[#D4D4D4] text-sm lg:text-[16px] mt-1.5 leading-relaxed lg:leading-[24px] line-clamp-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden="true" />
      </div>
    </MotionSection>
  );
}
