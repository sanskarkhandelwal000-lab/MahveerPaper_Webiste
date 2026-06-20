import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mahaveer Papers for bulk paper enquiries, samples, or a free quote. Two offices: Bangalore and Ahmedabad.",
  alternates: { canonical: "/contact" },
};

const offices = [
  {
    id: "bangalore",
    name: "Mahaveer Papers – Head Office (Bangalore)",
    lines: ["Vasti Mall", "No. 110, Cottonpet Main Road", "Bengaluru – 560053"],
    phone: "+91 81052 09002",
    phoneLabel: "Mobile/WhatsApp",
    email: "mppapier@yahoo.co.in",
    emailLabel: "Email Us",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    id: "ahmedabad",
    name: "Mahaveer Papers – Ahmedabad Branch",
    lines: ["D-11, Sumel Business Park – 6,", "Dudheshwar, Ahmedabad – 380004"],
    phone: "+91 73595 65678",
    phoneLabel: "Call Us Now",
    email: "bhavik@mahaveerpapers.com",
    emailLabel: "Email Us",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ── HERO ── */}
        <section
          className="relative min-h-[55vh] flex items-end overflow-hidden pb-16 lg:pb-24"
          aria-label="Contact hero"
        >
          <Image
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,25,35,0.5) 0%, rgba(15,25,35,0.88) 70%, rgba(15,25,35,0.97) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 container-max section-padding pt-32 w-full">
            <MotionDiv className="max-w-2xl">
              <h1
                className="font-display italic text-white leading-tight mb-4"
                style={{ fontSize: "clamp(3rem,7vw,6rem)" }}
              >
                Get in{" "}
                <span className="text-brand-orange not-italic font-bold">Touch</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-md">
                Have a bulk order enquiry, need samples, or want to discuss your paper
                supply needs? We'd love to hear from you.
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* ── CONTACT FORM ── (reuses the shared component) */}
        <ContactForm />

        {/* ── OFFICE LOCATIONS ── */}
        {/* Figma: two offices side-by-side (x=137 and x=1109) in the Contact Us PDF */}
        <MotionSection className="section-padding py-16 lg:py-24 bg-brand-cream">
          <div className="container-max">
            <MotionDiv className="mb-10 lg:mb-14">
              <h2 className="font-sans font-bold text-display-md text-brand-navy leading-tight">
                Our{" "}
                <span className="font-display italic text-brand-orange">Offices</span>
              </h2>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {offices.map((office, i) => (
                <MotionDiv key={office.id} delay={0.1 + i * 0.1}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    {/* Office photo */}
                    <div className="relative h-52 lg:h-60 overflow-hidden bg-gray-100">
                      <Image
                        src={office.image}
                        alt={office.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-6 lg:p-8 flex flex-col gap-5">
                      {/* Office name */}
                      <h3 className="font-bold text-brand-navy text-lg lg:text-xl leading-snug">
                        {office.name}
                      </h3>

                      {/* Address */}
                      <address className="not-italic flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                        <MapPin className="h-4 w-4 text-brand-orange mt-0.5 shrink-0" />
                        <div>
                          {office.lines.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </address>

                      {/* Contact details */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-gray-100">
                        <a
                          href={`tel:${office.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 group-hover:bg-brand-orange transition-colors shrink-0">
                            <Phone className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                              {office.phoneLabel}
                            </p>
                            <p className="text-sm font-semibold text-brand-navy">{office.phone}</p>
                          </div>
                        </a>
                        <a
                          href={`mailto:${office.email}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 group-hover:bg-brand-orange transition-colors shrink-0">
                            <Mail className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                              {office.emailLabel}
                            </p>
                            <p className="text-sm font-semibold text-brand-navy break-all">
                              {office.email}
                            </p>
                          </div>
                        </a>
                      </div>
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
