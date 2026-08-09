"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

// Figma (Aug 2026 refresh): the nav is now a floating rounded capsule that sits a
// small margin from the top/sides and overlays whatever hero content is behind it,
// rather than a full-bleed solid bar — same links/CTA, new shell.
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // DigiLux keeps its own sub-brand mark in the same shared nav shell —
  // logo swaps, everything else (shell, links, CTA, mobile menu) stays uniform.
  const isDigiLux = pathname?.startsWith("/digilux") ?? false;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Subtle extra lift once the page has scrolled — a small cue that the
  // capsule is floating above content, without changing its shape or size.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Figma: the nav capsule runs noticeably wider than the site's 1200px content
          column — near edge-to-edge — so it gets its own wider max-width rather than
          reusing .container-max (which every other section still uses). */}
      <div className="max-w-[1600px] mx-auto section-padding pt-4 lg:pt-6">
        <nav
          className={cn(
            "relative flex h-[64px] lg:h-[72px] items-center justify-between rounded-full border border-white/15 bg-[#0B1220]/55 backdrop-blur-md px-4 lg:px-6 transition-shadow duration-300",
            scrolled ? "shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55)]" : "shadow-[0_4px_16px_-8px_rgba(0,0,0,0.3)]"
          )}
          aria-label="Main navigation"
        >
          {/* Logo — DigiLux sub-brand mark on /digilux, Mahaveer Papers everywhere else */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm"
            aria-label="Mahaveer Papers — Home"
          >
            {isDigiLux ? (
              <Image
                src="/images/digilux-logo.png"
                alt="DigiLux — Beyond Ordinary"
                width={124}
                height={47}
                className="h-7 w-auto lg:h-8 object-contain"
                priority
              />
            ) : (
              <Image
                src="/logo.png"
                alt="Mahaveer Papers"
                width={205}
                height={112}
                className="h-8 w-auto lg:h-9 object-contain"
                priority
              />
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative text-[15px] font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm px-1",
                    pathname === item.href
                      ? "text-brand-orange"
                      : "text-white/85 hover:text-white"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-1 right-1 -bottom-1 h-px bg-current origin-left transition-transform duration-300 ease-out",
                      pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link href="/contact" className="btn-light" aria-label="Contact us">
              Contact Us
              <span className="btn-icon-badge">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-white p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden absolute left-0 right-0 top-[calc(100%+8px)] rounded-3xl border border-white/15 bg-[#0B1220]/95 backdrop-blur-md shadow-2xl overflow-hidden"
              >
                <ul className="section-padding py-4 flex flex-col gap-1" role="list">
                  {siteConfig.nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-3 px-2 text-base font-normal rounded-md transition-colors",
                          pathname === item.href
                            ? "text-brand-orange"
                            : "text-brand-light hover:text-white hover:bg-white/5"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2">
                    <Link href="/contact" className="btn-light w-full justify-center">
                      Contact Us
                      <span className="btn-icon-badge">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
}
