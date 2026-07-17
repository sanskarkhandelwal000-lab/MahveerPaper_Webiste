"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

// Figma: MP file, node 2001:1271 "Section - Collection Grid"
export function Categories() {
  return (
    <section className="section-padding py-20 lg:py-28 bg-brand-gray" aria-label="Product categories">
      <div className="container-max">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-sans font-medium text-display-md text-brand-orange-light text-center mb-10 lg:mb-14"
        >
          Category
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={cat.href}
                className="group block"
                aria-label={`Explore ${cat.title}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="pt-6">
                  <h3 className="font-sans font-normal text-brand-orange text-2xl lg:text-[32px] leading-[1.2] lg:leading-[38.4px] tracking-[-0.64px] mb-2">
                    {cat.title}
                  </h3>
                  <p className="font-manrope text-sm text-[#434752] leading-relaxed mb-3">
                    {cat.description}
                  </p>
                  <ArrowUpRight className="h-2.5 w-2.5 text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
