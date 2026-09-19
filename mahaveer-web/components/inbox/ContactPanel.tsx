"use client";
import { useState } from "react";
import { X, Plus, Trash2, Package, Ban, Mail, MapPin, Building2, StickyNote, Tag as TagIcon, Bot, UserRound, Check } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { api, useApi, dateTime } from "@/lib/inbox/client";
import { displayName, type ContactItem, type ConversationItem, type Label, type NoteItem, type UserItem } from "@/lib/inbox/types";
import { Avatar, Badge, Button, inputCls } from "./ui";

interface Detail {
  conversation: ConversationItem;
  contact: ContactItem;
  notes: NoteItem[];
  samples: Array<{ id: string; product_name: string; status: string; created_at: string }>;
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="border-t-8 border-wa-panel px-5 py-4"><h3 className="mb-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-wide text-wa-muted">{icon}{title}</h3>{children}</section>
  );
}

export function ContactPanel({ detail, onClose, onChange }: { detail: Detail; onClose: () => void; onChange: () => Promise<void> }) {
  const { conversation: conv, contact, notes, samples } = detail;
  const { data: labelData, mutate: mutateLabels } = useApi<{ labels: Label[] }>("/labels");
  const { data: teamData } = useApi<{ users: UserItem[] }>("/team");
  const { data: me } = useApi<{ user: { role: string } }>("/auth/me");
  const [note, setNote] = useState("");
  const [tag, setTag] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [form, setForm] = useState({ name: contact.name ?? "", email: contact.email ?? "", location: contact.location ?? "", company: contact.company ?? "" });

  const err = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong");
  const patchContact = async (body: Record<string, unknown>) => { try { await api(`/contacts/${contact.id}`, { method: "PATCH", body }); await onChange(); } catch (e) { err(e); } };
  const patchConv = async (body: Record<string, unknown>) => { try { await api(`/conversations/${conv.id}`, { method: "PATCH", body }); await onChange(); } catch (e) { err(e); } };
  const saveField = (k: keyof typeof form) => { if ((form[k] || null) !== ((contact[k] as string | null) || null)) void patchContact({ [k]: form[k] || null }); };

  async function setLabels(ids: string[]) {
    try { await api(`/conversations/${conv.id}/labels`, { method: "PUT", body: { labelIds: ids } }); await onChange(); } catch (e) { err(e); }
  }
  const labelIds = conv.labels.map((l) => l.id);
  const toggleLabel = (id: string) => setLabels(labelIds.includes(id) ? labelIds.filter((x) => x !== id) : [...labelIds, id]);

  async function addNote() {
    if (!note.trim()) return;
    try { await api(`/conversations/${conv.id}/notes`, { body: { text: note.trim() } }); setNote(""); await onChange(); } catch (e) { err(e); }
  }
  async function delNote(id: string) { try { await api(`/conversations/${conv.id}/notes?noteId=${id}`, { method: "DELETE" }); await onChange(); } catch (e) { err(e); } }
  async function addTag() {
    const t = tag.trim().toLowerCase();
    if (!t || contact.tags.includes(t)) { setTag(""); return; }
    setTag("");
    await patchContact({ tags: [...contact.tags, t] });
  }
  async function createLabel() {
    if (!newLabel.trim()) return;
    const colors = ["#2563eb", "#ea580c", "#16a34a", "#9333ea", "#db2777", "#0891b2", "#ca8a04"];
    try { await api("/labels", { body: { name: newLabel.trim(), color: colors[(labelData?.labels.length ?? 0) % colors.length] } }); setNewLabel(""); await mutateLabels(); } catch (e) { err(e); }
  }

  const name = displayName(conv);

  return (
    <aside className="fixed inset-0 z-40 flex flex-col bg-white md:static md:z-auto md:w-[340px] md:shrink-0 md:border-l md:border-wa-line xl:w-[360px]" aria-label="Contact info">
      <header className="flex shrink-0 items-center gap-4 bg-wa-panel px-4 py-3">
        <button onClick={onClose} aria-label="Close contact info" className="flex h-9 w-9 items-center justify-center rounded-full text-wa-muted hover:bg-wa-line"><X className="h-5 w-5" /></button>
        <h2 className="text-base font-medium">Contact info</h2>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col items-center gap-2 px-5 py-6">
          <Avatar name={name} size={96} />
          <p className="text-xl">{name}</p>
          <p className="text-sm text-wa-muted">+{contact.wa_id}</p>
          <div className="mt-1 flex flex-wrap justify-center gap-1.5">
            {conv.status === "resolved" ? <Badge tone="green">Resolved</Badge> : <Badge tone="blue">Open</Badge>}
            {contact.opted_in ? <Badge tone="green">Opted in</Badge> : <Badge>Not opted in</Badge>}
            {contact.blocked && <Badge tone="red">Blocked</Badge>}
          </div>
        </div>

        <Section title="Details">
          <div className="space-y-2.5">
            {([["name", "Name", <UserRound key="n" className="h-4 w-4" />], ["email", "Email", <Mail key="e" className="h-4 w-4" />], ["location", "Location", <MapPin key="l" className="h-4 w-4" />], ["company", "Company", <Building2 key="c" className="h-4 w-4" />]] as const).map(([k, label, icon]) => (
              <label key={k} className="flex items-center gap-3">
                <span className="w-5 text-wa-muted">{icon}</span>
                <input aria-label={label} placeholder={label} className={clsx(inputCls, "!border-transparent !px-2 !py-2 hover:!border-wa-line")} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} onBlur={() => saveField(k)} onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
              </label>
            ))}
          </div>
        </Section>

        <Section title="Bot & assignment" icon={<Bot className="h-4 w-4" />}>
          <div className="space-y-3">
            <Toggle label="Bot replies to this chat" on={!conv.bot_paused && !conv.needs_human} onChange={(v) => patchConv({ bot_paused: !v })} />
            <Toggle label="Needs a human" on={conv.needs_human} onChange={(v) => patchConv({ needs_human: v, ...(v ? { bot_paused: true } : {}) })} />
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm text-wa-muted"><UserRound className="h-4 w-4" />Assigned to</span>
              <select className={inputCls} value={conv.assigned_to ?? ""} onChange={(e) => patchConv({ assigned_to: e.target.value || null })}>
                <option value="">Unassigned</option>
                {(teamData?.users ?? []).filter((u) => u.active).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </label>
          </div>
        </Section>

        <Section title="Labels" icon={<TagIcon className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-2">
            {(labelData?.labels ?? []).map((l) => {
              const on = labelIds.includes(l.id);
              return <button key={l.id} onClick={() => toggleLabel(l.id)} aria-pressed={on} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition" style={{ borderColor: l.color, background: on ? l.color : "#fff", color: on ? "#fff" : l.color }}>{on && <Check className="h-3.5 w-3.5" />}{l.name}</button>;
            })}
          </div>
          {me?.user.role === "admin" && (
            <div className="mt-3 flex gap-2"><input className={inputCls} placeholder="New label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createLabel()} /><Button variant="outline" onClick={createLabel} disabled={!newLabel.trim()} aria-label="Add label"><Plus className="h-4 w-4" /></Button></div>
          )}
        </Section>

        <Section title="Contact tags">
          <div className="flex flex-wrap gap-1.5">
            {contact.tags.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-wa-panel px-2.5 py-1 text-sm">{t}<button aria-label={`Remove tag ${t}`} onClick={() => patchContact({ tags: contact.tags.filter((x) => x !== t) })}><X className="h-3.5 w-3.5 text-wa-muted" /></button></span>)}
            {contact.tags.length === 0 && <p className="text-sm text-wa-muted">No tags yet. Tags let you target campaigns.</p>}
          </div>
          <div className="mt-3 flex gap-2"><input className={inputCls} placeholder="Add tag" value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} /><Button variant="outline" onClick={addTag} disabled={!tag.trim()} aria-label="Add tag"><Plus className="h-4 w-4" /></Button></div>
        </Section>

        {samples.length > 0 && (
          <Section title="Sample requests" icon={<Package className="h-4 w-4" />}>
            <ul className="space-y-2">{samples.map((s) => <li key={s.id} className="flex items-center justify-between rounded-lg bg-wa-panel px-3 py-2 text-sm"><span>{s.product_name}</span><span className="flex items-center gap-2 text-xs text-wa-muted">{dateTime(s.created_at)}<Badge tone={s.status === "shipped" ? "green" : s.status === "awaiting" ? "amber" : "blue"}>{s.status}</Badge></span></li>)}</ul>
          </Section>
        )}

        <Section title="Internal notes" icon={<StickyNote className="h-4 w-4" />}>
          <p className="mb-2 text-xs text-wa-muted">Only your team can see these — customers never do.</p>
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="group rounded-lg bg-amber-50 px-3 py-2 text-sm">
                <p className="whitespace-pre-wrap">{n.body}</p>
                <p className="mt-1 flex items-center justify-between text-[11px] text-wa-muted">{n.user_name ?? "Team"} · {dateTime(n.created_at)}<button onClick={() => delNote(n.id)} aria-label="Delete note" className="opacity-0 group-hover:opacity-100 focus:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button></p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2"><textarea rows={2} className={clsx(inputCls, "resize-none")} placeholder="Add a note" value={note} onChange={(e) => setNote(e.target.value)} /><Button variant="outline" onClick={addNote} disabled={!note.trim()} className="self-end">Add</Button></div>
        </Section>

        <Section title="Marketing & privacy">
          <div className="space-y-3">
            <Toggle label="Agreed to receive WhatsApp promotions" on={contact.opted_in} onChange={(v) => patchContact({ opted_in: v })} />
            <button onClick={() => { if (confirm(contact.blocked ? "Unblock this contact?" : "Block this contact? You won't be able to message them from the inbox.")) void patchContact({ blocked: !contact.blocked }); }} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline"><Ban className="h-4 w-4" />{contact.blocked ? "Unblock contact" : "Block contact"}</button>
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-3 text-left">
      <span className="text-sm">{label}</span>
      <span className={clsx("relative h-6 w-11 shrink-0 rounded-full transition", on ? "bg-wa-green" : "bg-gray-300")}><span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} /></span>
    </button>
  );
}
