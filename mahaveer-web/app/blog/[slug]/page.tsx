import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompactCTA } from "@/components/home/CompactCTA";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { MotionSection } from "@/components/ui/MotionSection";
import { blogPosts, getBlogPost } from "@/data/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { images: [{ url: post.image }] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        <article>
          {/* ── HERO ── */}
          <MotionSection className="bg-[#ECEEF8]">
            <div className="container-max section-padding pt-32 pb-10 lg:pt-44 lg:pb-14">
              <MotionDiv className="max-w-2xl">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy/70 hover:text-brand-navy mb-6"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Blog
                </Link>
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-brand-navy mb-4">
                  {post.category}
                </span>
                <h1
                  className="font-display italic text-brand-navy leading-tight mb-3"
                  style={{ fontSize: "clamp(1.75rem,3.2vw,2.75rem)" }}
                >
                  {post.title}
                </h1>
                <p className="text-gray-500 text-sm">{post.date}</p>
              </MotionDiv>
            </div>
          </MotionSection>

          {/* ── FEATURED IMAGE ── */}
          <div className="container-max section-padding -mt-6 lg:-mt-10 relative z-10">
            <MotionDiv>
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-[0_16px_36px_-14px_rgba(10,10,8,0.25)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
            </MotionDiv>
          </div>

          {/* ── CONTENT ── */}
          <MotionSection className="container-max section-padding py-14 lg:py-20">
            <div className="max-w-2xl mx-auto flex flex-col gap-5">
              {post.content.map((block, i) => {
                if (block.type === "h2") {
                  return (
                    <MotionDiv key={i} delay={0.03 * i}>
                      <h2 className="font-sans font-semibold text-brand-ink text-xl lg:text-2xl mt-4">
                        {block.text}
                      </h2>
                    </MotionDiv>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <MotionDiv key={i} delay={0.03 * i}>
                      <ul className="flex flex-col gap-2.5 pl-1">
                        {block.items?.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-brand-body text-[16px] leading-relaxed">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </MotionDiv>
                  );
                }
                return (
                  <MotionDiv key={i} delay={0.03 * i}>
                    <p className="text-brand-body text-[16px] lg:text-[17px] leading-[27px]">{block.text}</p>
                  </MotionDiv>
                );
              })}
            </div>
          </MotionSection>
        </article>

        <CompactCTA />
      </main>
      <Footer />
    </>
  );
}
