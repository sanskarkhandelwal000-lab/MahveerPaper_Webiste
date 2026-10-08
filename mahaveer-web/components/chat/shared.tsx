"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChatOption { id: string; title: string }
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: number;
  /** Tap-to-answer choices, exactly as on WhatsApp (buttons or a list). */
  options?: ChatOption[];
  kind?: "list" | "buttons" | "text";
  image?: string | null;
  isError?: boolean;
}

interface ApiMessage { kind: "text" | "buttons" | "list"; text: string; options?: ChatOption[]; image?: string | null }

const STORE = "kora-chat-v1";
const SESSION = "kora-session-v1";

function sessionId(): string {
  try {
    let id = localStorage.getItem(SESSION);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(SESSION, id); }
    return id;
  } catch {
    return (globalThis as { __koraSession?: string }).__koraSession ??= crypto.randomUUID();
  }
}

/**
 * The website chat talks to the very same bot as WhatsApp (via /api/chat), so answers, buttons,
 * "Show images", "More options" and "More colours" behave identically on both.
 */
export function useChatAssistant(enabled = true) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const busy = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-80))); } catch { /* storage unavailable */ }
  }, [messages]);

  const post = useCallback(async (payload: { text?: string; buttonId?: string; title?: string }, shown?: ChatMessage) => {
    if (busy.current) return;
    busy.current = true;
    if (shown) setMessages((prev) => [...prev, shown]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId(), ...payload }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: { messages: ApiMessage[] } = await res.json();
      for (const [i, m] of data.messages.entries()) {
        if (i > 0) await new Promise((r) => setTimeout(r, 350));
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: m.text, createdAt: Date.now(), options: m.options, kind: m.kind, image: m.image }]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", createdAt: Date.now(), isError: true, text: "Sorry, something went wrong on my end. Please try again, or message us on WhatsApp and our team will help." }]);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);

  // First open: restore the conversation, or let the bot greet exactly as it does on WhatsApp.
  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;
    let saved: ChatMessage[] = [];
    try { saved = JSON.parse(sessionStorage.getItem(STORE) ?? "[]"); } catch { /* ignore */ }
    if (saved.length) setMessages(saved);
    else void post({ text: "Hi" });
  }, [enabled, post]);

  const send = (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || busy.current) return;
    setInput("");
    void post({ text }, { id: crypto.randomUUID(), role: "user", text, createdAt: Date.now() });
  };

  const choose = (o: ChatOption) => {
    if (busy.current) return;
    void post({ buttonId: o.id, title: o.title }, { id: crypto.randomUUID(), role: "user", text: o.title, createdAt: Date.now() });
  };

  return { messages, input, setInput, loading, send, choose, scrollRef };
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** WhatsApp-style *bold* and _italic_ markers. */
function renderInline(line: string): ReactNode[] {
  return line.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((part, i) => {
    if (/^\*[^*]+\*$/.test(part)) return <strong key={i} className="font-semibold text-brand-ink">{part.slice(1, -1)}</strong>;
    if (/^_[^_]+_$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
function renderWhatsApp(text: string): ReactNode {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {renderInline(line)}
    </Fragment>
  ));
}

/** kora's logo mark: a blue chat bubble with an orange folded corner and three typing dots. */
export function KoraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0", className)}>
      <path d="M14 4h30l14 14v26a10 10 0 0 1-10 10H29L12 63l3-9h-1A10 10 0 0 1 4 44V14A10 10 0 0 1 14 4Z" fill="#2F5BC0" />
      <path d="M44 4l14 14H50a6 6 0 0 1-6-6V4Z" fill="#F08A24" />
      <circle cx="19" cy="31" r="4.2" fill="#fff" />
      <circle cx="31" cy="31" r="4.2" fill="#fff" fillOpacity=".82" />
      <circle cx="43" cy="31" r="4.2" fill="#fff" fillOpacity=".62" />
    </svg>
  );
}

/** Mark plus the lowercase "kora" wordmark. */
export function KoraLogo({ className, markClass = "h-8 w-8", textClass = "text-2xl" }: { className?: string; markClass?: string; textClass?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <KoraMark className={markClass} />
      <span className={cn("font-[family-name:var(--font-manrope)] font-extrabold leading-none tracking-tight text-[#0f1a2e]", textClass)}>kora</span>
    </span>
  );
}


export function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gray-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function AssistantAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  return <KoraMark className={size === "sm" ? "h-7 w-7" : "h-8 w-8"} />;
}

/** One message row; shared so the floating widget and the full-page /chat surface stay identical. */
export function MessageBubble({ message, onChoose }: { message: ChatMessage; onChoose?: (o: ChatOption) => void }) {
  const isUser = message.role === "user";
  const asList = message.kind === "list";
  return (
    <div className={cn("flex w-full items-end gap-2", isUser && "flex-row-reverse")}>
      {!isUser && <AssistantAvatar />}
      <div className={cn("flex max-w-[88%] flex-col gap-2 sm:max-w-[78%]", isUser && "items-end")}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "overflow-hidden rounded-2xl text-[15px] leading-relaxed shadow-sm",
            isUser
              ? "rounded-br-sm bg-brand-navy px-4 py-2.5 text-white"
              : message.isError
                ? "rounded-bl-sm border border-red-200 bg-red-50 px-4 py-2.5 text-red-700"
                : "rounded-bl-sm border border-gray-200 bg-white text-gray-700"
          )}
        >
          {message.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={message.image} alt="" loading="lazy" className="aspect-square w-full max-w-[260px] object-cover" />
          )}
          <div className={cn(!isUser && !message.isError && "px-4 py-2.5")}>{isUser ? message.text : renderWhatsApp(message.text)}</div>
        </motion.div>
        {message.options && message.options.length > 0 && (
          <div className={cn("flex w-full min-w-[200px] gap-2", asList ? "flex-wrap" : "flex-col")}>
            {message.options.map((o) => (
              <button
                key={o.id + o.title}
                type="button"
                onClick={() => onChoose?.(o)}
                className={cn(
                  "rounded-full border border-[#2F5BC0]/30 bg-white px-4 py-2 text-sm font-medium text-[#2F5BC0] transition-colors hover:border-[#2F5BC0] hover:bg-[#2F5BC0] hover:text-white",
                  !asList && "w-full"
                )}
              >
                {o.title}
              </button>
            ))}
          </div>
        )}
        <span className={cn("px-1 text-[11px] text-gray-400", isUser && "text-right")}>{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}
