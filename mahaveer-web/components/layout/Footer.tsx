import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ChevronRight, MessageCircle, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { MotionSection } from "@/components/ui/MotionSection";
import { MotionDiv } from "@/components/ui/MotionDiv";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.19 2.24.19v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.265.07 1.645.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.265.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.149 2.163 8.415 2.105 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.13 4.602.402 3.635 1.368 2.668 2.335 2.396 3.508 2.338 4.786 2.28 6.066 2.266 6.474 2.266 12c0 5.526.014 5.934.072 7.214.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.058-1.28.072-1.688.072-7.214 0-5.526-.014-5.934-.072-7.214-.058-1.278-.33-2.451-1.297-3.418C19.398.402 18.225.13 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// Blog is left out until it has real published posts (revision brief) — add it
// back in once /blog is no longer placeholder content.
const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "DigiLux", href: "/digilux" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-navy text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Hairline gradient accent at the very top edge, instead of a flat border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.5) 50%, transparent 100%)" }}
        aria-hidden="true"
      />
      {/* Soft radial glow — subtle depth instead of a flat solid navy fill */}
      <div
        className="pointer-events-none absolute -top-1/2 left-1/4 h-[600px] w-[600px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #EA580C 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <MotionSection className="relative container-max section-padding py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
          {/* Brand column */}
          <div className="flex flex-col items-center gap-6 text-center lg:col-span-1 lg:pr-8">
            <MotionDiv>
              <div className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]">
                <Image
                  src="/logo.png"
                  alt="Mahaveer Papers"
                  width={205}
                  height={112}
                  className="h-11 w-auto object-contain"
                />
              </div>
            </MotionDiv>
            <p className="font-display text-2xl font-normal italic text-white/90 leading-tight max-w-xs">
              {siteConfig.tagline}
            </p>
            <Link href="/contact" className="btn-light w-fit shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              Check Price & Availability
              <span className="btn-icon-badge">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Social — revision brief: these icons pointed nowhere ("#"),
                hide the row until real profile URLs are available rather
                than ship dead links. */}
            {(siteConfig.social.facebook !== "#" ||
              siteConfig.social.instagram !== "#" ||
              siteConfig.social.linkedin !== "#") && (
              <div className="flex items-center gap-3 mt-1">
                {siteConfig.social.facebook !== "#" && (
                  <a
                    href={siteConfig.social.facebook}
                    aria-label="Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#404040] text-white/80 transition-all duration-200 hover:bg-brand-orange hover:text-white hover:-translate-y-0.5"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {siteConfig.social.instagram !== "#" && (
                  <a
                    href={siteConfig.social.instagram}
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#404040] text-white/80 transition-all duration-200 hover:bg-brand-orange hover:text-white hover:-translate-y-0.5"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {siteConfig.social.linkedin !== "#" && (
                  <a
                    href={siteConfig.social.linkedin}
                    aria-label="LinkedIn"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#404040] text-white/80 transition-all duration-200 hover:bg-brand-orange hover:text-white hover:-translate-y-0.5"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange mb-6">
              Quick Links
              <span className="h-px w-8 bg-brand-orange/50" aria-hidden="true" />
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-base text-[#D4D4D4] transition-colors hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange mb-6">
              Contact Us
              <span className="h-px w-8 bg-brand-orange/50" aria-hidden="true" />
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              {siteConfig.contact.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="group flex items-center gap-2 text-base text-[#D4D4D4] transition-colors hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {phone}
                  </a>
                </li>
              ))}
              {siteConfig.contact.emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-center gap-2 text-base text-[#D4D4D4] transition-colors hover:text-white break-all"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {email}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}`}
                  className="group flex items-center gap-2 text-base text-[#D4D4D4] transition-colors hover:text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-base text-[#D4D4D4]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                Bengaluru &amp; Ahmedabad
              </li>
            </ul>
          </div>
        </div>
      </MotionSection>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container-max section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Mahaveer Papers. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
