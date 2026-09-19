"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Users, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { api, useApi } from "@/lib/inbox/client";
import type { TemplateItem } from "@/lib/inbox/types";
import { Button, Field, PageHeader, inputCls } from "../ui";

type VarSpec = { source: "text"; value: string } | { source: "contact"; field: "name" | "first_name" | "company" | "location"; fallback?: string };
const FIELDS: Array<[string, string]> = [["first_name", "Customer's first name"], ["name", "Customer's full name"], ["company", "Company"], ["location", "Location"]];

function Step({ n, title, done, children }: { n: number; title: string; done?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 flex items-center gap-3 text-base font-medium"><span className={clsx("flex h-7 w-7 items-center justify-center rounded-full text-sm text-white", done ? "bg-wa-green" : "bg-gray-300")}>{done ? <Check className="h-4 w-4" /> : n}</span>{title}</h2>
      {children}
    </section>
  );
}

export function NewCampaign() {
  const router = useRouter();
  const { data: tpl } = useApi<{ templates: TemplateItem[] }>("/templates");
  const { data: lists } = useApi<{ lists: Array<{ id: string; name: string; members: number }> }>("/lists");
  const { data: contacts } = useApi<{ tags: string[] }>("/contacts?limit=1");
  const approved = (tpl?.templates ?? []).filter((t) => t.status === "APPROVED");

  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [all, setAll] = useState(true);
  const [listIds, setListIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [vars, setVars] = useState<Record<string, VarSpec>>({});
  const [when, setWhen] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [fetched, setFetched] = useState<{ count: number; sample: string[]; excludedNotOptedIn: number } | null>(null);
  const [minLocal] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const [busy, setBusy] = useState(false);

  const t = approved.find((x) => x.id === templateId);
  const bodyText = t?.components.find((c) => c.type === "BODY")?.text ?? "";
  const nVars = Math.max(0, ...[...bodyText.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1])));

  function chooseTemplate(x: TemplateItem) {
    setTemplateId(x.id);
    const body = x.components.find((c) => c.type === "BODY")?.text ?? "";
    const n = Math.max(0, ...[...body.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1])));
    const next: Record<string, VarSpec> = {};
    for (let i = 1; i <= n; i++) next[String(i)] = i === 1 ? { source: "contact", field: "first_name", fallback: "there" } : { source: "text", value: "" };
    setVars(next);
  }

  const audience = { all, listIds: all ? [] : listIds, tags: all ? [] : tags };
  const audienceKey = JSON.stringify(audience);
  const emptyAudience = !all && !listIds.length && !tags.length;
  const count = emptyAudience ? { count: 0, sample: [] as string[], excludedNotOptedIn: 0 } : fetched;
  useEffect(() => {
    if (emptyAudience) return;
    const h = setTimeout(() => { void api<NonNullable<typeof fetched>>("/campaigns/preview", { body: JSON.parse(audienceKey) }).then(setFetched).catch(() => undefined); }, 250);
    return () => clearTimeout(h);
  }, [audienceKey, emptyAudience]);

  const preview = bodyText.replace(/\{\{(\d+)\}\}/g, (_, n) => { const v = vars[n]; return !v ? `{{${n}}}` : v.source === "text" ? v.value || `{{${n}}}` : v.field === "first_name" ? (count?.sample[0]?.split(" ")[0] ?? v.fallback ?? "there") : (count?.sample[0] ?? v.fallback ?? "there"); });
  const varsOk = Array.from({ length: nVars }, (_, i) => vars[String(i + 1)]).every((v) => v && (v.source === "contact" || v.value.trim()));
  const valid = name.trim() && t && varsOk && (count?.count ?? 0) > 0 && (when === "now" || !!scheduledAt);

  async function submit() {
    if (!valid) return;
    if (when === "later" && new Date(scheduledAt).getTime() <= Date.now()) { toast.error("Pick a schedule time in the future."); return; }
    if (when === "now" && !confirm(`Send “${t!.name}” to ${count!.count} contact${count!.count === 1 ? "" : "s"} now? This can't be undone.`)) return;
    setBusy(true);
    try {
      const r = await api<{ id: string }>("/campaigns", { body: { name, templateId, audience, variables: vars, scheduledAt: when === "later" ? new Date(scheduledAt).toISOString() : null } });
      if (when === "now") { await api(`/campaigns/${r.id}/start`, { method: "POST", body: {} }); toast.success("Campaign started"); } else toast.success("Campaign scheduled");
      router.push(`/inbox/campaigns/${r.id}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not create campaign"); setBusy(false); }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="New campaign" actions={<Link href="/inbox/campaigns" className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-wa-dark hover:bg-wa-panel"><ArrowLeft className="h-4 w-4" />Cancel</Link>} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Step n={1} title="Name & template" done={!!name.trim() && !!t}>
            <div className="space-y-4">
              <Field label="Campaign name (only you see this)"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Diwali offer — printers" /></Field>
              {approved.length === 0 ? <p className="rounded-lg bg-wa-warn p-3 text-sm text-amber-900">You need an approved template first. <Link href="/inbox/templates" className="font-medium underline">Go to Templates</Link></p> : (
                <div className="grid gap-2 sm:grid-cols-2">{approved.map((x) => (
                  <button key={x.id} onClick={() => chooseTemplate(x)} aria-pressed={templateId === x.id} className={clsx("rounded-xl border-2 p-3 text-left transition", templateId === x.id ? "border-wa-green bg-wa-out/40" : "border-wa-line hover:border-wa-green/50")}>
                    <p className="text-sm font-medium">{x.name}</p><p className="mt-1 line-clamp-3 text-sm text-wa-muted">{x.components.find((c) => c.type === "BODY")?.text}</p>
                  </button>
                ))}</div>
              )}
            </div>
          </Step>

          <Step n={2} title="Who should receive it?" done={(count?.count ?? 0) > 0}>
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-sm"><input type="radio" name="aud" checked={all} onChange={() => setAll(true)} className="accent-wa-green" />Everyone who has opted in</label>
              <label className="flex items-center gap-3 text-sm"><input type="radio" name="aud" checked={!all} onChange={() => setAll(false)} className="accent-wa-green" />Choose lists and tags</label>
              {!all && (
                <div className="space-y-3 rounded-lg bg-wa-panel p-3">
                  <div><p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-wa-muted">Lists</p><div className="flex flex-wrap gap-2">{lists?.lists.length ? lists.lists.map((l) => <Chip key={l.id} on={listIds.includes(l.id)} onClick={() => setListIds((x) => x.includes(l.id) ? x.filter((i) => i !== l.id) : [...x, l.id])}>{l.name} · {l.members}</Chip>) : <span className="text-sm text-wa-muted">No lists yet</span>}</div></div>
                  <div><p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-wa-muted">Tags</p><div className="flex flex-wrap gap-2">{contacts?.tags.length ? contacts.tags.map((g) => <Chip key={g} on={tags.includes(g)} onClick={() => setTags((x) => x.includes(g) ? x.filter((i) => i !== g) : [...x, g])}>{g}</Chip>) : <span className="text-sm text-wa-muted">No tags yet</span>}</div></div>
                </div>
              )}
              <div className="flex items-start gap-3 rounded-lg bg-wa-out/50 p-3 text-sm"><Users className="mt-0.5 h-5 w-5 shrink-0 text-wa-dark" /><div><p><strong>{count?.count ?? "…"}</strong> contact{count?.count === 1 ? "" : "s"} will receive this{count?.sample.length ? <> — e.g. {count.sample.slice(0, 3).join(", ")}</> : null}</p>{(count?.excludedNotOptedIn ?? 0) > 0 && <p className="mt-0.5 text-xs text-wa-muted">{count!.excludedNotOptedIn} contacts are left out because they haven&apos;t opted in.</p>}</div></div>
            </div>
          </Step>

          {t && (
            <Step n={3} title="Fill in the message" done={varsOk}>
              <div className="grid gap-5 md:grid-cols-[1fr_240px]">
                <div className="space-y-4">
                  {nVars === 0 && <p className="text-sm text-wa-muted">This template has no variables — nothing to fill in.</p>}
                  {Array.from({ length: nVars }, (_, i) => { const k = String(i + 1); const v = vars[k]; return (
                    <div key={k} className="rounded-lg border border-wa-line p-3">
                      <p className="mb-2 text-sm font-medium">{`{{${k}}}`} will be…</p>
                      <select className={inputCls} value={v?.source === "contact" ? v.field : "text"} onChange={(e) => setVars((x) => ({ ...x, [k]: e.target.value === "text" ? { source: "text", value: "" } : { source: "contact", field: e.target.value as "name", fallback: "there" } }))}>
                        {FIELDS.map(([f, l]) => <option key={f} value={f}>{l}</option>)}<option value="text">The same text for everyone</option>
                      </select>
                      {v?.source === "text" && <input className={clsx(inputCls, "mt-2")} placeholder="Text to insert" value={v.value} onChange={(e) => setVars((x) => ({ ...x, [k]: { source: "text", value: e.target.value } }))} />}
                      {v?.source === "contact" && <input className={clsx(inputCls, "mt-2")} placeholder="If we don't have it, say…" value={v.fallback ?? ""} onChange={(e) => setVars((x) => ({ ...x, [k]: { ...v, fallback: e.target.value } }))} />}
                    </div>
                  ); })}
                </div>
                <div><p className="mb-2 text-xs font-medium uppercase tracking-wide text-wa-muted">Preview</p><div className="wa-wall rounded-xl p-3"><div className="rounded-lg rounded-tl-none bg-white p-3 text-[13.5px] shadow-sm whitespace-pre-wrap">{preview}</div></div></div>
              </div>
            </Step>
          )}

          <Step n={4} title="When?" done={when === "now" || !!scheduledAt}>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm"><input type="radio" name="when" checked={when === "now"} onChange={() => setWhen("now")} className="accent-wa-green" />Send right away</label>
              <label className="flex items-center gap-3 text-sm"><input type="radio" name="when" checked={when === "later"} onChange={() => setWhen("later")} className="accent-wa-green" />Schedule for later</label>
              {when === "later" && <input type="datetime-local" className={inputCls} value={scheduledAt} min={minLocal} onChange={(e) => setScheduledAt(e.target.value)} />}
              {when === "later" && <p className="text-xs text-wa-muted">Scheduled campaigns start automatically. Keep the Campaigns page open, or set up the scheduled job described in the setup guide.</p>}
            </div>
          </Step>

          <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <AlertTriangle className="hidden h-5 w-5 shrink-0 text-amber-600 sm:block" />
            <p className="flex-1 text-sm text-wa-muted">Promotional messages are billed by Meta per message and can hurt your number&apos;s quality rating if people report them. Only send to people who agreed.</p>
            <Button onClick={submit} busy={busy} disabled={!valid}>{when === "now" ? `Send to ${count?.count ?? 0}` : "Schedule"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} aria-pressed={on} className={clsx("rounded-full border px-3 py-1 text-sm transition", on ? "border-wa-green bg-wa-green text-white" : "border-wa-line bg-white hover:border-wa-green")}>{children}</button>;
}
