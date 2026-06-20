export const siteConfig = {
  name: "Mahaveer Papers",
  tagline: "Your trusted partner in paper manufacturing and distribution.",
  description:
    "Mahaveer Papers delivers precision-made paper products designed to elevate quality, efficiency, and reliability across industries.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahaveerpapers.com",
  contact: {
    phones: ["080 49891846", "080 42100469"],
    whatsapp: "+91 81052 09002",
    emails: ["sales@mahaveerpapers.com", "mppapier@yahoo.co.in"],
  },
  offices: [
    {
      name: "Mahaveer Papers Head Office (Bangalore)",
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
    { value: "14+", label: "Years of Experience" },
    { value: "97%", label: "Client Retention Rate" },
  ],
} as const;
