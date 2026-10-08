"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUp } from "lucide-react";
import { KoraMark, MessageBubble, SuggestedPrompts, TypingDots, useChatAssistant } from "@/components/chat/shared";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const { messages, input, setInput, loading, send, scrollRef } = useChatAssistant();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Revision brief: the greeting bubble was reappearing on every page load.
  // Show it at most once per browser session (sessionStorage survives
  // client-side navigation and full page reloads within the same tab, but
  // resets on a new session), rather than once per component mount.
  useEffect(() => {
    let alreadyGreeted = false;
    try {
      alreadyGreeted = sessionStorage.getItem("mpa-greeted") === "1";
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — fall back to showing once per mount
    }
    if (alreadyGreeted) return;

    const timer = setTimeout(() => {
      if (!hasOpenedRef.current) {
        setShowTeaser(true);
        try {
          sessionStorage.setItem("mpa-greeted", "1");
        } catch {
          // ignore — non-critical
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      setShowTeaser(false);
    }
  }, [open]);

  // The dedicated full-page chat has its own always-open interface — don't
  // double up with the floating launcher on top of it.
  if (pathname?.startsWith("/chat")) return null;

  return (
    <>
      {/* Floating launcher button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        <AnimatePresence>
          {showTeaser && !open && (
            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative mb-1 max-w-[230px] rounded-2xl rounded-br-md border border-gray-100 bg-white px-4 py-3 shadow-xl"
            >
              <button
                type="button"
                onClick={() => setShowTeaser(false)}
                aria-label="Dismiss greeting"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy text-white shadow-md transition-colors hover:bg-black"
              >
                <X className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-left"
              >
                <p className="font-[family-name:var(--font-newsreader)] text-base font-semibold tracking-wide text-brand-navy">
                  KORA
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                  Your paper concierge — tell me what you&apos;re making and I&apos;ll find the right paper.
                </p>
              </button>
              <span
                className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-gray-100 bg-white"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AnimatePresence>
            {!open && (
              <motion.span
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.5, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#e3c274]/40"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            aria-label={open ? "Close KORA chat" : "Chat with KORA, our paper concierge"}
            aria-expanded={open}
            className="relative flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-br from-[#12315f] via-brand-navy to-[#00112b] pl-2 pr-5 text-white shadow-[0_14px_36px_-8px_rgba(0,17,43,0.7)] ring-1 ring-[#e3c274]/50 transition-shadow duration-300 hover:shadow-[0_18px_44px_-6px_rgba(227,194,116,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3c274] focus-visible:ring-offset-2"
          >
            {open ? (
              <span className="flex h-10 w-10 items-center justify-center pr-1"><X className="h-5 w-5 text-[#e3c274]" /></span>
            ) : (
              <KoraMark className="h-10 w-10 bg-[#0b2349] text-lg" />
            )}
            <span className="font-[family-name:var(--font-newsreader)] text-[15px] font-semibold tracking-[0.22em] text-[#f1dba0]">KORA</span>
          </motion.button>
        </div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="KORA, Mahaveer Papers paper concierge"
            className="fixed bottom-24 right-4 z-50 flex h-[min(600px,calc(100vh-7rem))] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e3c274]/30 bg-gradient-to-br from-[#0b2349] to-[#00112b] px-5 py-4 text-white">
              <KoraMark className="h-10 w-10 text-lg" />
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-newsreader)] text-lg font-semibold leading-tight tracking-[0.2em] text-[#f1dba0]">KORA</p>
                <p className="flex items-center gap-1.5 text-xs leading-tight text-white/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  Paper concierge &middot; Mahaveer Papers
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-brand-gray/50 p-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} onSampleClick={() => setOpen(false)} />
              ))}
              {messages.length === 1 && (
                <SuggestedPrompts onSelect={(prompt) => send(prompt)} />
              )}
              {loading && (
                <div className="flex items-end gap-2">
                  <KoraMark className="h-7 w-7 shrink-0 text-[13px]" />
                  <div className="w-fit rounded-2xl rounded-bl-sm border border-gray-200 bg-white">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask KORA about any paper"
                disabled={loading}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp className="h-4.5 w-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
