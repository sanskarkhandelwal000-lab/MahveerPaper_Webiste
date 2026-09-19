"use client";
import { useState } from "react";
import { Plus, RefreshCw, FileText, Trash2, Phone, Link as LinkIcon, Reply, Info } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { api, useApi } from "@/lib/inbox/client";
import type { TemplateItem } from "@/lib/inbox/types";
import { Badge, Button, Empty, Field, Modal, PageHeader, Spinner, inputCls } from "../ui";

const STATUS_TONE: Record<string, "green" | "amber" | "red" | "gray"> = { APPROVED: "green", PENDING: "amber", REJECTED: "red", PAUSED: "gray", DISABLED: "gray" };
const LANGS = [["en", "English"], ["en_US", "English (US)"], ["hi", "Hindi"], ["gu", "Gujarati"], ["kn", "Kannada"], ["mr", "Marathi"], ["ta", "Tamil"], ["te", "Telugu"]];

export function TemplatesPage() {
  const { data, mutate, isLoading } = useApi<{ templates: TemplateItem[]; waMode: string }>("/templates", { poll: 20000 });
  const { data: me } = useApi<{ user: { role: string } }>("/auth/me");
  const [create, setCreate] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const list = data?.templates ?? [];

  async function sync() {
    setSyncing(true);
    try { const r = await api<{ synced: number }>("/templates/sync", { method: "POST", body: {} }); toast.success(data?.waMode === "mock" ? "Test mode — nothing to sync" : `Synced ${r.synced} templates from Meta`); await mutate(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Sync failed"); } finally { setSyncing(false); }
  }
  async function del(t: TemplateItem) {
    if (!confirm(`Delete template "${t.name}"? It will also be removed from Meta.`)) return;
    try { await api(`/templates/${t.id}`, { method: "DELETE" }); await mutate(); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete"); }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Message templates" sub="Pre-approved messages you can send outside the 24-hour window and in bulk campaigns"
        actions={<><Button variant="outline" onClick={sync} busy={syncing}><RefreshCw className="h-4 w-4" />Refresh status</Button><Button onClick={() => setCreate(true)}><Plus className="h-4 w-4" />New template</Button></>} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        <div className="mb-4 flex gap-3 rounded-xl bg-white p-4 text-sm text-wa-muted shadow-sm"><Info className="mt-0.5 h-5 w-5 shrink-0 text-wa-green" /><p>Meta reviews every template — usually within minutes, sometimes a day. <strong>Marketing</strong> templates are for promotions and cost more per message; <strong>Utility</strong> templates are for order/account updates. Only <strong>approved</strong> templates can be sent.</p></div>
        {isLoading && !data && <div className="flex justify-center py-12"><Spinner /></div>}
        {data && list.length === 0 && <Empty icon={<FileText className="h-12 w-12" />} title="No templates yet">Create your first template — or press “Refresh status” to pull the ones already in your Meta account.</Empty>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => {
            const body = t.components.find((c) => c.type === "BODY")?.text ?? "";
            const header = t.components.find((c) => c.type === "HEADER")?.text;
            const footer = t.components.find((c) => c.type === "FOOTER")?.text;
            const buttons = t.components.find((c) => c.type === "BUTTONS")?.buttons ?? [];
            return (
              <article key={t.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="flex items-start justify-between gap-2 border-b border-wa-line px-4 py-3">
                  <div className="min-w-0"><h3 className="truncate font-medium">{t.name}</h3><p className="text-xs text-wa-muted">{t.category.toLowerCase()} · {t.language}</p></div>
                  <Badge tone={STATUS_TONE[t.status] ?? "gray"}>{t.status.toLowerCase()}</Badge>
                </div>
                <div className="wa-wall flex-1 p-4"><div className="max-w-full rounded-lg rounded-tl-none bg-white p-3 text-[13.5px] shadow-sm">
                  {header && <p className="mb-1 font-semibold">{header}</p>}<p className="whitespace-pre-wrap">{body}</p>{footer && <p className="mt-1.5 text-xs text-wa-muted">{footer}</p>}
                  {buttons.length > 0 && <div className="mt-2 space-y-1 border-t border-wa-line pt-2">{buttons.map((b, i) => <div key={i} className="text-center text-[13px] font-medium text-[#027eb5]">{b.text}</div>)}</div>}
                </div></div>
                {t.rejected_reason && t.status === "REJECTED" && <p className="border-t border-wa-line bg-red-50 px-4 py-2 text-xs text-red-700">Rejected: {t.rejected_reason.replace(/_/g, " ").toLowerCase()}</p>}
                {me?.user.role === "admin" && <div className="flex justify-end border-t border-wa-line px-3 py-2"><button onClick={() => del(t)} aria-label={`Delete ${t.name}`} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete</button></div>}
              </article>
            );
          })}
        </div>
      </div>
      {create && <CreateTemplate onClose={() => setCreate(false)} onDone={async () => { setCreate(false); await mutate(); }} />}
    </div>
  );
}

type Btn = { type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER"; text: string; url?: string; phone_number?: string };

function CreateTemplate({ onClose, onDone }: { onClose: () => void; onDone: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"MARKETING" | "UTILITY">("MARKETING");
  const [language, setLanguage] = useState("en");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [examples, setExamples] = useState<string[]>([]);
  const [buttons, setButtons] = useState<Btn[]>([]);
  const [busy, setBusy] = useState(false);

  const nVars = Math.max(0, ...[...body.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1])));
  const preview = body.replace(/\{\{(\d+)\}\}/g, (_, n) => examples[Number(n) - 1] || `{{${n}}}`);
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  async function save() {
    setBusy(true);
    try {
      await api("/templates", { body: {
        name: cleanName, language, category, header: header || undefined, body, footer: footer || undefined,
        examples: examples.slice(0, nVars), buttons: buttons.filter((b) => b.text.trim()).map((b) => b.type === "URL" ? { type: "URL", text: b.text, url: b.url } : b.type === "PHONE_NUMBER" ? { type: "PHONE_NUMBER", text: b.text, phone_number: b.phone_number } : { type: "QUICK_REPLY", text: b.text }),
      } });
      toast.success("Submitted to Meta for review");
      await onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not create template"); setBusy(false); }
  }
  const setBtn = (i: number, patch: Partial<Btn>) => setButtons((b) => b.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <Modal title="New template" onClose={onClose} wide footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save} busy={busy} disabled={!cleanName || !body.trim() || (nVars > 0 && examples.filter((e) => e?.trim()).length < nVars)}>Submit for review</Button></>}>
      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <Field label="Template name" hint={cleanName ? `Saved as: ${cleanName}` : "Lowercase letters, numbers and underscores, e.g. festive_offer"}><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Festive offer" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value as "MARKETING" | "UTILITY")}><option value="MARKETING">Marketing</option><option value="UTILITY">Utility</option></select></Field>
            <Field label="Language"><select className={inputCls} value={language} onChange={(e) => setLanguage(e.target.value)}>{LANGS.map(([c, l]) => <option key={c} value={c}>{l}</option>)}</select></Field>
          </div>
          <Field label="Header (optional)"><input className={inputCls} maxLength={60} value={header} onChange={(e) => setHeader(e.target.value)} /></Field>
          <Field label="Message" hint="Use {{1}}, {{2}}… for personalised values, e.g. “Hi {{1}}, …”. Can't start or end with a variable.">
            <textarea className={clsx(inputCls, "min-h-28")} maxLength={1024} value={body} onChange={(e) => setBody(e.target.value)} />
            <button type="button" onClick={() => setBody((b) => `${b}{{${nVars + 1}}}`)} className="mt-1 text-xs font-medium text-wa-dark hover:underline">+ Add variable {`{{${nVars + 1}}}`}</button>
          </Field>
          {nVars > 0 && (
            <div className="space-y-2 rounded-lg bg-wa-panel p-3">
              <p className="text-xs text-wa-muted">Meta needs an example for each variable so reviewers understand it.</p>
              {Array.from({ length: nVars }, (_, i) => <input key={i} className={inputCls} placeholder={`Example for {{${i + 1}}}`} value={examples[i] ?? ""} onChange={(e) => setExamples((x) => { const n = [...x]; n[i] = e.target.value; return n; })} />)}
            </div>
          )}
          <Field label="Footer (optional)"><input className={inputCls} maxLength={60} value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Reply STOP to opt out" /></Field>
          <div>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-wa-muted">Buttons (optional)</span>
            <div className="space-y-2">
              {buttons.map((b, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-wa-line p-2">
                  <span className="text-wa-muted">{b.type === "URL" ? <LinkIcon className="h-4 w-4" /> : b.type === "PHONE_NUMBER" ? <Phone className="h-4 w-4" /> : <Reply className="h-4 w-4" />}</span>
                  <input className={clsx(inputCls, "!w-36")} placeholder="Button text" maxLength={25} value={b.text} onChange={(e) => setBtn(i, { text: e.target.value })} />
                  {b.type === "URL" && <input className={clsx(inputCls, "min-w-40 flex-1")} placeholder="https://…" value={b.url ?? ""} onChange={(e) => setBtn(i, { url: e.target.value })} />}
                  {b.type === "PHONE_NUMBER" && <input className={clsx(inputCls, "min-w-40 flex-1")} placeholder="+91…" value={b.phone_number ?? ""} onChange={(e) => setBtn(i, { phone_number: e.target.value })} />}
                  <button onClick={() => setButtons((x) => x.filter((_, j) => j !== i))} aria-label="Remove button" className="ml-auto text-wa-muted"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            {buttons.length < 3 && <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-wa-dark">
              <button onClick={() => setButtons((b) => [...b, { type: "QUICK_REPLY", text: "" }])} className="hover:underline">+ Quick reply</button>
              <button onClick={() => setButtons((b) => [...b, { type: "URL", text: "", url: "" }])} className="hover:underline">+ Website link</button>
              <button onClick={() => setButtons((b) => [...b, { type: "PHONE_NUMBER", text: "", phone_number: "" }])} className="hover:underline">+ Call button</button>
            </div>}
          </div>
        </div>
        <div className="md:sticky md:top-0 md:self-start">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-wa-muted">Preview</p>
          <div className="wa-wall rounded-xl p-4"><div className="rounded-lg rounded-tl-none bg-white p-3 text-[13.5px] shadow-sm">
            {header && <p className="mb-1 font-semibold">{header}</p>}
            <p className="whitespace-pre-wrap">{preview || <span className="text-wa-muted">Your message…</span>}</p>
            {footer && <p className="mt-1.5 text-xs text-wa-muted">{footer}</p>}
            {buttons.filter((b) => b.text).length > 0 && <div className="mt-2 space-y-1 border-t border-wa-line pt-2">{buttons.filter((b) => b.text).map((b, i) => <div key={i} className="text-center text-[13px] font-medium text-[#027eb5]">{b.text}</div>)}</div>}
          </div></div>
        </div>
      </div>
    </Modal>
  );
}
