"use client";
import { useEffect, useRef, useState } from "react";
import { Smile, Paperclip, Send, X, Image as ImageIcon, FileText, MapPin, LayoutTemplate, Loader2, CornerUpLeft, Zap } from "lucide-react";
import clsx from "clsx";
import { api, useApi } from "@/lib/inbox/client";
import type { MessageItem, TemplateItem } from "@/lib/inbox/types";
import { EmojiPicker } from "./EmojiPicker";
import { Button, Field, Modal, inputCls } from "./ui";
import { toast } from "sonner";

export type SendSpec =
  | { kind: "text"; body: string; replyTo?: string | null }
  | { kind: "media"; path: string; mime: string; filename: string; mediaKind: "image" | "video" | "audio" | "document"; caption?: string; replyTo?: string | null }
  | { kind: "template"; templateId: string; params: string[] }
  | { kind: "location"; latitude: number; longitude: number; name?: string; address?: string };

interface Attachment { path: string; mime: string; filename: string; mediaKind: "image" | "video" | "audio" | "document"; preview?: string }

interface Props {
  windowOpen: boolean;
  replyTo: MessageItem | null;
  onCancelReply: () => void;
  onSend: (spec: SendSpec) => Promise<void>;
  contactFirstName: string;
  draftKey: string;
}

export function Composer({ windowOpen, replyTo, onCancelReply, onSend, contactFirstName, draftKey }: Props) {
  const [text, setText] = useState(() => { try { return sessionStorage.getItem(`draft:${draftKey}`) ?? ""; } catch { return ""; } });
  const [emoji, setEmoji] = useState(false);
  const [attachMenu, setAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState(false);
  const [location, setLocation] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const { data: qr } = useApi<{ replies: Array<{ id: string; shortcut: string; body: string }> }>("/quick-replies");

  // persist the draft per chat (ChatView is keyed by chat id, so state resets per chat)
  useEffect(() => {
    try { if (text) sessionStorage.setItem(`draft:${draftKey}`, text); else sessionStorage.removeItem(`draft:${draftKey}`); } catch { /* ignore */ }
  }, [text, draftKey]);
  useEffect(() => { if (replyTo) taRef.current?.focus(); }, [replyTo]);
  useEffect(() => {
    const el = taRef.current;
    if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 140)}px`; }
  }, [text]);

  const slash = text.startsWith("/") && !text.includes(" ") ? text.slice(1).toLowerCase() : null;
  const suggestions = slash !== null ? (qr?.replies ?? []).filter((r) => r.shortcut.includes(slash)).slice(0, 6) : [];

  async function upload(file: File) {
    setUploading(true);
    setAttachMenu(false);
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await api<Omit<Attachment, "preview">>("/upload", { form });
      let preview: string | undefined;
      if (r.mediaKind === "image") {
        preview = await new Promise<string>((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.readAsDataURL(file); });
      }
      setAttachment({ ...r, preview });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (sending || uploading) return;
    const body = text.trim();
    if (!attachment && !body) return;
    setSending(true);
    try {
      if (attachment) {
        await onSend({ kind: "media", path: attachment.path, mime: attachment.mime, filename: attachment.filename, mediaKind: attachment.mediaKind, caption: body || undefined, replyTo: replyTo?.wa_message_id });
      } else {
        await onSend({ kind: "text", body, replyTo: replyTo?.wa_message_id });
      }
      setText("");
      setAttachment(null);
      onCancelReply();
    } catch {
      /* the parent shows the error toast; keep the draft so nothing is lost */
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
      e.preventDefault();
      void submit();
    }
  }

  if (!windowOpen) {
    return (
      <div className="border-t border-wa-line bg-wa-panel px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-xl bg-wa-warn px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">It&apos;s been over 24 hours since this customer last messaged, so WhatsApp only allows an approved <strong>template</strong> message right now.</p>
          <Button onClick={() => setTemplates(true)} className="shrink-0"><LayoutTemplate className="h-4 w-4" />Send template</Button>
        </div>
        {templates && <TemplateModal onClose={() => setTemplates(false)} onSend={onSend} contactFirstName={contactFirstName} />}
      </div>
    );
  }

  return (
    <div className="relative border-t border-wa-line bg-wa-panel pb-[env(safe-area-inset-bottom)]">
      {replyTo && (
        <div className="flex items-start gap-3 border-b border-wa-line bg-white px-4 py-2">
          <CornerUpLeft className="mt-0.5 h-4 w-4 shrink-0 text-wa-dark" />
          <div className="min-w-0 flex-1 border-l-4 border-wa-green pl-2"><p className="text-xs font-medium text-wa-dark">Replying to {replyTo.direction === "out" ? "yourself" : "customer"}</p><p className="truncate text-sm text-wa-muted">{replyTo.body ?? replyTo.caption ?? `[${replyTo.type}]`}</p></div>
          <button onClick={onCancelReply} aria-label="Cancel reply"><X className="h-5 w-5 text-wa-muted" /></button>
        </div>
      )}
      {attachment && (
        <div className="flex items-center gap-3 border-b border-wa-line bg-white px-4 py-2">
          {attachment.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={attachment.preview} alt="" className="h-14 w-14 rounded-md object-cover" />
          ) : <div className="flex h-14 w-14 items-center justify-center rounded-md bg-wa-panel"><FileText className="h-6 w-6 text-wa-muted" /></div>}
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{attachment.filename}</p><p className="text-xs text-wa-muted">Add a caption below, then send</p></div>
          <button onClick={() => setAttachment(null)} aria-label="Remove attachment"><X className="h-5 w-5 text-wa-muted" /></button>
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="absolute inset-x-2 bottom-full z-20 mb-1 max-h-60 overflow-y-auto rounded-xl border border-wa-line bg-white py-1 shadow-xl">
          <p className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-wa-muted"><Zap className="h-3 w-3" />Quick replies</p>
          {suggestions.map((r) => (
            <button key={r.id} onClick={() => { setText(r.body); taRef.current?.focus(); }} className="block w-full px-4 py-2 text-left hover:bg-wa-hover"><span className="text-sm font-medium text-wa-dark">/{r.shortcut}</span><span className="line-clamp-1 text-sm text-wa-muted">{r.body}</span></button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1.5 px-2 py-2 sm:gap-2 sm:px-3">
        <div className="relative">
          <button onClick={() => { setEmoji((v) => !v); setAttachMenu(false); }} aria-label="Emoji" className="flex h-11 w-11 items-center justify-center rounded-full text-wa-muted hover:bg-wa-line"><Smile className="h-6 w-6" /></button>
          {emoji && <><div className="fixed inset-0 z-20" onClick={() => setEmoji(false)} /><div className="absolute bottom-full left-0 z-30 mb-2"><EmojiPicker onPick={(e) => { setText((t) => t + e); taRef.current?.focus(); }} /></div></>}
        </div>
        <div className="relative">
          <button onClick={() => { setAttachMenu((v) => !v); setEmoji(false); }} aria-label="Attach" className="flex h-11 w-11 items-center justify-center rounded-full text-wa-muted hover:bg-wa-line">{uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}</button>
          {attachMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setAttachMenu(false)} />
              <div className="absolute bottom-full left-0 z-30 mb-2 w-52 rounded-xl border border-wa-line bg-white py-2 shadow-xl">
                <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover"><ImageIcon className="h-5 w-5 text-violet-600" />Photo or video</button>
                <button onClick={() => docRef.current?.click()} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover"><FileText className="h-5 w-5 text-blue-600" />Document or audio</button>
                <button onClick={() => { setAttachMenu(false); setLocation(true); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover"><MapPin className="h-5 w-5 text-emerald-600" />Location</button>
                <button onClick={() => { setAttachMenu(false); setTemplates(true); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-wa-hover"><LayoutTemplate className="h-5 w-5 text-orange-600" />Template</button>
              </div>
            </>
          )}
          <input ref={fileRef} type="file" hidden accept="image/jpeg,image/png,video/mp4,video/3gpp" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} />
          <input ref={docRef} type="file" hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} />
        </div>
        <div className="min-w-0 flex-1 rounded-3xl bg-white px-4 py-2.5">
          <textarea ref={taRef} rows={1} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} placeholder={attachment ? "Add a caption" : "Type a message  ·  / for quick replies"} aria-label="Message" enterKeyHint="send"
            className="block max-h-36 w-full resize-none bg-transparent text-base leading-[22px] outline-none placeholder:text-wa-muted sm:text-[15px]" />
        </div>
        <button onClick={submit} disabled={sending || uploading || (!text.trim() && !attachment)} aria-label="Send" className={clsx("flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wa-green text-white transition hover:bg-wa-dark disabled:bg-gray-300")}>
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
      {templates && <TemplateModal onClose={() => setTemplates(false)} onSend={onSend} contactFirstName={contactFirstName} />}
      {location && <LocationModal onClose={() => setLocation(false)} onSend={onSend} />}
    </div>
  );
}

function TemplateModal({ onClose, onSend, contactFirstName }: { onClose: () => void; onSend: (s: SendSpec) => Promise<void>; contactFirstName: string }) {
  const { data } = useApi<{ templates: TemplateItem[] }>("/templates");
  const approved = (data?.templates ?? []).filter((t) => t.status === "APPROVED");
  const [sel, setSel] = useState<TemplateItem | null>(null);
  const [params, setParams] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const bodyOf = (t: TemplateItem) => t.components.find((c) => c.type === "BODY")?.text ?? "";
  const nVars = sel ? Math.max(0, ...[...bodyOf(sel).matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]))) : 0;

  function choose(t: TemplateItem) {
    setSel(t);
    const n = Math.max(0, ...[...bodyOf(t).matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1])));
    setParams(Array.from({ length: n }, (_, i) => (i === 0 ? contactFirstName : "")));
  }
  const preview = sel ? bodyOf(sel).replace(/\{\{(\d+)\}\}/g, (_, n) => params[Number(n) - 1] || `{{${n}}}`) : "";

  async function send() {
    if (!sel) return;
    setBusy(true);
    try {
      await onSend({ kind: "template", templateId: sel.id, params });
      onClose();
    } catch { setBusy(false); }
  }

  return (
    <Modal title={sel ? sel.name : "Send a template"} onClose={onClose} wide
      footer={sel ? <><Button variant="ghost" onClick={() => setSel(null)}>Back</Button><Button onClick={send} busy={busy} disabled={params.some((p) => !p.trim())}>Send</Button></> : undefined}>
      {!sel ? (
        approved.length === 0 ? <p className="py-6 text-center text-sm text-wa-muted">No approved templates yet. Create one on the Templates page — Meta usually approves within minutes to a day.</p> :
        <div className="space-y-2">{approved.map((t) => (
          <button key={t.id} onClick={() => choose(t)} className="block w-full rounded-xl border border-wa-line p-3 text-left hover:border-wa-green hover:bg-wa-hover">
            <p className="text-sm font-medium">{t.name} <span className="ml-1 text-xs font-normal text-wa-muted">{t.category.toLowerCase()}</span></p>
            <p className="mt-1 line-clamp-2 text-sm text-wa-muted">{bodyOf(t)}</p>
          </button>
        ))}</div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: nVars }, (_, i) => (
            <Field key={i} label={`Variable {{${i + 1}}}`}><input className={inputCls} value={params[i] ?? ""} onChange={(e) => setParams((p) => p.map((v, j) => (j === i ? e.target.value : v)))} /></Field>
          ))}
          <div className="rounded-xl bg-wa-wall p-4"><div className="max-w-sm rounded-lg rounded-tl-none bg-white p-3 text-sm shadow-sm whitespace-pre-wrap">{preview}</div></div>
        </div>
      )}
    </Modal>
  );
}

function LocationModal({ onClose, onSend }: { onClose: () => void; onSend: (s: SendSpec) => Promise<void> }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const valid = !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)) && lat !== "" && lng !== "" && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;
  async function send() {
    setBusy(true);
    try { await onSend({ kind: "location", latitude: Number(lat), longitude: Number(lng), name: name || undefined, address: address || undefined }); onClose(); } catch { setBusy(false); }
  }
  return (
    <Modal title="Send location" onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={send} busy={busy} disabled={!valid}>Send</Button></>}>
      <div className="space-y-4">
        <p className="text-sm text-wa-muted">In Google Maps, right-click (or long-press) the place and copy the two numbers shown — latitude then longitude.</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude"><input className={inputCls} inputMode="decimal" placeholder="12.9716" value={lat} onChange={(e) => setLat(e.target.value)} /></Field>
          <Field label="Longitude"><input className={inputCls} inputMode="decimal" placeholder="77.5946" value={lng} onChange={(e) => setLng(e.target.value)} /></Field>
        </div>
        <Field label="Place name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Mahaveer Papers, Bengaluru" /></Field>
        <Field label="Address"><input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
