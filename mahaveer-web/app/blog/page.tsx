import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert tips, industry trends, and actionable advice from the Mahaveer Papers team. Stay ahead in the paper and print industry.",
  alternates: { canonical: "/blog" },
};

const blogPosts = [
  {
    id: "sustainable-paper",
    category: "Sustainability",
    title: "How Sustainable Paper Practices Are Reshaping the Industry",
    date: "Nov 25, 2024",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=800&q=80",
    href: "/blog/sustainable-paper",
  },
  {
    id: "choose-right-paper",
    category: "Industry Tips",
    title: "How to Choose the Right Paper Grade for Your Packaging",
    date: "Nov 24, 2024",
    image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=800&q=80",
    href: "/blog/choose-right-paper",
  },
  {
    id: "gsm-guide",
    category: "Industry Tips",
    title: "GSM Guide: Understanding Paper Weight for Print Projects",
    date: "Nov 23, 2024",
    image: "https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=800&q=80",
    href: "/blog/gsm-guide",
  },
  {
    id: "kraft-vs-duplex",
    category: "Product Guide",
    title: "Kraft vs. Duplex Board: Which Is Right for Your Brand?",
    date: "Nov 22, 2024",
    image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&q=80",
    href: "/blog/kraft-vs-duplex",
  },
  {
    id: "digilux-luxury",
    category: "Product Guide",
    title: "Why DigiLux Papers Elevate Luxury Packaging and Print",
    date: "Nov 21, 2024",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    href: "/blog/digilux-luxury",
  },
  {
    id: "paper-carbon-footprint",
    category: "Sustainability",
    title: "Reducing Carbon Footprint in the Paper Supply Chain",
    date: "Nov 20, 2024",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    href: "/blog/paper-carbon-footprint",
  },
  {
    id: "bulk-paper-buying",
    category: "Insights",
    title: "5 Things to Consider Before Placing a Bulk Paper Order",
    date: "Nov 19, 2024",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    href: "/blog/bulk-paper-buying",
  },
  {
    id: "specialty-finishes",
    category: "Product Guide",
    title: "Metallic, Textured, Coated: A Guide to Specialty Paper Finishes",
    date: "Nov 18, 2024",
    image: "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=800&q=80",
    href: "/blog/specialty-finishes",
  },
  {
    id: "paper-trends-2025",
    category: "Insights",
    title: "Paper Industry Trends to Watch in 2025",
    date: "Nov 17, 2024",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    href: "/blog/paper-trends-2025",
  },
];

// Figma badge: white/light pill with orange text — subtle, not solid coloured
const categoryStyle: Record<string, string> = {
  Sustainability:    "bg-white/90 text-green-700",
  "Industry Tips":   "bg-white/90 text-brand-orange",
  "Product Guide":   "bg-white/90 text-amber-700",
  Insights:          "bg-white/90 text-brand-orange",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>

        {/* ── Full page lavender background ── */}
        <div className="bg-[#ECEEF8]">

          {/* ── HEADER ── centered, matches Figma position */}
          <MotionSection className="container-max section-padding pt-32 pb-12 lg:pt-44 lg:pb-16">
            <MotionDiv className="max-w-2xl mx-auto text-center">
              <p className="text-brand-orange font-medium text-base mb-4 tracking-wide">
                Our Blog
              </p>
              <h1
                className="font-display italic text-brand-navy leading-tight"
                style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)" }}
              >
                Explore expert tips, industry trends, and actionable advice to stay ahead in your field
              </h1>
            </MotionDiv>
          </MotionSection>

          {/* ── BLOG GRID — 2 columns matching Figma ── */}
          <MotionSection className="container-max section-padding pb-20 lg:pb-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {blogPosts.map((post, i) => (
                <MotionDiv key={post.id} delay={0.05 + (i % 6) * 0.07}>
                  <Link
                    href={post.href}
                    className="group block"
                    aria-label={post.title}
                  >
                    {/* Image — landscape, rounded, matches Figma card shape */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category badge — Figma: white pill, orange/colored text, bottom-left */}
                      <div className="absolute bottom-3 left-3">
                        <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${categoryStyle[post.category] ?? "bg-white/90 text-brand-orange"}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Title — Figma: medium weight, dark navy */}
                    <h2 className="font-medium text-brand-navy text-[18px] leading-snug mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Date */}
                    <p className="text-gray-400 text-sm">{post.date}</p>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </MotionSection>

        </div>

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
