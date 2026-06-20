import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { siteConfig } from "@/lib/config";

export function CTA() {
  return (
    <MotionSection className="relative overflow-hidden py-24 lg:py-32">
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-navy/80" aria-hidden="true" />

      <div className="relative z-10 container-max section-padding text-center">
        <MotionDiv>
          <span className="chip mb-6 inline-flex border-white/20 text-white/70">
            Book Now
          </span>
        </MotionDiv>

        <MotionDiv delay={0.1}>
          <h2 className="font-sans font-bold text-display-lg text-white leading-tight max-w-2xl mx-auto mb-5">
            Ready to Elevate Your{" "}
            <span className="font-display italic text-brand-orange">
              Paper Supply?
            </span>
          </h2>
        </MotionDiv>

        <MotionDiv delay={0.15}>
          <p className="text-white/65 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Partner with Mahaveer Papers for consistent quality, scalable supply,
            and tailored solutions that fit your business needs.
          </p>
        </MotionDiv>

        <MotionDiv
          delay={0.2}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/contact" className="btn-primary">
            Request Free Quote
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <ChevronRight className="h-3 w-3" />
            </span>
          </Link>
          <a
            href={`tel:${siteConfig.contact.whatsapp.replace(/\s/g, "")}`}
            className="btn-outline"
          >
            <Phone className="h-4 w-4" />
            Call Us Now
          </a>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
