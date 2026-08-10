"use client";

import Image from "next/image";
import { Suspense, useEffect } from "react";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Phone, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { APPLICATION_TYPES } from "@/lib/contactOptions";

function ProductBanner() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product");
  if (!product) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-brand-orange/30 bg-brand-orange/5 px-4 py-3">
      <span className="mt-0.5 h-2 w-2 rounded-full bg-brand-orange shrink-0" />
      <p className="text-sm text-brand-navy">
        <span className="font-semibold">Enquiry regarding:</span>{" "}
        <span className="text-brand-orange font-medium">{product}</span>
      </p>
    </div>
  );
}

function FormPrefiller({ setValue }: { setValue: UseFormSetValue<ContactFormValues> }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const applicationType = searchParams.get("applicationType");
    const message = searchParams.get("message");
    if (applicationType) setValue("applicationType", applicationType, { shouldValidate: true });
    if (message) setValue("message", message, { shouldValidate: true });
  }, [searchParams, setValue]);
  return null;
}

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Quote request sent!", {
        description: "We'll get back to you within 24 hours. Check your inbox for a confirmation.",
      });
      reset();
    } catch {
      toast.error("Something went wrong", {
        description: `Please try again or email us directly at ${siteConfig.contact.emails[0]}`,
      });
    }
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
            className="font-sans font-medium text-display-md text-brand-ink leading-tight"
          >
            Let&apos;s{" "}
            <span className="text-brand-orange">Talk</span>
          </h2>
          <p className="mt-2 text-brand-body text-lg">
            Let&apos;s Build Better Supply Chains Together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: image + contact info */}
          <div className="flex flex-col gap-6">
            {/* Paper mill — kraft rolls and finished packaging */}
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-brand-navy">
              <Image
                src="/images/mahaveer/lets-talk.jpg"
                alt="Mahaveer Papers production floor — kraft paper rolls and packaging"
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
                  <p className="text-lg font-medium text-brand-ink">Call Us Now</p>
                  <p className="text-base text-brand-body">
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
                  <p className="text-lg font-medium text-brand-ink">Email Us</p>
                  <p className="text-base text-brand-body">
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-brand-gray rounded-2xl p-6 sm:p-8"
          >
            <div className="sm:col-span-2">
              <Suspense>
                <ProductBanner />
                <FormPrefiller setValue={setValue} />
              </Suspense>
            </div>
            <Field
              label="Full Name"
              required
              error={errors.fullName?.message}
              htmlFor="fullName"
            >
              <input
                id="fullName"
                type="text"
                placeholder="Rahul Mehta"
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
                placeholder="rahul@yourcompany.com"
                autoComplete="email"
                className={cn(inputClass, errors.email && errorInputClass)}
                disabled={isSubmitting}
                {...register("email")}
              />
            </Field>

            <Field
              label="Phone Number"
              required
              error={errors.phone?.message}
              htmlFor="phone"
            >
              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className={cn(inputClass, errors.phone && errorInputClass)}
                disabled={isSubmitting}
                {...register("phone")}
              />
            </Field>

            <Field
              label="City"
              required
              error={errors.projectLocation?.message}
              htmlFor="projectLocation"
            >
              <input
                id="projectLocation"
                type="text"
                placeholder="Bengaluru"
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
                label="Application"
                required
                error={errors.applicationType?.message}
                htmlFor="applicationType"
              >
                <select
                  id="applicationType"
                  className={cn(
                    inputClass,
                    "cursor-pointer",
                    errors.applicationType && errorInputClass
                  )}
                  disabled={isSubmitting}
                  defaultValue=""
                  {...register("applicationType")}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {APPLICATION_TYPES.map((t) => (
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
                className="inline-flex items-center justify-between gap-4 bg-brand-dark hover:bg-black text-white text-sm font-normal rounded-full px-6 py-3 w-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending…</span>
                    <span className="btn-icon-badge h-8 w-8">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  </>
                ) : (
                  <>
                    <span>Check Price & Availability</span>
                    <span className="btn-icon-badge h-8 w-8">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
