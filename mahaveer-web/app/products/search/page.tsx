import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductsSearchResults } from "@/components/products/ProductsSearchResults";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Every Mahaveer Papers product matching your Paper Type, Application and Colour selection.",
  robots: { index: false, follow: true }, // filtered view — index the static /products page instead
};

export default function ProductsSearchPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="scroll-mt-[92px] pt-28 lg:pt-32">
        <ProductsSearchResults />
      </main>
      <Footer />
    </>
  );
}
