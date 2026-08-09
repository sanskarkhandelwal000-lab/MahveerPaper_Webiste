import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply to using the ${siteConfig.name} website and submitting enquiries through it.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "About this website",
    body: `This website is operated by ${siteConfig.name} to showcase our speciality-paper range and let printers, designers, converters and brands request samples, stock checks and quotes.`,
  },
  {
    title: "Product information",
    body: "We describe every product using the specifications, finishing and printing suitability we have verified for that item. Because paper stock, mill availability and pricing change, always confirm the current specification, price and stock position with our team before placing a bulk order.",
  },
  {
    title: "Quotes and orders",
    body: "Submitting a form on this website is an enquiry, not a confirmed order. A quotation becomes binding only once it is confirmed in writing by our sales team and, where applicable, an order is placed against it.",
  },
  {
    title: "Website content",
    body: "Text, images and product data on this site belong to Mahaveer Papers or are used with the relevant mill's or brand's permission, and may not be reproduced without our consent.",
  },
  {
    title: "Limitation of liability",
    body: "We make reasonable efforts to keep this website accurate and up to date, but it is provided “as is” and we're not liable for decisions made solely on website content without confirming specifications with our team first.",
  },
  {
    title: "Contact us about these terms",
    body: `Questions about these terms can be sent to ${siteConfig.contact.emails[0]}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        <section className="bg-white section-padding pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="container-max max-w-3xl">
            <h1 className="font-sans font-semibold text-brand-navy mb-3" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              Terms of Service
            </h1>
            <p className="text-gray-400 text-sm mb-12">Last updated: August 2026</p>

            <div className="flex flex-col gap-10">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="font-sans font-semibold text-brand-navy text-xl mb-2">{s.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
