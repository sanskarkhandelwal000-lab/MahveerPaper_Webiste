import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import { FaviniBanner } from "@/components/home/FaviniBanner";
import { Services } from "@/components/home/Services";
import { DigiluxBanner } from "@/components/home/DigiluxBanner";
import { SustainabilityBanner } from "@/components/home/SustainabilityBanner";
import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/home/FAQ";
import { CompactCTA } from "@/components/home/CompactCTA";
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
        <FaviniBanner />
        <Services />
        <CTA />
        <DigiluxBanner />
        <SustainabilityBanner />
        <FAQ />
        <CompactCTA />
      </main>
      <Footer />
    </>
  );
}
