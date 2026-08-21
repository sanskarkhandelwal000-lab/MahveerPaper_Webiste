import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "bulk-supply",
    title: "Bulk Supply",
    description:
      "Consistent, large-scale paper supply with reliable lead times and competitive pricing for businesses of all sizes.",
    icon: "Package",
    tag: "Core Service",
  },
  {
    id: "custom-grades",
    title: "Custom Grades",
    description:
      "Bespoke paper formulations engineered to your exact weight, texture, coating, and opacity specifications.",
    icon: "Settings",
  },
  {
    id: "quality-assurance",
    title: "Quality Assurance",
    description:
      "ISO-compliant testing and grading for every batch, ensuring consistent performance across print, packaging, and speciality applications.",
    icon: "BadgeCheck",
  },
  {
    id: "sustainability",
    title: "Sustainable Sourcing",
    description:
      "Responsibly sourced papers from FSC-certified forests, with a clear roadmap to reduce our carbon footprint by 2030.",
    icon: "Leaf",
  },
  {
    id: "logistics",
    title: "Pan-India Logistics",
    description:
      "Warehousing and distribution from our Bengaluru and Ahmedabad hubs ensure timely delivery across India.",
    icon: "Truck",
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    description:
      "Expert guidance on paper selection, print compatibility, and supply chain optimisation from our specialist team.",
    icon: "MessageSquare",
  },
];
