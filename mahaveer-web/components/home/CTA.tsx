import Image from "next/image";
import { CalendarCheck, Phone } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { siteConfig } from "@/lib/config";

// Figma: MP file, node 2001:1385 "Section 5 / CTA"
export function CTA() {
  return (
    <MotionSection className="relative overflow-hidden py-24 lg:py-32">
      {/* Background photo — premium navy crumpled paper texture */}
      <Image
        src="/figma/cta-paper-navy.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Dark overlay — texture is already dark, lighter scrim for legibility */}
      <div className="absolute inset-0 bg-[#171717]/50" aria-hidden="true" />

      <div className="relative z-10 container-max section-padding text-center">
        <MotionDiv>
          <span className="chip mb-4 inline-flex">
            <CalendarCheck className="h-3.5 w-3.5" />
            Book Now
          </span>
        </MotionDiv>

        <MotionDiv delay={0.1}>
          <h2 className="font-sans font-medium text-display-lg text-white mx-auto mb-5 max-w-3xl">
            Ready to Elevate Your{" "}
            <span className="text-brand-orange">
              Paper Supply?
            </span>
          </h2>
        </MotionDiv>

        <MotionDiv delay={0.15}>
          <p className="text-[#E5E5E5] text-[18px] leading-[27px] max-w-[600px] mx-auto mb-10">
            Partner with Mahaveer Papers for consistent quality, scalable supply,
            and tailored solutions that fit your business needs.
          </p>
        </MotionDiv>

        <MotionDiv delay={0.2} className="flex items-center justify-center">
          <a
            href={`tel:${siteConfig.contact.whatsapp.replace(/\s/g, "")}`}
            className="btn-outline"
          >
            Call Us Now
            <span className="btn-icon-badge">
              <Phone className="h-5 w-5" />
            </span>
          </a>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
