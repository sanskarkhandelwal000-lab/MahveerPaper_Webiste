import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
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

const featuredPosts = [
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
];

const blogPosts = [
  {
    id: "gsm-guide",
    category: "Industry Tips",
    title: "GSM Guide: Understanding Paper Weight for Print Projects",
    date: "Nov 23, 2024",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&q=80",
    href: "/blog/gsm-guide",
  },
  {
    id: "kraft-vs-duplex",
    category: "Product Guide",
    title: "Kraft vs. Duplex Board: Which Is Right for Your Brand?",
    date: "Nov 22, 2024",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=80",
    href: "/blog/kraft-vs-duplex",
  },
  {
    id: "digilux-luxury",
    category: "Product Guide",
    title: "Why DigiLux Papers Elevate Luxury Packaging and Print",
    date: "Nov 21, 2024",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    href: "/blog/digilux-luxury",
  },
  {
    id: "paper-carbon-footprint",
    category: "Sustainability",
    title: "Reducing Carbon Footprint in the Paper Supply Chain",
    date: "Nov 20, 2024",
    image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=600&q=80",
    href: "/blog/paper-carbon-footprint",
  },
  {
    id: "bulk-paper-buying",
    category: "Insights",
    title: "5 Things to Consider Before Placing a Bulk Paper Order",
    date: "Nov 19, 2024",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    href: "/blog/bulk-paper-buying",
  },
  {
    id: "specialty-finishes",
    category: "Product Guide",
    title: "Metallic, Textured, Coated: A Guide to Specialty Paper Finishes",
    date: "Nov 18, 2024",
    image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80",
    href: "/blog/specialty-finishes",
  },
  {
    id: "paper-trends-2025",
    category: "Insights",
    title: "Paper Industry Trends to Watch in 2025",
    date: "Nov 17, 2024",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&q=80",
    href: "/blog/paper-trends-2025",
  },
];

const categoryColors: Record<string, string> = {
  Sustainability: "bg-green-50 text-green-700",
  "Industry Tips": "bg-blue-50 text-blue-700",
  "Product Guide": "bg-amber-50 text-amber-800",
  Insights: "bg-purple-50 text-purple-700",
};

function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        categoryColors[label] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      <Tag className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>

        {/* ── BLOG HEADER ── Figma: chip "Our Blog" (fs=29), heading (fs=58), navy bg */}
        <MotionSection className="section-padding pt-32 pb-16 lg:pt-40 lg:pb-20 bg-brand-navy">
          <div className="container-max">
            <MotionDiv className="max-w-3xl">
              <span className="chip inline-flex mb-5 border-white/20 text-white/70">
                Our Blog
              </span>
              <h1
                className="font-sans font-bold text-white leading-tight"
                style={{ fontSize: "clamp(2rem,5vw,3.75rem)" }}
              >
                Explore expert tips, industry trends, and{" "}
                <span className="font-display italic text-brand-orange">
                  actionable advice
                </span>{" "}
                to stay ahead in your field
              </h1>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* ── FEATURED ARTICLES (2 large cards) ── */}
        {/* Figma: two featured posts at the top, each roughly half width, taller images */}
        <MotionSection className="section-padding py-12 lg:py-16 bg-brand-cream">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
              {featuredPosts.map((post, i) => (
                <MotionDiv key={post.id} delay={0.1 + i * 0.1}>
                  <Link
                    href={post.href}
                    className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                    aria-label={post.title}
                  >
                    {/* Image — taller for featured */}
                    <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 lg:p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <CategoryBadge label={post.category} />
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                      </div>
                      <h2 className="font-bold text-brand-navy text-lg lg:text-2xl leading-snug group-hover:text-brand-orange transition-colors">
                        {post.title}
                      </h2>
                      <div className="mt-4 flex items-center gap-1 text-brand-orange text-sm font-medium">
                        Read more
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── BLOG GRID (3 columns) ── */}
        {/* Figma: 3-column grid of remaining articles */}
        <MotionSection className="section-padding py-12 lg:py-16 bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {blogPosts.map((post, i) => (
                <MotionDiv key={post.id} delay={0.05 + i * 0.07}>
                  <Link
                    href={post.href}
                    className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    aria-label={post.title}
                  >
                    <div className="relative h-44 sm:h-52 overflow-hidden bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <CategoryBadge label={post.category} />
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-brand-navy text-base lg:text-lg leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-1 text-brand-orange text-sm font-medium">
                        Read more
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
