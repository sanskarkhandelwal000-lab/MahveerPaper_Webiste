import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { catalogProducts, APP_TYPES, type AppType } from "@/data/products";
import { slugify } from "@/lib/utils";

type Props = { params: Promise<{ app: string }> };

function findAppType(slug: string): AppType | undefined {
  return APP_TYPES.find((a) => slugify(a) === slug);
}

export async function generateStaticParams() {
  return APP_TYPES.map((a) => ({ app: slugify(a) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { app: slug } = await params;
  const appType = findAppType(slug);
  if (!appType) return {};
  return {
    title: appType,
    description: `Browse every Mahaveer Papers product suited to ${appType}.`,
    alternates: { canonical: `/products/application/${slug}` },
  };
}

export default async function ApplicationPage({ params }: Props) {
  const { app: slug } = await params;
  const appType = findAppType(slug);
  if (!appType) notFound();

  const products = catalogProducts.filter((p) => p.app === appType);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px]">
        {/* ── HERO ── same as Products page: paper-roll photo + heading */}
        <section
          className="relative min-h-[70vh] flex items-end overflow-hidden"
          aria-label="Products hero"
        >
          <Image
            src="/images/mahaveer/products-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,8,0.15) 0%, rgba(10,10,8,0.55) 70%, rgba(10,10,8,0.75) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full container-max section-padding pt-36 pb-10">
            <MotionDiv className="max-w-3xl mb-6">
              <h1
                className="font-display italic font-normal text-white leading-[1.0] mb-5"
                style={{ fontSize: "clamp(2.5rem,7vw,6.5rem)", letterSpacing: "-0.02em" }}
              >
                <span className="text-brand-orange not-italic">Perfect for</span>
                <br />
                {appType}
              </h1>
              <p className="text-white/75 text-lg lg:text-2xl font-medium leading-snug">
                Browse every Mahaveer Papers product suited to {appType}.
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* ── APPLICATION LISTING — every product suited to this use case, no filters ── */}
        <div className="bg-white py-10 lg:py-16 px-9">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-400 mb-10 text-[15px]">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span className="text-gray-300">&gt;</span>
            <Link href="/products" className="hover:text-brand-orange transition-colors">Product</Link>
            <span className="text-gray-300">&gt;</span>
            <span className="font-medium" style={{ color: "#202020" }}>{appType}</span>
          </nav>

          <div className="mb-8 lg:mb-10">
            <h2 className="font-sans font-semibold" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", color: "#202020" }}>
              {appType}
            </h2>
            <p className="text-gray-400 font-normal mt-1" style={{ fontSize: "clamp(1rem,1.5vw,1.25rem)" }}>
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={0.04 + (i % 6) * 0.06} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
