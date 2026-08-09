import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import { Services } from "@/components/home/Services";
import { DigiluxBanner } from "@/components/home/DigiluxBanner";
import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/home/FAQ";
import { ContactForm } from "@/components/home/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Speciality Papers. Beyond Ordinary.`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        <Hero />
        <About />
        <Categories />
        <Services />
        <CTA />
        <FAQ />
        <DigiluxBanner />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
