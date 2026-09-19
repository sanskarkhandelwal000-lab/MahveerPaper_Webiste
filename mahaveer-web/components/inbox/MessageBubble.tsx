"use client";
import { Check, CheckCheck, Clock, AlertCircle, FileText, MapPin, User, Play, Bot, Megaphone, Reply, Smile, Copy, RotateCcw, Download } from "lucide-react";
import clsx from "clsx";
import type { MessageItem } from "@/lib/inbox/types";
import { clockTime } from "@/lib/inbox/client";
import { renderText } from "./format";
import { QUICK_REACTIONS } from "./EmojiPicker";

export function Ticks({ status }: { status: MessageItem["status"] }) {
  if (status === "queued") return <Clock className="h-3.5 w-3.5 text-wa-muted" aria-label="Sending" />;
  if (status === "failed") return <AlertCircle className="h-3.5 w-3.5 text-red-600" aria-label="Failed" />;
  if (status === "sent") return <Check className="h-4 w-4 text-wa-muted" aria-label="Sent" />;
  if (status === "delivered") return <CheckCheck className="h-4 w-4 text-wa-muted" aria-label="Delivered" />;
  return <CheckCheck className="h-4 w-4 text-wa-tick" aria-label="Read" />;
}

const mediaUrl = (m: MessageItem) => `/api/inbox/media/${m.id}`;

interface Props {
  m: MessageItem;
  active: boolean;
  onToggle: () => void;
  onReply: () => void;
  onReact: (emoji: string) => void;
  onRetry: () => void;
  onImage: (src: string) => void;
  onScrollToReply: (waId: string) => void;
  onChatWith: (phone: string) => void;
}

export function MessageBubble({ m, active, onToggle, onReply, onReact, onRetry, onImage, onScrollToReply, onChatWith }: Props) {
  const out = m.direction === "out";
  const mine = m.reactions.find((r) => r.from === "agent")?.emoji;
  const hasMedia = ["image", "video", "audio", "document", "sticker"].includes(m.type);
  const sender =
    m.sender_type === "bot" ? { icon: <Bot className="h-3 w-3" />, name: "Bot", color: "text-violet-700" }
    : m.sender_type === "campaign" ? { icon: <Megaphone className="h-3 w-3" />, name: "Campaign", color: "text-orange-700" }
    : m.sender_type === "agent" ? { icon: null, name: m.sender_name ?? "Team", color: "text-wa-dark" }
    : null;

  return (
    <div className={clsx("group flex w-full", out ? "justify-end" : "justify-start")} id={m.wa_message_id ? `msg-${m.wa_message_id}` : undefined}>
      <div className={clsx("relative max-w-[85%] sm:max-w-[70%]", m.reactions.length && "mb-3")}>
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={clsx("cursor-pointer rounded-lg px-2 py-1.5 text-[14.2px] leading-[19px] shadow-[0_1px_0.5px_rgba(11,20,26,.13)]", out ? "rounded-tr-none bg-wa-out" : "rounded-tl-none bg-white", m.status === "failed" && "ring-1 ring-red-300")}
        >
          {out && sender && (
            <p className={clsx("mb-0.5 flex items-center gap-1 text-[12px] font-medium", sender.color)}>{sender.icon}{sender.name}</p>
          )}
          {m.reply_preview && (
            <button onClick={(e) => { e.stopPropagation(); if (m.reply_to_wa_id) onScrollToReply(m.reply_to_wa_id); }}
              className={clsx("mb-1 block w-full rounded-md border-l-4 px-2 py-1 text-left text-[13px]", out ? "border-wa-green bg-black/5" : "border-violet-400 bg-black/5")}>
              <span className="block text-[12px] font-medium text-wa-dark">{m.reply_preview.direction === "out" ? "You" : "Customer"}</span>
              <span className="line-clamp-2 text-wa-muted">{m.reply_preview.body}</span>
            </button>
          )}

          {m.type === "image" || m.type === "sticker" ? (
            <button onClick={(e) => { e.stopPropagation(); onImage(mediaUrl(m)); }} className="block overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(m)} alt={m.caption ?? "Photo"} loading="lazy" className={clsx("max-h-80 rounded-md object-cover", m.type === "sticker" ? "h-32 w-32 bg-transparent" : "min-h-24 min-w-40 bg-black/5")} />
            </button>
          ) : m.type === "video" ? (
            <video controls preload="metadata" className="max-h-80 w-full rounded-md bg-black" onClick={(e) => e.stopPropagation()}><source src={mediaUrl(m)} type={m.mime_type ?? "video/mp4"} /></video>
          ) : m.type === "audio" ? (
            <audio controls preload="none" className="h-10 w-64 max-w-full" onClick={(e) => e.stopPropagation()}><source src={mediaUrl(m)} type={m.mime_type ?? "audio/ogg"} /></audio>
          ) : m.type === "document" ? (
            <a href={mediaUrl(m)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 rounded-md bg-black/5 p-3 hover:bg-black/10">
              <FileText className="h-8 w-8 shrink-0 text-red-500" />
              <span className="min-w-0 flex-1"><span className="block truncate font-medium">{m.filename ?? "Document"}</span><span className="text-xs text-wa-muted uppercase">{m.mime_type?.split("/").pop()}</span></span>
              <Download className="h-5 w-5 shrink-0 text-wa-muted" />
            </a>
          ) : m.type === "location" && m.location ? (
            <a href={`https://www.google.com/maps?q=${m.location.latitude},${m.location.longitude}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-64 max-w-full overflow-hidden rounded-md bg-black/5 hover:bg-black/10">
              <div className="flex h-24 items-center justify-center bg-emerald-100/60"><MapPin className="h-9 w-9 text-red-500" /></div>
              <div className="p-2.5"><p className="font-medium">{m.location.name ?? "Shared location"}</p>{m.location.address && <p className="text-xs text-wa-muted">{m.location.address}</p>}<p className="mt-1 text-xs text-[#027eb5] underline">Open in Google Maps</p></div>
            </a>
          ) : m.type === "contacts" && m.contacts ? (
            <div className="w-64 max-w-full space-y-1.5">
              {m.contacts.map((c, i) => {
                const phone = c.phones?.[0]?.phone;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-md bg-black/5 p-2.5">
                    <User className="h-8 w-8 shrink-0 rounded-full bg-gray-300 p-1.5 text-white" />
                    <div className="min-w-0 flex-1"><p className="truncate font-medium">{c.name?.formatted_name ?? "Contact"}</p><p className="text-xs text-wa-muted">{phone}</p></div>
                    {phone && <button onClick={(e) => { e.stopPropagation(); onChatWith(phone); }} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-wa-dark shadow-sm">Chat</button>}
                  </div>
                );
              })}
            </div>
          ) : null}

          {(m.body || m.caption) && (
            <p className={clsx("whitespace-pre-wrap break-words", hasMedia && "mt-1")}>{renderText((m.body ?? m.caption) as string)}</p>
          )}
          {m.interactive?.buttons && (
            <div className="mt-1.5 space-y-1">{m.interactive.buttons.map((b) => <div key={b} className="rounded-md bg-white/80 py-1.5 text-center text-[13px] font-medium text-[#027eb5]">{b}</div>)}</div>
          )}
          {m.type === "template" && <p className="mt-1 text-[11px] text-wa-muted">Template · {m.template_name}</p>}
          {m.type === "unsupported" && <p className="text-[12px] italic text-wa-muted">Open WhatsApp on your phone to see this message.</p>}

          <span className="float-right ml-3 mt-1 flex items-center gap-1 text-[11px] leading-none text-wa-muted">
            {clockTime(m.created_at)}
            {out && <Ticks status={m.status} />}
          </span>
          <span className="clear-both block" />
        </div>

        {m.reactions.length > 0 && (
          <div className={clsx("absolute -bottom-3 flex gap-0.5 rounded-full border border-wa-line bg-white px-1.5 py-0.5 text-[13px] shadow-sm", out ? "right-2" : "left-2")}>
            {m.reactions.map((r, i) => <span key={i} title={r.from === "agent" ? "Your reaction" : "Customer's reaction"}>{r.emoji}</span>)}
          </div>
        )}

        {m.status === "failed" && (
          <div className="mt-1 flex items-center justify-end gap-2 text-xs text-red-600">
            <span className="max-w-64 text-right">{m.error ?? "Not delivered"}</span>
            {m.type === "text" && <button onClick={onRetry} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-medium hover:bg-red-100"><RotateCcw className="h-3 w-3" />Retry</button>}
          </div>
        )}

        {active && (
          <div className={clsx("mt-1 flex flex-wrap items-center gap-1 rounded-full border border-wa-line bg-white p-1 shadow-md", out ? "justify-end" : "justify-start")} onClick={(e) => e.stopPropagation()}>
            <button onClick={onReply} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] hover:bg-wa-panel"><Reply className="h-4 w-4" />Reply</button>
            {(m.body || m.caption) && <button onClick={() => navigator.clipboard?.writeText((m.body ?? m.caption) as string)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] hover:bg-wa-panel"><Copy className="h-4 w-4" />Copy</button>}
            {!out && m.wa_message_id && (
              <span className="flex items-center gap-0.5 border-l border-wa-line pl-1">
                <Smile className="mx-1 h-4 w-4 text-wa-muted" />
                {QUICK_REACTIONS.map((e) => (
                  <button key={e} onClick={() => onReact(mine === e ? "" : e)} aria-label={`React ${e}`} className={clsx("flex h-8 w-8 items-center justify-center rounded-full text-lg hover:bg-wa-panel", mine === e && "bg-wa-out")}>{e}</button>
                ))}
              </span>
            )}
            {m.type === "video" && <Play className="hidden" />}
          </div>
        )}
      </div>
    </div>
  );
}
