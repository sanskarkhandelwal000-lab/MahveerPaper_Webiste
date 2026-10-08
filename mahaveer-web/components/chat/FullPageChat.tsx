"use client";

import { ArrowUp } from "lucide-react";
import { KoraMark, MessageBubble, SuggestedPrompts, TypingDots, useChatAssistant } from "@/components/chat/shared";

export function FullPageChat() {
  const { messages, input, setInput, loading, send, scrollRef } = useChatAssistant();

  return (
    <div className="flex h-dvh flex-col bg-[#ECE9E4]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 bg-brand-navy px-4 py-3.5 text-white shadow-md">
        <KoraMark className="h-10 w-10 text-lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-newsreader)] text-lg font-semibold leading-tight tracking-[0.2em] text-[#f1dba0]">KORA</p>
          <p className="flex items-center gap-1.5 text-xs leading-tight text-white/60">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            Paper concierge &middot; Mahaveer Papers
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {messages.length === 1 && <SuggestedPrompts onSelect={(prompt) => send(prompt)} />}
          {loading && (
            <div className="flex items-end gap-2">
              <KoraMark className="h-7 w-7 shrink-0 text-[13px]" />
              <div className="w-fit rounded-2xl rounded-bl-sm border border-gray-200 bg-white">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="shrink-0 border-t border-gray-200 bg-white px-3 py-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Mahaveer Papers…"
            disabled={loading}
            autoFocus
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
