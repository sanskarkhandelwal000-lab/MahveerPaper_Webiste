import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

// Revision brief: the full "Let's Talk" enquiry form was repeated on nearly every
// page, adding scroll and feeling repetitive. It now lives only on /contact
// (see ContactForm); every other page gets this compact horizontal strip instead.
export function CompactCTA() {
  return (
    <MotionSection className="section-padding py-14 lg:py-20 bg-white">
      <div className="container-max">
        <MotionDiv
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-gray-200 bg-brand-gray px-6 py-8 lg:px-10 lg:py-9"
        >
          <div>
            <h2 className="font-sans font-semibold text-xl lg:text-2xl text-brand-ink">
              Need Help Choosing the Right Paper?
            </h2>
            <p className="mt-1.5 text-brand-body text-base border-l-2 border-brand-orange pl-3">
              Speak with our team about samples, stock and paper selection.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact?applicationType=General+Paper+Requirement"
              className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Speak to a Paper Specialist
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?applicationType=Request+Samples"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3.5 font-semibold text-brand-ink transition-colors hover:bg-gray-50"
            >
              Request Samples
            </Link>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
