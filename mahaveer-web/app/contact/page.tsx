import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

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
    lines: ["Vasti Mall", "No.10, Cottonpet Main Road", "Bengaluru – 560053"],
    phone: "+91 81052 09002",
    phoneLabel: "Mobile/WhatsApp",
    email: "mppapier@yahoo.co.in",
    emailLabel: "Email Us",
  },
  {
    id: "ahmedabad",
    name: "Mahaveer Papers – Ahmedabad Branch",
    lines: ["D-11, Sumel Business Park – 6,", "Dudheshwar, Ahmedabad – 380004"],
    phone: "+91 73595 65678",
    phoneLabel: "Call Us Now",
    email: "bhavik@mahaveerpapers.com",
    emailLabel: "Email Us",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">

        {/* ── CONTACT FORM ── */}
        <ContactForm />

        {/* ── OFFICE LOCATIONS ── plain text, 2-col, no image cards */}
        <MotionSection className="bg-white section-padding py-10 lg:py-14">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              {offices.map((office, i) => (
                <MotionDiv key={office.id} delay={0.08 + i * 0.1}>
                  <h3 className="font-sans font-bold text-brand-navy text-lg lg:text-xl mb-3 leading-snug">
                    {office.name}
                  </h3>

                  <address className="not-italic text-gray-500 text-sm leading-relaxed mb-6">
                    {office.lines.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </address>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <a
                      href={`tel:${office.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 group-hover:bg-brand-orange transition-colors shrink-0">
                        <Phone className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{office.phoneLabel}</p>
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
                        <p className="text-xs text-gray-400 font-medium">{office.emailLabel}</p>
                        <p className="text-sm font-semibold text-brand-navy break-all">{office.email}</p>
                      </div>
                    </a>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── MAP ── Bengaluru wide view, centered & contained like Figma */}
        <div className="section-padding pb-14 lg:pb-20 bg-white">
          <div className="container-max">
            <div className="mx-auto overflow-hidden rounded-2xl" style={{ maxWidth: "60%", height: "420px" }}>
              <iframe
                title="Mahaveer Papers Head Office location"
                src="https://maps.google.com/maps?q=Mahaveer+Papers,+Cottonpet+Main+Road,+Bengaluru,+Karnataka+560053&t=m&z=15&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
