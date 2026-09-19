"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";
import { ArrowLeft, Bot, UserRound, PanelRight, CheckCircle2, RotateCcw, ArrowDown, X, Pin, PinOff, MoreVertical, Clock } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { api, useApi, dayLabel, timeShort, ApiError } from "@/lib/inbox/client";
import { displayName, windowOpen, type ContactItem, type ConversationItem, type MessageItem, type NoteItem } from "@/lib/inbox/types";
import { Avatar, Spinner, Button } from "./ui";
import { MessageBubble } from "./MessageBubble";
import { Composer, type SendSpec } from "./Composer";
import { ContactPanel } from "./ContactPanel";

interface Detail {
  conversation: ConversationItem;
  contact: ContactItem;
  notes: NoteItem[];
  samples: Array<{ id: string; product_name: string; status: string; created_at: string }>;
}

const refreshLists = () => globalMutate((k) => typeof k === "string" && k.startsWith("/conversations"));

export function ChatView({ id }: { id: string }) {
  const router = useRouter();
  const { data: detail, mutate: mutateDetail, error: detailError } = useApi<Detail>(`/conversations/${id}`, { poll: 5000 });
  const { data: msgData, mutate: mutateMsgs, isLoading } = useApi<{ messages: MessageItem[] }>(`/conversations/${id}/messages`, { poll: 2500 });
  const [pending, setPending] = useState<MessageItem[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<MessageItem | null>(null);
  const [panel, setPanel] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches);
  const [menu, setMenu] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showJump, setShowJump] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const lastCount = useRef(0);

  const conv = detail?.conversation;
  const messages = useMemo(() => [...(msgData?.messages ?? []), ...pending], [msgData, pending]);

  // mark as read while the chat is open and visible
  useEffect(() => {
    if (conv && conv.unread_count > 0 && document.visibilityState === "visible") {
      void api(`/conversations/${id}/read`, { method: "POST", body: {} }).then(() => { void mutateDetail(); void refreshLists(); });
    }
  }, [conv, id, mutateDetail]);

  // scroll handling
  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);
  useEffect(() => {
    const n = messages.length;
    if (n === 0) return;
    const last = messages[n - 1];
    if (lastCount.current === 0 || atBottom.current || last.direction === "out") { scrollToBottom(lastCount.current !== 0); setShowJump(false); }
    else if (n > lastCount.current) setShowJump(true);
    lastCount.current = n;
  }, [messages, scrollToBottom]);

  async function patch(body: Record<string, unknown>) {
    try {
      await api(`/conversations/${id}`, { method: "PATCH", body });
      await mutateDetail();
      void refreshLists();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not update chat"); }
  }

  const send = useCallback(async (spec: SendSpec) => {
    const tempId = `tmp-${Date.now()}`;
    const optimistic: MessageItem = {
      id: tempId, conversation_id: id, wa_message_id: null, direction: "out", sender_type: "agent", sender_name: null,
      type: spec.kind === "media" ? spec.mediaKind : spec.kind, body: spec.kind === "text" ? spec.body : spec.kind === "template" ? "Sending template…" : null,
      caption: spec.kind === "media" ? spec.caption ?? null : null, media_id: null, media_path: null, mime_type: null, filename: spec.kind === "media" ? spec.filename : null,
      location: null, contacts: null, interactive: null, template_name: null, reply_to_wa_id: null, reply_preview: null, reactions: [],
      status: "queued", error: null, created_at: new Date().toISOString(),
    };
    setPending((p) => [...p, optimistic]);
    try {
      await api(`/conversations/${id}/messages`, { body: spec });
      await Promise.all([mutateMsgs(), mutateDetail()]);
      void refreshLists();
    } catch (e) {
      if (e instanceof ApiError && e.code === "WINDOW_CLOSED") { toast.error("24-hour window closed — send a template instead."); void mutateDetail(); }
      else toast.error(e instanceof Error ? e.message : "Could not send");
      throw e;
    } finally {
      setPending((p) => p.filter((m) => m.id !== tempId));
    }
  }, [id, mutateMsgs, mutateDetail]);

  async function react(m: MessageItem, emoji: string) {
    setActive(null);
    try { await api(`/messages/${m.id}/react`, { body: { emoji } }); await mutateMsgs(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not react"); }
  }

  async function chatWith(phone: string) {
    try { const r = await api<{ id: string }>("/conversations", { body: { phone } }); router.push(`/inbox/c/${r.id}`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not open chat"); }
  }

  function scrollToMsg(waId: string) {
    const el = document.getElementById(`msg-${waId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.classList.add("bg-yellow-100/70");
    setTimeout(() => el?.classList.remove("bg-yellow-100/70"), 1400);
  }

  if (detailError && !detail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-base font-medium">This chat couldn&apos;t be opened</p>
        <p className="text-sm text-wa-muted">It may have been removed.</p>
        <Button onClick={() => router.push("/inbox")}>Back to chats</Button>
      </div>
    );
  }
  if (!detail || !conv) return <div className="flex h-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;

  const name = displayName(conv);
  const open = windowOpen(conv.last_inbound_at);
  const botState = conv.needs_human ? { label: "Needs a human", tone: "bg-amber-100 text-amber-800", icon: <UserRound className="h-3.5 w-3.5" /> }
    : conv.bot_paused ? { label: "Bot paused", tone: "bg-gray-200 text-gray-700", icon: <UserRound className="h-3.5 w-3.5" /> }
    : { label: "Bot on", tone: "bg-violet-100 text-violet-800", icon: <Bot className="h-3.5 w-3.5" /> };

  let lastDay = "";
  return (
    <div className="flex h-full min-h-0">
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-wa-line bg-wa-panel px-2 py-2 sm:px-3">
          <button onClick={() => router.push("/inbox")} aria-label="Back to chats" className="flex h-10 w-10 items-center justify-center rounded-full text-wa-ink hover:bg-wa-line md:hidden"><ArrowLeft className="h-6 w-6" /></button>
          <button onClick={() => setPanel((p) => !p)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left" aria-label="Contact info">
            <Avatar name={name} size={40} />
            <div className="min-w-0">
              <p className="truncate text-base font-medium leading-tight">{name}</p>
              <p className="truncate text-[13px] text-wa-muted">+{conv.wa_id}<span className="hidden sm:inline">{conv.last_inbound_at ? ` · last message ${timeShort(conv.last_inbound_at).toLowerCase()}` : ""}</span></p>
            </div>
          </button>
          <button onClick={() => patch({ bot_paused: !conv.bot_paused && !conv.needs_human ? true : false })} title={conv.bot_paused || conv.needs_human ? "Hand back to the bot" : "Pause the bot for this chat"}
            className={clsx("flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium sm:px-3", botState.tone)}>{botState.icon}<span className="hidden sm:inline">{botState.label}</span></button>
          <button onClick={() => patch({ status: conv.status === "open" ? "resolved" : "open" })} title={conv.status === "open" ? "Mark resolved" : "Reopen"} aria-label={conv.status === "open" ? "Mark resolved" : "Reopen"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-wa-muted hover:bg-wa-line">{conv.status === "open" ? <CheckCircle2 className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}</button>
          <button onClick={() => setPanel((p) => !p)} aria-label="Toggle contact panel" className={clsx("hidden h-10 w-10 items-center justify-center rounded-full hover:bg-wa-line md:flex", panel ? "bg-wa-line text-wa-ink" : "text-wa-muted")}><PanelRight className="h-5 w-5" /></button>
          <div className="relative">
            <button onClick={() => setMenu((m) => !m)} aria-label="More" className="flex h-10 w-10 items-center justify-center rounded-full text-wa-muted hover:bg-wa-line"><MoreVertical className="h-5 w-5" /></button>
            {menu && (<>
              <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-wa-line bg-white py-2 shadow-xl">
                <button onClick={() => { setMenu(false); patch({ pinned: !conv.pinned }); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover">{conv.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}{conv.pinned ? "Unpin chat" : "Pin chat"}</button>
                <button onClick={() => { setMenu(false); patch({ bot_paused: !(conv.bot_paused || conv.needs_human) }); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover"><Bot className="h-4 w-4" />{conv.bot_paused || conv.needs_human ? "Hand back to bot" : "Pause bot"}</button>
                <button onClick={() => { setMenu(false); patch({ needs_human: !conv.needs_human, bot_paused: !conv.needs_human ? true : conv.bot_paused }); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover"><UserRound className="h-4 w-4" />{conv.needs_human ? "Clear \"needs a human\"" : "Flag as needs a human"}</button>
                <button onClick={() => { setMenu(false); setPanel(true); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover md:hidden"><PanelRight className="h-4 w-4" />Contact info</button>
              </div>
            </>)}
          </div>
        </header>

        <div className="relative min-h-0 flex-1">
          <div ref={scrollRef} onScroll={(e) => { const el = e.currentTarget; atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; if (atBottom.current) setShowJump(false); }}
            className="wa-wall absolute inset-0 overflow-y-auto px-3 py-3 sm:px-[6%]" onClick={() => setActive(null)}>
            {isLoading && !msgData && <div className="flex justify-center py-10"><Spinner /></div>}
            {msgData && messages.length === 0 && <p className="mx-auto mt-8 w-fit rounded-lg bg-wa-warn px-4 py-2 text-center text-sm text-amber-900">No messages yet. Send a template to start the conversation.</p>}
            <div className="mx-auto flex max-w-4xl flex-col gap-1">
              {messages.map((m, i) => {
                const day = dayLabel(m.created_at);
                const showDay = day !== lastDay;
                lastDay = day;
                const gap = i > 0 && messages[i - 1].direction !== m.direction ? "mt-2" : "";
                return (
                  <div key={m.id} className={gap}>
                    {showDay && <div className="sticky top-1 z-10 my-2 flex justify-center"><span className="rounded-lg bg-white/95 px-3 py-1 text-xs font-medium uppercase text-wa-muted shadow-sm">{day}</span></div>}
                    <MessageBubble m={m} active={active === m.id} onToggle={() => !m.id.startsWith("tmp-") && setActive((a) => (a === m.id ? null : m.id))}
                      onReply={() => { setReplyTo(m); setActive(null); }} onReact={(e) => react(m, e)} onRetry={() => m.body && send({ kind: "text", body: m.body })}
                      onImage={setLightbox} onScrollToReply={scrollToMsg} onChatWith={chatWith} />
                  </div>
                );
              })}
            </div>
            {!open && messages.length > 0 && (
              <p className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-lg bg-wa-warn px-3 py-1.5 text-xs text-amber-900"><Clock className="h-3.5 w-3.5" />24-hour window closed — only templates can be sent</p>
            )}
          </div>
          {showJump && (
            <button onClick={() => { scrollToBottom(true); setShowJump(false); }} className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-wa-dark shadow-lg"><ArrowDown className="h-4 w-4" />New messages</button>
          )}
        </div>

        {conv.bot_paused && !conv.needs_human && (
          <div className="flex items-center justify-between gap-3 border-t border-wa-line bg-white px-4 py-1.5 text-xs text-wa-muted">
            <span>The bot is paused for this chat — you&apos;re handling it.</span>
            <button onClick={() => patch({ bot_paused: false })} className="font-medium text-wa-dark hover:underline">Hand back to bot</button>
          </div>
        )}
        <Composer windowOpen={open} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} onSend={send} contactFirstName={(conv.name || conv.profile_name || "").split(" ")[0] || "there"} draftKey={id} />
      </div>

      {panel && <ContactPanel key={detail.contact.id} detail={detail} onClose={() => setPanel(false)} onChange={async () => { await mutateDetail(); void refreshLists(); }} />}
      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" aria-label="Close"><X className="h-6 w-6" /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
