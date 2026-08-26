import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/products",
    "/digilux",
    "/sustainability",
    "/blog",
    ...blogPosts.map((post) => `/blog/${post.slug}`),
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
