"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

/**
 * Counts up from 0 to the numeric part of `value` once it scrolls into view.
 * Non-numeric characters (e.g. a trailing "+") are preserved and appended
 * after the animated digits, so values like "30+" still animate the "30".
 */
export function Counter({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState("0");

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    // Reduced motion skips the tween entirely (nothing to animate, so nothing
    // to set from this effect) — the final value is rendered directly below instead.
    if (!inView || target === null || prefersReduced) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, target, duration, prefersReduced]);

  if (target === null) {
    // Not a leading number (shouldn't happen for current stats) — just show as-is.
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {prefersReduced && inView ? target : display}
      {suffix}
    </span>
  );
}
