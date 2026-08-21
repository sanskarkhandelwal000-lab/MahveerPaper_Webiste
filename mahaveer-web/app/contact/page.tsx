import type { Metadata } from "next";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mahaveer Papers for bulk paper enquiries, samples, or a free quote. Two offices: Bengaluru and Ahmedabad.",
  alternates: { canonical: "/contact" },
};

const offices = [
  {
    id: "bangalore",
    badge: "Head Office",
    name: "Mahaveer Papers – Head Office (Bengaluru)",
    lines: ["Vasti Mall", "No.10, Cottonpet Main Road", "Bengaluru – 560053"],
    phone: "+91 81052 09002",
    phoneLabel: "Mobile/WhatsApp",
    // Explicitly labelled WhatsApp — link to wa.me rather than a plain tel: call.
    phoneHref: "https://wa.me/918105209002",
    email: "mppapier@yahoo.co.in",
    emailLabel: "Email Us",
    mapsQuery: "Mahaveer Papers, Vasti Mall, No.10 Cottonpet Main Road, Bengaluru 560053",
  },
  {
    id: "ahmedabad",
    badge: "Branch Office",
    name: "Mahaveer Papers – Ahmedabad Branch",
    lines: ["D-11, Sumel Business Park – 6,", "Dudheshwar, Ahmedabad – 380004"],
    phone: "+91 73595 65678",
    phoneLabel: "Call Us Now",
    phoneHref: "tel:+917359565678",
    email: "bhavik@mahaveerpapers.com",
    emailLabel: "Email Us",
    mapsQuery: "Mahaveer Papers, D-11 Sumel Business Park 6, Dudheshwar, Ahmedabad 380004",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px] pt-6">

        {/* ── CONTACT FORM ── */}
        <ContactForm headingLevel="h1" />

        {/* ── OFFICE LOCATIONS ── elevated cards with a section eyebrow, replacing
            the previous bare two-column text block */}
        <MotionSection className="bg-brand-gray/60 section-padding py-16 lg:py-24 border-t border-gray-100">
          <div className="container-max">
            <MotionDiv className="mb-10 lg:mb-14 text-center">
              <span className="chip mb-4 inline-flex">
                <Building2 className="h-3.5 w-3.5" />
                Our Offices
              </span>
              <h2 className="font-sans font-medium text-display-md text-brand-ink">
                Visit us in{" "}
                <span className="text-brand-orange">Bengaluru & Ahmedabad</span>
              </h2>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {offices.map((office, i) => (
                <MotionDiv key={office.id} delay={0.08 + i * 0.1}>
                  <div className="h-full rounded-2xl border border-gray-100 bg-white p-8 lg:p-10 shadow-[0_2px_12px_-4px_rgba(10,10,8,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(10,10,8,0.15)]">
                    <span className="chip mb-4 inline-flex">
                      <MapPin className="h-3.5 w-3.5" />
                      {office.badge}
                    </span>

                    <h3 className="font-sans font-normal text-gray-900 text-xl lg:text-2xl mb-3 leading-snug">
                      {office.name}
                    </h3>

                    <address className="not-italic text-gray-500 text-sm leading-relaxed mb-8">
                      {office.lines.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </address>

                    <div className="flex flex-col gap-5 border-t border-gray-100 pt-6 sm:flex-row sm:flex-wrap">
                      <a
                        href={office.phoneHref}
                        target={office.phoneHref.startsWith("https://wa.me") ? "_blank" : undefined}
                        rel={office.phoneHref.startsWith("https://wa.me") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange group-hover:bg-brand-orange transition-colors shrink-0">
                          <Phone className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-gray-900">{office.phoneLabel}</p>
                          <p className="text-sm text-gray-500">{office.phone}</p>
                        </div>
                      </a>

                      <a
                        href={`mailto:${office.email}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange group-hover:bg-brand-orange transition-colors shrink-0">
                          <Mail className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-gray-900">{office.emailLabel}</p>
                          <p className="text-sm text-gray-500 break-all">{office.email}</p>
                        </div>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange group-hover:bg-brand-orange transition-colors shrink-0">
                          <MapPin className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-gray-900">Get Directions</p>
                          <p className="text-sm text-gray-500">Open in Google Maps</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

      </main>
      <Footer />
    </>
  );
}
