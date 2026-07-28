"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Subtle border/shadow once the page has scrolled — a small cue that the
  // bar is floating above content, without changing its colour or height.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-black border-b transition-[border-color,box-shadow] duration-300",
        scrolled ? "border-white/10 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.6)]" : "border-transparent"
      )}
    >
      <nav
        className="container-max section-padding flex h-[92px] items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm"
          aria-label="Mahaveer Papers — Home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={30}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="text-white text-lg font-normal tracking-tight">
            Mahaveer Papers
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6" role="list">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "group relative text-lg font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm px-1",
                  pathname === item.href
                    ? "text-brand-orange"
                    : "text-brand-light hover:text-white"
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
        <div className="hidden lg:flex items-center gap-4">
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
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-black border-t border-white/10"
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
    </header>
  );
}
