import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects the information you share through this website.`,
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "Information we collect",
    body: "When you use our contact and quote-request forms, we collect the details you provide directly — your name, email address, phone number, company or project location, and the message or project brief you enter. We do not collect payment information through this website.",
  },
  {
    title: "How we use your information",
    body: "We use the information you submit to respond to your enquiry, prepare a quote or sample request, and — where you've agreed to it — to follow up about your order or share relevant product updates. We do not sell or rent your information to third parties.",
  },
  {
    title: "How we store your information",
    body: "Enquiries submitted through this website are routed to our sales team's email and stored only for as long as needed to handle your enquiry and maintain our business records.",
  },
  {
    title: "Cookies and analytics",
    body: "This site may use basic analytics to understand how visitors use it, so we can improve the experience. This does not include tracking for advertising purposes.",
  },
  {
    title: "Your choices",
    body: "You can ask us to correct or delete the information we hold about you at any time by emailing us at the address below.",
  },
  {
    title: "Contact us about privacy",
    body: `Questions about this policy can be sent to ${siteConfig.contact.emails[0]}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        <section className="bg-white section-padding pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="container-max max-w-3xl">
            <h1 className="font-sans font-semibold text-brand-navy mb-3" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              Privacy Policy
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
