import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompactCTA } from "@/components/home/CompactCTA";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guidance on paper weight, packaging and speciality finishes from the Mahaveer Papers team.",
  alternates: { canonical: "/blog" },
};

// Revision brief (Sustainability and Blog — "Launch decision"): the blog previously
// listed nine "Coming soon" cards dated Nov 2024, including a 2025-trend title with a
// stale date. Replaced with the three complete, published articles from data/blog.ts.
function BlogCard({ post, delay }: { post: (typeof blogPosts)[number]; delay: number }) {
  return (
    <MotionDiv delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block" aria-label={post.title}>
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4 shadow-[0_1px_3px_rgba(10,10,8,0.06)] transition-shadow duration-300 group-hover:shadow-[0_16px_36px_-14px_rgba(10,10,8,0.25)]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3">
            <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/90 text-brand-navy">
              {post.category}
            </span>
          </div>
        </div>

        <h2 className="font-medium text-brand-navy text-[18px] leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-brand-orange">
          {post.title}
        </h2>

        <p className="text-gray-400 text-sm">{post.date}</p>
      </Link>
    </MotionDiv>
  );
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">

        {/* ── Lavender header ── */}
        <div className="bg-[#ECEEF8]">
          <MotionSection className="container-max section-padding pt-32 pb-16 lg:pt-44 lg:pb-20">
            <MotionDiv className="max-w-2xl mx-auto">
              <p className="text-brand-orange font-medium text-base mb-4 tracking-wide">
                Our Blog
              </p>
              <h1
                className="font-display italic text-brand-navy leading-tight"
                style={{ fontSize: "clamp(1.5rem,2.4vw,2.25rem)" }}
              >
                Practical guidance on paper, packaging and{" "}
                <br className="hidden sm:block" />
                speciality finishes
              </h1>
            </MotionDiv>
          </MotionSection>
        </div>

        {/* ── BLOG GRID ── */}
        <MotionSection className="container-max section-padding py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} delay={0.05 + i * 0.07} />
            ))}
          </div>
        </MotionSection>

        <CompactCTA />
      </main>
      <Footer />
    </>
  );
}
