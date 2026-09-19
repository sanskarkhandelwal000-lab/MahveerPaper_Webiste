"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Search, MessageCircle, Pencil, Trash2, Users, ListPlus, X } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { api, useApi } from "@/lib/inbox/client";
import { displayName, type ContactItem } from "@/lib/inbox/types";
import { Avatar, Badge, Button, Empty, Field, Modal, PageHeader, Spinner, inputCls } from "../ui";

interface ListItem { id: string; name: string; members: number }

export function ContactsPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [list, setList] = useState("");
  const [optedIn, setOptedIn] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [edit, setEdit] = useState<Partial<ContactItem> | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [listModal, setListModal] = useState(false);

  const qs = new URLSearchParams();
  if (q.trim()) qs.set("q", q.trim());
  if (tag) qs.set("tag", tag);
  if (list) qs.set("list", list);
  if (optedIn) qs.set("optedIn", "1");
  const { data, mutate, isLoading } = useApi<{ contacts: ContactItem[]; tags: string[] }>(`/contacts?${qs}`);
  const { data: lists, mutate: mutateLists } = useApi<{ lists: ListItem[] }>("/lists");
  const { data: me } = useApi<{ user: { role: string } }>("/auth/me");
  const contacts = data?.contacts ?? [];

  const allSelected = contacts.length > 0 && contacts.every((c) => selected.has(c.id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(contacts.map((c) => c.id)));
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  async function openChat(c: ContactItem) {
    try { const r = await api<{ id: string }>("/conversations", { body: { phone: c.wa_id } }); router.push(`/inbox/c/${r.id}`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not open chat"); }
  }
  async function remove(c: ContactItem) {
    if (!confirm(`Delete ${displayName(c)} and their chat history? This can't be undone.`)) return;
    try { await api(`/contacts/${c.id}`, { method: "DELETE" }); toast.success("Contact deleted"); await mutate(); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete"); }
  }
  async function addToList(listId: string) {
    try { await api(`/lists/${listId}`, { method: "PATCH", body: { add: [...selected] } }); toast.success(`Added ${selected.size} contact${selected.size === 1 ? "" : "s"} to the list`); setSelected(new Set()); await mutateLists(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function removeFromList() {
    if (!list) return;
    try { await api(`/lists/${list}`, { method: "PATCH", body: { remove: [...selected] } }); setSelected(new Set()); await Promise.all([mutate(), mutateLists()]); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Contacts" sub={`${contacts.length} contact${contacts.length === 1 ? "" : "s"}`}
        actions={<><Button variant="outline" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4" />Import</Button><Button onClick={() => setEdit({ tags: [], opted_in: false })}><Plus className="h-4 w-4" />Add contact</Button></>} />
      <div className="flex flex-wrap items-center gap-2 border-b border-wa-line bg-white px-4 py-3 sm:px-6">
        <div className="flex min-w-48 flex-1 items-center gap-2 rounded-lg bg-wa-panel px-3 py-2"><Search className="h-4 w-4 text-wa-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, number, email" aria-label="Search contacts" className="w-full bg-transparent text-base outline-none sm:text-sm" /></div>
        <select aria-label="Filter by tag" className={clsx(inputCls, "!w-auto")} value={tag} onChange={(e) => setTag(e.target.value)}><option value="">All tags</option>{data?.tags.map((t) => <option key={t}>{t}</option>)}</select>
        <select aria-label="Filter by list" className={clsx(inputCls, "!w-auto")} value={list} onChange={(e) => setList(e.target.value)}><option value="">All lists</option>{lists?.lists.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.members})</option>)}</select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={optedIn} onChange={(e) => setOptedIn(e.target.checked)} className="h-4 w-4 accent-wa-green" />Opted in only</label>
        <Button variant="ghost" onClick={() => setListModal(true)}><ListPlus className="h-4 w-4" />Lists</Button>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-wa-out px-4 py-2 text-sm sm:px-6">
          <strong>{selected.size} selected</strong>
          <select aria-label="Add to list" className={clsx(inputCls, "!w-auto !py-1.5")} value="" onChange={(e) => e.target.value && addToList(e.target.value)}><option value="">Add to list…</option>{lists?.lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
          {list && <button onClick={removeFromList} className="font-medium text-red-600 hover:underline">Remove from this list</button>}
          <button onClick={() => setSelected(new Set())} className="ml-auto flex items-center gap-1 text-wa-muted hover:underline"><X className="h-4 w-4" />Clear</button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto bg-white">
        {isLoading && !data && <div className="flex justify-center py-12"><Spinner /></div>}
        {data && contacts.length === 0 && <Empty icon={<Users className="h-12 w-12" />} title="No contacts found">Add a contact, import a CSV, or wait for customers to message you.</Empty>}
        {contacts.length > 0 && (
          <ul className="divide-y divide-wa-line md:hidden">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-start gap-3 px-4 py-3">
                <input type="checkbox" aria-label={`Select ${displayName(c)}`} checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="mt-3 h-4 w-4 accent-wa-green" />
                <Avatar name={displayName(c)} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{displayName(c)}{c.blocked && <span className="ml-2"><Badge tone="red">Blocked</Badge></span>}</p>
                  <p className="truncate text-xs text-wa-muted">+{c.wa_id}{c.location ? ` · ${c.location}` : ""}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {c.opted_in ? <Badge tone="green">Opted in</Badge> : <Badge>Not opted in</Badge>}
                    {c.tags.map((t) => <span key={t} className="rounded-full bg-wa-panel px-2 py-0.5 text-xs">{t}</span>)}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col">
                  <button onClick={() => openChat(c)} aria-label={`Chat with ${displayName(c)}`} className="rounded-full p-2 text-wa-dark hover:bg-wa-out"><MessageCircle className="h-5 w-5" /></button>
                  <button onClick={() => setEdit(c)} aria-label={`Edit ${displayName(c)}`} className="rounded-full p-2 text-wa-muted hover:bg-wa-line"><Pencil className="h-5 w-5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {contacts.length > 0 && (
          <table className="hidden w-full min-w-[720px] text-left text-sm md:table">
            <thead className="sticky top-0 z-10 bg-wa-panel text-xs uppercase tracking-wide text-wa-muted">
              <tr><th className="w-12 px-4 py-2.5"><input type="checkbox" aria-label="Select all" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-wa-green" /></th><th className="px-2 py-2.5">Contact</th><th className="px-2 py-2.5">Location</th><th className="px-2 py-2.5">Tags</th><th className="px-2 py-2.5">Promotions</th><th className="px-4 py-2.5 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-wa-line hover:bg-wa-hover">
                  <td className="px-4 py-2.5"><input type="checkbox" aria-label={`Select ${displayName(c)}`} checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 accent-wa-green" /></td>
                  <td className="px-2 py-2.5"><div className="flex items-center gap-3"><Avatar name={displayName(c)} size={38} /><div className="min-w-0"><p className="truncate font-medium">{displayName(c)}{c.blocked && <span className="ml-2"><Badge tone="red">Blocked</Badge></span>}</p><p className="truncate text-xs text-wa-muted">+{c.wa_id}{c.email ? ` · ${c.email}` : ""}</p></div></div></td>
                  <td className="px-2 py-2.5 text-wa-muted">{c.location ?? "—"}</td>
                  <td className="px-2 py-2.5"><div className="flex max-w-56 flex-wrap gap-1">{c.tags.map((t) => <span key={t} className="rounded-full bg-wa-panel px-2 py-0.5 text-xs">{t}</span>)}</div></td>
                  <td className="px-2 py-2.5">{c.opted_in ? <Badge tone="green">Opted in</Badge> : <Badge>No</Badge>}</td>
                  <td className="px-4 py-2.5"><div className="flex justify-end gap-1">
                    <button onClick={() => openChat(c)} title="Open chat" aria-label={`Chat with ${displayName(c)}`} className="rounded-full p-2 text-wa-dark hover:bg-wa-out"><MessageCircle className="h-4 w-4" /></button>
                    <button onClick={() => setEdit(c)} title="Edit" aria-label={`Edit ${displayName(c)}`} className="rounded-full p-2 text-wa-muted hover:bg-wa-line"><Pencil className="h-4 w-4" /></button>
                    {me?.user.role === "admin" && <button onClick={() => remove(c)} title="Delete" aria-label={`Delete ${displayName(c)}`} className="rounded-full p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {edit && <ContactModal initial={edit} onClose={() => setEdit(null)} onSaved={async () => { setEdit(null); await mutate(); }} />}
      {importOpen && <ImportModal lists={lists?.lists ?? []} onClose={() => setImportOpen(false)} onDone={async () => { setImportOpen(false); await Promise.all([mutate(), mutateLists()]); }} />}
      {listModal && <ListsModal lists={lists?.lists ?? []} isAdmin={me?.user.role === "admin"} onClose={() => setListModal(false)} onChange={mutateLists} />}
    </div>
  );
}

function ContactModal({ initial, onClose, onSaved }: { initial: Partial<ContactItem>; onClose: () => void; onSaved: () => Promise<void> }) {
  const isNew = !initial.id;
  const [f, setF] = useState({ phone: initial.wa_id ? `+${initial.wa_id}` : "", name: initial.name ?? "", email: initial.email ?? "", location: initial.location ?? "", company: initial.company ?? "", tags: (initial.tags ?? []).join(", "), opted_in: initial.opted_in ?? false });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string | boolean) => setF((x) => ({ ...x, [k]: v }));
  async function save() {
    setBusy(true);
    const tags = f.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    try {
      if (isNew) await api("/contacts", { body: { phone: f.phone, name: f.name || null, email: f.email, location: f.location || null, company: f.company || null, tags, opted_in: f.opted_in } });
      else await api(`/contacts/${initial.id}`, { method: "PATCH", body: { name: f.name || null, email: f.email, location: f.location || null, company: f.company || null, tags, opted_in: f.opted_in } });
      toast.success(isNew ? "Contact added" : "Contact updated");
      await onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save"); setBusy(false); }
  }
  return (
    <Modal title={isNew ? "Add contact" : "Edit contact"} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save} busy={busy} disabled={isNew && f.phone.replace(/\D/g, "").length < 10}>Save</Button></>}>
      <div className="space-y-4">
        <Field label="WhatsApp number"><input className={inputCls} type="tel" inputMode="tel" disabled={!isNew} placeholder="+91 98765 43210" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Name"><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><input className={inputCls} type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Company"><input className={inputCls} value={f.company} onChange={(e) => set("company", e.target.value)} /></Field>
        </div>
        <Field label="Location"><input className={inputCls} value={f.location} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="Tags" hint="Separate with commas — e.g. printer, bengaluru"><input className={inputCls} value={f.tags} onChange={(e) => set("tags", e.target.value)} /></Field>
        <label className="flex items-start gap-3 rounded-lg bg-wa-panel p-3 text-sm"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-wa-green" checked={f.opted_in} onChange={(e) => set("opted_in", e.target.checked)} /><span><strong>Agreed to receive WhatsApp promotions.</strong><br /><span className="text-wa-muted">Only tick this if they&apos;ve clearly said yes. Bulk campaigns are only sent to opted-in contacts.</span></span></label>
      </div>
    </Modal>
  );
}

/** Minimal CSV parser (quotes, commas, newlines). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((c) => c.trim())) rows.push(row); row = []; }
    else cur += ch;
  }
  row.push(cur); if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

function ImportModal({ lists, onClose, onDone }: { lists: ListItem[]; onClose: () => void; onDone: () => Promise<void> }) {
  const [rows, setRows] = useState<Array<Record<string, string>>>([]);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState("");
  const [listId, setListId] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(f: File) {
    const parsed = parseCsv(await f.text());
    if (parsed.length < 2) { toast.error("The file needs a header row and at least one contact."); return; }
    const head = parsed[0].map((h) => h.trim().toLowerCase());
    const idx = (...names: string[]) => head.findIndex((h) => names.includes(h));
    const pi = idx("phone", "mobile", "number", "whatsapp", "phone number", "mobile number");
    if (pi < 0) { toast.error('Couldn\'t find a phone column. Name the column "phone".'); return; }
    const ni = idx("name", "full name"), ei = idx("email"), li = idx("location", "city"), ci = idx("company"), ti = idx("tags", "tag");
    setRows(parsed.slice(1).map((r) => ({ phone: r[pi] ?? "", name: ni >= 0 ? r[ni] ?? "" : "", email: ei >= 0 ? r[ei] ?? "" : "", location: li >= 0 ? r[li] ?? "" : "", company: ci >= 0 ? r[ci] ?? "" : "", tags: ti >= 0 ? r[ti] ?? "" : "" })));
    setFileName(f.name);
  }
  async function run() {
    setBusy(true);
    try {
      const r = await api<{ created: number; updated: number; invalid: string[] }>("/contacts/import", { body: {
        rows: rows.map((r) => ({ phone: r.phone, name: r.name, email: r.email, location: r.location, company: r.company, tags: r.tags.split(/[;|]/).map((t) => t.trim().toLowerCase()).filter(Boolean) })),
        tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean), listId: listId || null, optedIn: consent,
      } });
      toast.success(`${r.created} added, ${r.updated} updated${r.invalid.length ? `, ${r.invalid.length} skipped (bad number)` : ""}`);
      await onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Import failed"); setBusy(false); }
  }
  return (
    <Modal title="Import contacts" onClose={onClose} wide footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={run} busy={busy} disabled={rows.length === 0}>Import {rows.length || ""}</Button></>}>
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-dashed border-wa-line p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-wa-muted" />
          <p className="mt-2 text-sm">{fileName ? <><strong>{fileName}</strong> — {rows.length} contacts found</> : "Choose a CSV file"}</p>
          <p className="mt-1 text-xs text-wa-muted">Columns: <code>phone</code> (required), name, email, location, company, tags. Numbers without a country code are treated as India (+91).</p>
          <Button variant="outline" className="mt-3" onClick={() => ref.current?.click()}>Choose file</Button>
          <input ref={ref} type="file" accept=".csv,text/csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); }} />
        </div>
        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-wa-line"><table className="w-full text-left text-xs"><thead className="bg-wa-panel text-wa-muted"><tr><th className="px-3 py-2">Phone</th><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th></tr></thead><tbody>{rows.slice(0, 5).map((r, i) => <tr key={i} className="border-t border-wa-line"><td className="px-3 py-1.5">{r.phone}</td><td className="px-3 py-1.5">{r.name}</td><td className="px-3 py-1.5">{r.email}</td></tr>)}</tbody></table>{rows.length > 5 && <p className="border-t border-wa-line px-3 py-1.5 text-xs text-wa-muted">…and {rows.length - 5} more</p>}</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Add tags to all (optional)"><input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="printers, diwali-2026" /></Field>
          <Field label="Add to list (optional)"><select className={inputCls} value={listId} onChange={(e) => setListId(e.target.value)}><option value="">No list</option>{lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></Field>
        </div>
        <label className="flex items-start gap-3 rounded-lg bg-wa-warn p-3 text-sm"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-wa-green" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span><strong>These people agreed to receive WhatsApp messages from us.</strong><br /><span className="text-amber-900/80">WhatsApp requires opt-in for promotional messages. Unticked contacts are imported but excluded from bulk campaigns.</span></span></label>
      </div>
    </Modal>
  );
}

function ListsModal({ lists, isAdmin, onClose, onChange }: { lists: ListItem[]; isAdmin: boolean; onClose: () => void; onChange: () => Promise<unknown> }) {
  const [name, setName] = useState("");
  async function create() { try { await api("/lists", { body: { name } }); setName(""); await onChange(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }
  async function del(l: ListItem) { if (!confirm(`Delete the list "${l.name}"? Contacts are kept.`)) return; try { await api(`/lists/${l.id}`, { method: "DELETE" }); await onChange(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }
  const sorted = useMemo(() => lists, [lists]);
  return (
    <Modal title="Contact lists" onClose={onClose}>
      <p className="mb-3 text-sm text-wa-muted">Lists group contacts for campaigns. Select contacts in the table, then choose &ldquo;Add to list&rdquo;.</p>
      <ul className="mb-4 divide-y divide-wa-line rounded-lg border border-wa-line">
        {sorted.length === 0 && <li className="px-4 py-3 text-sm text-wa-muted">No lists yet.</li>}
        {sorted.map((l) => <li key={l.id} className="flex items-center justify-between px-4 py-2.5 text-sm"><span>{l.name} <span className="text-wa-muted">· {l.members}</span></span>{isAdmin && <button onClick={() => del(l)} aria-label={`Delete ${l.name}`} className="text-red-500"><Trash2 className="h-4 w-4" /></button>}</li>)}
      </ul>
      <div className="flex gap-2"><input className={inputCls} placeholder="New list name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && create()} /><Button onClick={create} disabled={!name.trim()}>Create</Button></div>
    </Modal>
  );
}
