export const siteConfig = {
  name: "Mahaveer Papers",
  // Positioning per Aug 2026 revision brief: Mahaveer is a speciality-paper
  // merchant, stockist, curator and distributor — not a manufacturer.
  tagline: "Your trusted partner in speciality-paper sourcing, stocking and distribution.",
  description:
    "Since 1992, Mahaveer Papers has helped printers, designers, packaging converters and brands choose the right paper for every idea — curated global ranges, ready stock and practical print guidance.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahaveerpapers.com",
  contact: {
    phones: ["080 49891846", "080 42100469"],
    whatsapp: "+91 81052 09002",
    emails: ["sales@mahaveerpapers.com", "mppapier@yahoo.co.in"],
  },
  offices: [
    {
      name: "Mahaveer Papers Head Office (Bengaluru)",
      address: "Vasti Mall, No. 110, Cottonpet Main Road, Bengaluru 560053",
      phone: "+91 81052 09002",
      email: "mppapier@yahoo.co.in",
    },
    {
      name: "Mahaveer Papers Ahmedabad Branch",
      address: "D-11, Sumel Business Park 6, Dudheshwar, Ahmedabad 380004",
      phone: "+91 73595 65678",
      email: "bhavik@mahaveerpapers.com",
    },
  ],
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
  nav: [
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "DigiLux", href: "/digilux" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Blog", href: "/blog" },
  ],
  stats: [
    { value: "30+", label: "Years of Speciality-Paper Expertise — Est. 1992" },
    { value: "2", label: "Offices — Bengaluru & Ahmedabad" },
  ],
} as const;
