"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { CatalogProduct } from "@/data/products";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  products?: CatalogProduct[];
  sampleRequest?: { href: string } | null;
  isSeed?: boolean;
  isError?: boolean;
}

function makeWelcomeMessage(): ChatMessage {
  return {
    id: "seed",
    role: "assistant",
    isSeed: true,
    createdAt: Date.now(),
    content:
      "Hi, I'm the Mahaveer Papers AI assistant. I can help you find the right paper, check what it's best suited for, and get a sample sent over. What are you working on?",
  };
}

export const SUGGESTED_PROMPTS = [
  "White paper for wedding invitations",
  "Eco-friendly packaging paper",
  "Premium paper for printing",
  "I'd like to request a sample",
];

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** Shared conversation state + send logic used by both the floating widget and the full-page chat. */
export function useChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [makeWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => !m.isSeed)
            .map((m) => ({
              role: m.role,
              content: m.content,
              hadProducts: m.role === "assistant" ? Boolean(m.products?.length) : undefined,
            })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data: {
        reply: string;
        products: CatalogProduct[];
        sampleRequest?: { href: string } | null;
      } = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          createdAt: Date.now(),
          products: data.products,
          sampleRequest: data.sampleRequest,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          createdAt: Date.now(),
          isError: true,
          content:
            "Sorry, something went wrong on my end. Please try again, or reach our team directly via the contact form.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, send, scrollRef };
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

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-brand-orange hover:shadow-sm"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-brand-ink">{product.name}</p>
        <p className="truncate text-xs text-gray-500">
          {product.book} &middot; {product.gsm}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-orange" />
    </Link>
  );
}

function AssistantAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange/25 to-brand-orange/10 ring-1 ring-brand-orange/25",
        size === "sm" ? "h-7 w-7" : "h-8 w-8"
      )}
    >
      <Sparkles className={cn("text-brand-orange", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
    </div>
  );
}

/**
 * Renders one message row: assistant avatar (assistant only), bubble, timestamp,
 * product cards, and the sample-request CTA. Shared so the floating widget and
 * the full-page /chat surface stay visually identical.
 */
export function MessageBubble({
  message,
  onSampleClick,
}: {
  message: ChatMessage;
  onSampleClick?: () => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full items-end gap-2", isUser && "flex-row-reverse")}>
      {!isUser && <AssistantAvatar />}
      <div className={cn("flex max-w-[85%] flex-col gap-2 sm:max-w-[75%]", isUser && "items-end")}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm",
            isUser
              ? "rounded-br-sm bg-brand-navy text-white"
              : message.isError
                ? "rounded-bl-sm border border-red-200 bg-red-50 text-red-700"
                : "rounded-bl-sm border border-gray-200 bg-white text-gray-700"
          )}
        >
          {message.content}
        </motion.div>
        <span className={cn("px-1 text-[11px] text-gray-400", isUser && "text-right")}>
          {formatTime(message.createdAt)}
        </span>
        {message.products && message.products.length > 0 && (
          <div className="flex w-full min-w-[220px] flex-col gap-2">
            {message.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {message.sampleRequest && (
          <Link
            href={message.sampleRequest.href}
            onClick={onSampleClick}
            className="flex w-full min-w-[220px] items-center justify-center gap-2 rounded-full bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange-dark"
          >
            Request a Sample
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 pl-9">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-brand-orange hover:text-brand-orange"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
