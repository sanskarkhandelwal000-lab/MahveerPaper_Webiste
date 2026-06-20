import type { z } from "zod";
import type {
  categorySchema,
  faqSchema,
  serviceSchema,
  testimonialSchema,
} from "@/lib/validations";

export type Category = z.infer<typeof categorySchema>;
export type FAQ = z.infer<typeof faqSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};
