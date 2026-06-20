"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Phone, Mail } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const renovationTypes = [
  "Printing & Publishing",
  "Packaging",
  "School & Office Supplies",
  "High-End Printing",
  "Industrial / Specialty",
  "Other",
];

function Field({
  label,
  required,
  error,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}{" "}
        {required && (
          <span className="text-brand-orange" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = cn(
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400",
  "focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20",
  "disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
);

const errorInputClass = "border-red-400 focus:border-red-400 focus:ring-red-400/20";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Form data:", data);
    toast.success("Quote request sent!", {
      description: "We'll get back to you within 24 hours.",
    });
    reset();
  };

  return (
    <section
      className="section-padding py-20 lg:py-28 bg-white"
      aria-labelledby="contact-heading"
    >
      <div className="container-max">
        {/* Section header */}
        <div className="mb-10">
          <span className="chip inline-flex mb-4">Request a Quote</span>
          <h2
            id="contact-heading"
            className="font-sans font-bold text-display-md text-brand-navy leading-tight"
          >
            Let&apos;s{" "}
            <span className="font-display italic text-brand-orange">Talk</span>
          </h2>
          <p className="mt-2 text-gray-500 text-lg">
            Let&apos;s Build Better Supply Chains Together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: image + contact info */}
          <div className="flex flex-col gap-6">
            {/* Interior photo */}
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-brand-navy">
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                alt="Our office space"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Contact details */}
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href={`tel:${siteConfig.contact.whatsapp.replace(/\s/g, "")}`}
                className="flex items-center gap-3 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 group-hover:bg-brand-orange transition-colors shrink-0">
                  <Phone className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Call Us Now
                  </p>
                  <p className="text-sm font-semibold text-brand-navy">
                    {siteConfig.contact.whatsapp}
                  </p>
                </div>
              </a>
              <a
                href={`mailto:${siteConfig.contact.emails[0]}`}
                className="flex items-center gap-3 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 group-hover:bg-brand-orange transition-colors shrink-0">
                  <Mail className="h-4 w-4 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Email Us
                  </p>
                  <p className="text-sm font-semibold text-brand-navy">
                    {siteConfig.contact.emails[0]}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Request a quote form"
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <Field
              label="Full Name"
              required
              error={errors.fullName?.message}
              htmlFor="fullName"
            >
              <input
                id="fullName"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                className={cn(inputClass, errors.fullName && errorInputClass)}
                disabled={isSubmitting}
                {...register("fullName")}
              />
            </Field>

            <Field
              label="Email Address"
              required
              error={errors.email?.message}
              htmlFor="email"
            >
              <input
                id="email"
                type="email"
                placeholder="jane@framer.com"
                autoComplete="email"
                className={cn(inputClass, errors.email && errorInputClass)}
                disabled={isSubmitting}
                {...register("email")}
              />
            </Field>

            <Field
              label="Phone Number (optional)"
              error={errors.phone?.message}
              htmlFor="phone"
            >
              <input
                id="phone"
                type="tel"
                placeholder="+1 (951) 239 0523"
                autoComplete="tel"
                className={cn(inputClass, errors.phone && errorInputClass)}
                disabled={isSubmitting}
                {...register("phone")}
              />
            </Field>

            <Field
              label="Project Location"
              required
              error={errors.projectLocation?.message}
              htmlFor="projectLocation"
            >
              <input
                id="projectLocation"
                type="text"
                placeholder="California"
                autoComplete="address-level2"
                className={cn(
                  inputClass,
                  errors.projectLocation && errorInputClass
                )}
                disabled={isSubmitting}
                {...register("projectLocation")}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Type of Renovation"
                required
                error={errors.renovationType?.message}
                htmlFor="renovationType"
              >
                <select
                  id="renovationType"
                  className={cn(
                    inputClass,
                    "cursor-pointer",
                    errors.renovationType && errorInputClass
                  )}
                  disabled={isSubmitting}
                  defaultValue=""
                  {...register("renovationType")}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {renovationTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Message / Project Brief"
                required
                error={errors.message?.message}
                htmlFor="message"
              >
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Write your project details..."
                  className={cn(
                    inputClass,
                    "resize-none",
                    errors.message && errorInputClass
                  )}
                  disabled={isSubmitting}
                  {...register("message")}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Request Free Quote"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
