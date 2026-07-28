"use client";

import { useEffect } from "react";

/**
 * The browser's native history scroll restoration fights Next.js's own
 * scroll-to-top-on-navigate logic — on a fresh push navigation the browser
 * can re-apply the previous page's scroll offset after Next already reset
 * it, leaving new pages opened mid-scroll instead of at the top. Handing
 * scroll restoration fully to Next.js avoids the conflict.
 */
export function ScrollRestorationFix() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}
