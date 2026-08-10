import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+\d\s\-()]{7,20}$/, "Please enter a valid phone number"),
  projectLocation: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location is too long"),
  applicationType: z
    .string()
    .min(1, "Please select a type"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const categorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  href: z.string(),
  tag: z.string().optional(),
});

export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  tag: z.string().optional(),
});

export const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  quote: z.string(),
  avatar: z.string(),
});
