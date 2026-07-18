"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { MessageBubble, SuggestedPrompts, TypingDots, useChatAssistant } from "@/components/chat/shared";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpenedRef.current) setShowTeaser(true);
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
                <p className="text-sm font-medium text-brand-ink">
                  Happy to help! 👋
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  I&apos;m the AI assistant at Mahaveer Papers — how can I help you today?
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
                className="absolute inset-0 rounded-full bg-brand-orange/50"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label={open ? "Close chat" : "Open product assistant chat"}
            aria-expanded={open}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0c2f66] via-brand-navy to-[#00112b] text-white shadow-[0_12px_32px_-6px_rgba(234,88,12,0.5)] ring-1 ring-white/15 transition-shadow duration-300 hover:shadow-[0_16px_40px_-4px_rgba(234,88,12,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                  filter: [
                    "drop-shadow(0 0 0px rgba(234,88,12,0))",
                    "drop-shadow(0 0 6px rgba(234,88,12,0.7))",
                    "drop-shadow(0 0 0px rgba(234,88,12,0))",
                  ],
                }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{
                  rotate: { duration: 0.2 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                  filter: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <Sparkles className="h-6 w-6 text-brand-orange" strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
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
            aria-label="Paper recommendation assistant"
            className="fixed bottom-24 right-4 z-50 flex h-[min(600px,calc(100vh-7rem))] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-brand-navy px-5 py-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange/30 to-brand-orange/10 ring-1 ring-brand-orange/30">
                <Sparkles className="h-4.5 w-4.5 text-brand-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight">Paper Assistant</p>
                <p className="flex items-center gap-1.5 text-xs leading-tight text-white/50">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  Online &middot; Mahaveer Papers AI
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
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-brand-orange/25 to-brand-orange/10 ring-1 ring-brand-orange/25" />
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
                placeholder="e.g. white paper for wedding cards"
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
