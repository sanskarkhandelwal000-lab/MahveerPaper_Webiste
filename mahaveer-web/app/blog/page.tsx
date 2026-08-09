import type { Metadata } from "next";
import Image from "next/image";
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
    image: "/images/mahaveer/kraft-paper.jpg",
    href: "/blog/sustainable-paper",
  },
  {
    id: "choose-right-paper",
    category: "Industry Tips",
    title: "How to Choose the Right Paper Grade for Your Packaging",
    date: "Nov 24, 2024",
    image: "/figma/category-packaging.jpg",
    href: "/blog/choose-right-paper",
  },
  {
    id: "gsm-guide",
    category: "Industry Tips",
    title: "GSM Guide: Understanding Paper Weight for Print Projects",
    date: "Nov 23, 2024",
    image: "/figma/paper-texture.jpg",
    href: "/blog/gsm-guide",
  },
  {
    id: "kraft-vs-duplex",
    category: "Product Guide",
    title: "Kraft vs. Duplex Board: Which Is Right for Your Brand?",
    date: "Nov 22, 2024",
    image: "/images/mahaveer/kraft-board.jpg",
    href: "/blog/kraft-vs-duplex",
  },
  {
    id: "digilux-luxury",
    category: "Product Guide",
    title: "Why DigiLux Papers Elevate Luxury Packaging and Print",
    date: "Nov 21, 2024",
    image: "/figma/digilux-parchment.jpg",
    href: "/blog/digilux-luxury",
  },
  {
    id: "paper-carbon-footprint",
    category: "Sustainability",
    title: "Reducing Carbon Footprint in the Paper Supply Chain",
    date: "Nov 20, 2024",
    image: "/figma/paper-roll.jpg",
    href: "/blog/paper-carbon-footprint",
  },
  {
    id: "bulk-paper-buying",
    category: "Insights",
    title: "5 Things to Consider Before Placing a Bulk Paper Order",
    date: "Nov 19, 2024",
    image: "/figma/svc-bulk.jpg",
    href: "/blog/bulk-paper-buying",
  },
  {
    id: "specialty-finishes",
    category: "Product Guide",
    title: "Metallic, Textured, Coated: A Guide to Specialty Paper Finishes",
    date: "Nov 18, 2024",
    image: "/figma/colored-papers.jpg",
    href: "/blog/specialty-finishes",
  },
  {
    id: "paper-trends-2025",
    category: "Insights",
    title: "Paper Industry Trends to Watch in 2025",
    date: "Nov 17, 2024",
    image: "/figma/hero-bg.jpg",
    href: "/blog/paper-trends-2025",
  },
];

// Figma badge: plain white pill, dark text — same style for every category
const badgeClass = "bg-white/90 text-brand-navy";

// Revision brief: don't link to article pages until they're actually published
// (every /blog/[slug] route currently 404s). These render as non-interactive
// previews with a "Coming soon" marker instead of dead links.
function BlogCard({ post, delay }: { post: (typeof blogPosts)[number]; delay: number }) {
  return (
    <MotionDiv delay={delay}>
      <div className="group block" aria-label={`${post.title} (coming soon)`}>
        {/* Image — landscape, rounded, matches Figma card shape */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4 shadow-[0_1px_3px_rgba(10,10,8,0.06)] transition-shadow duration-300 group-hover:shadow-[0_16px_36px_-14px_rgba(10,10,8,0.25)]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Category badge — Figma: white pill, dark text, bottom-left */}
          <div className="absolute bottom-3 left-3">
            <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${badgeClass}`}>
              {post.category}
            </span>
          </div>
        </div>

        {/* Title — Figma: medium weight, dark navy */}
        <h2 className="font-medium text-brand-navy text-[18px] leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-brand-orange">
          {post.title}
        </h2>

        {/* Date + coming-soon marker instead of a dead link */}
        <p className="text-gray-400 text-sm">
          {post.date} <span className="text-gray-300">·</span>{" "}
          <span className="text-brand-orange font-medium">Coming soon</span>
        </p>
      </div>
    </MotionDiv>
  );
}

export default function BlogPage() {
  const [featuredPosts, gridPosts] = [blogPosts.slice(0, 2), blogPosts.slice(2)];

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">

        {/* ── Lavender header + featured row ── */}
        <div className="bg-[#ECEEF8]">

          {/* ── HEADER ── box centered, text left-aligned, matches Figma position */}
          <MotionSection className="container-max section-padding pt-32 pb-12 lg:pt-44 lg:pb-16">
            <MotionDiv className="max-w-2xl mx-auto">
              <p className="text-brand-orange font-medium text-base mb-4 tracking-wide">
                Our Blog
              </p>
              <h1
                className="font-display italic text-brand-navy leading-tight"
                style={{ fontSize: "clamp(1.5rem,2.4vw,2.25rem)" }}
              >
                Explore expert tips, industry trends, and{" "}
                <br className="hidden sm:block" />
                actionable advice to stay ahead in your field
              </h1>
            </MotionDiv>
          </MotionSection>

          {/* ── FEATURED ROW — first 2 posts, 2 columns ── */}
          <MotionSection className="container-max section-padding pb-16 lg:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {featuredPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} delay={0.05 + i * 0.07} />
              ))}
            </div>
          </MotionSection>

        </div>

        {/* ── BLOG GRID — remaining posts, 3 columns, white background ── */}
        <MotionSection className="container-max section-padding py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {gridPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} delay={0.05 + (i % 6) * 0.07} />
            ))}
          </div>
        </MotionSection>

        {/* ── CONTACT FORM ── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
