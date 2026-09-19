"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Search, Plus, Pin, Check, CheckCheck, Bot, UserRound, X, MessageSquareText, AlertCircle, Tag } from "lucide-react";
import clsx from "clsx";
import { useApi, timeShort, api } from "@/lib/inbox/client";
import { displayName, type ConversationItem, type Label } from "@/lib/inbox/types";
import { Avatar, Empty, Spinner, Modal, Button, Field, inputCls } from "./ui";
import { toast } from "sonner";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "human", label: "Needs a human" },
  { key: "bot", label: "Bot-handled" },
  { key: "mine", label: "Mine" },
  { key: "unassigned", label: "Unassigned" },
  { key: "resolved", label: "Resolved" },
] as const;

export function ChatList() {
  const params = useParams<{ id?: string }>();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [label, setLabel] = useState<string>("");
  const [search, setSearch] = useState("");
  const [newChat, setNewChat] = useState(false);

  const qs = new URLSearchParams({ filter });
  if (search.trim()) qs.set("q", search.trim());
  if (label) qs.set("label", label);
  const { data, isLoading, error } = useApi<{ conversations: ConversationItem[] }>(`/conversations?${qs}`, { poll: 4000 });
  const { data: labelData } = useApi<{ labels: Label[] }>("/labels");
  const list = useMemo(() => data?.conversations ?? [], [data]);
  const labels = labelData?.labels ?? [];
  const pinned = useMemo(() => list.filter((c) => c.pinned), [list]);

  return (
    <>
      <header className="flex items-center justify-between px-4 pb-1 pt-3">
        <h1 className="text-[22px] font-semibold text-wa-ink">Chats</h1>
        <button onClick={() => setNewChat(true)} aria-label="New chat" title="New chat" className="flex h-10 w-10 items-center justify-center rounded-full text-wa-ink hover:bg-wa-panel"><Plus className="h-6 w-6" /></button>
      </header>

      <div className="px-3 pb-2 pt-1">
        <div className="flex items-center gap-3 rounded-lg bg-wa-panel px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-wa-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, number or message" aria-label="Search chats" className="w-full bg-transparent text-base outline-none placeholder:text-wa-muted sm:text-sm" />
          {search && <button onClick={() => setSearch("")} aria-label="Clear search"><X className="h-4 w-4 text-wa-muted" /></button>}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none]" role="tablist" aria-label="Filter chats">
        {FILTERS.map((f) => (
          <button key={f.key} role="tab" aria-selected={filter === f.key} onClick={() => setFilter(f.key)}
            className={clsx("shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition", filter === f.key ? "bg-wa-out text-wa-dark" : "bg-wa-panel text-wa-muted hover:bg-wa-line")}>
            {f.label}
          </button>
        ))}
      </div>
      {labels.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none]">
          <Tag className="h-3.5 w-3.5 shrink-0 text-wa-muted" />
          {labels.map((l) => (
            <button key={l.id} onClick={() => setLabel(label === l.id ? "" : l.id)}
              className={clsx("shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium transition", label === l.id ? "text-white" : "bg-white")}
              style={{ borderColor: l.color, color: label === l.id ? "#fff" : l.color, background: label === l.id ? l.color : undefined }}>
              {l.name}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto" role="list">
        {isLoading && !data && <div className="flex justify-center py-10"><Spinner /></div>}
        {error && !data && <Empty icon={<AlertCircle className="h-10 w-10" />} title="Couldn't load chats">Check your connection and try again.</Empty>}
        {data && list.length === 0 && (
          <Empty icon={<MessageSquareText className="h-12 w-12" />} title={search || label || filter !== "all" ? "No chats match" : "No chats yet"}>
            {search || label || filter !== "all" ? "Try a different search or filter." : "New WhatsApp messages will appear here. You can also start a chat with the + button."}
          </Empty>
        )}
        {list.map((c, i) => (
          <div key={c.id} role="listitem">
            {filter === "all" && !search && !label && pinned.length > 0 && i === pinned.length && <div className="border-t border-wa-line" />}
            <ChatRow c={c} active={params.id === c.id} />
          </div>
        ))}
      </div>
      {newChat && <NewChatModal onClose={() => setNewChat(false)} />}
    </>
  );
}

function ChatRow({ c, active }: { c: ConversationItem; active: boolean }) {
  const name = displayName(c);
  const unread = c.unread_count > 0;
  return (
    <Link href={`/inbox/c/${c.id}`} className={clsx("flex items-center gap-3 px-3 py-2.5 transition hover:bg-wa-hover", active && "bg-wa-sel")}>
      <Avatar name={name} size={49} />
      <div className="min-w-0 flex-1 border-b border-wa-line/70 pb-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className={clsx("truncate text-base text-wa-ink", unread && "font-semibold")}>{name}</span>
          <span className={clsx("shrink-0 text-xs", unread ? "font-medium text-wa-green" : "text-wa-muted")}>{timeShort(c.last_message_at)}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          {c.last_message_direction === "out" && <Check className="hidden" />}
          <p className={clsx("min-w-0 flex-1 truncate text-sm", unread ? "text-wa-ink" : "text-wa-muted")}>
            {c.last_message_direction === "out" && <span className="text-wa-muted">You: </span>}
            {c.last_message_preview}
          </p>
          {c.needs_human && <span title="Needs a human" className="flex h-5 items-center gap-0.5 rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-800"><UserRound className="h-3 w-3" />Human</span>}
          {!c.needs_human && !c.bot_paused && c.status === "open" && <span title="Bot is handling this chat"><Bot className="h-4 w-4 text-wa-muted/70" /></span>}
          {c.pinned && <Pin className="h-3.5 w-3.5 rotate-45 text-wa-muted" />}
          {unread && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-wa-unread px-1.5 text-xs font-semibold text-white">{c.unread_count}</span>}
        </div>
        {(c.labels.length > 0 || c.assignee_name) && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {c.labels.slice(0, 3).map((l) => <span key={l.id} className="rounded px-1.5 py-px text-[10px] font-medium text-white" style={{ background: l.color }}>{l.name}</span>)}
            {c.assignee_name && <span className="text-[11px] text-wa-muted">{c.labels.length > 0 ? "· " : ""}{c.assignee_name}</span>}
            {c.status === "resolved" && <CheckCheck className="h-3.5 w-3.5 text-wa-green" />}
          </div>
        )}
      </div>
    </Link>
  );
}

function NewChatModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  async function start() {
    setBusy(true);
    try {
      const r = await api<{ id: string }>("/conversations", { body: { phone, name: name || undefined } });
      onClose();
      router.push(`/inbox/c/${r.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start chat");
      setBusy(false);
    }
  }
  return (
    <Modal title="New chat" onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={start} busy={busy} disabled={phone.replace(/\D/g, "").length < 10}>Start chat</Button></>}>
      <div className="space-y-4">
        <Field label="WhatsApp number" hint="Include the country code, e.g. +91 98765 43210. A 10-digit number is treated as India (+91).">
          <input className={inputCls} type="tel" inputMode="tel" autoFocus placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Name (optional)"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <p className="rounded-lg bg-wa-panel p-3 text-xs text-wa-muted">WhatsApp only lets you message a new number with an approved <strong>template</strong>. After they reply, you can chat freely for 24 hours.</p>
      </div>
    </Modal>
  );
}
