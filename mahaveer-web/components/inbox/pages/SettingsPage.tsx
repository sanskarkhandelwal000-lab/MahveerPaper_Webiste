"use client";
import { useState } from "react";
import { Copy, Check, X, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { api, useApi } from "@/lib/inbox/client";
import type { Label } from "@/lib/inbox/types";
import { Badge, Button, Field, PageHeader, Spinner, inputCls } from "../ui";

interface Settings { botEnabled: boolean; waMode: "live" | "mock"; webhookUrl: string; env: Record<string, boolean> }

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5"><h2 className="text-base font-medium">{title}</h2>{sub && <p className="mb-4 mt-0.5 text-sm text-wa-muted">{sub}</p>}{!sub && <div className="mb-3" />}{children}</section>
  );
}

export function SettingsPage() {
  const { data, mutate } = useApi<Settings>("/settings");
  const { data: me } = useApi<{ user: { role: string } }>("/auth/me");
  const { data: qr, mutate: mutateQr } = useApi<{ replies: Array<{ id: string; shortcut: string; body: string }> }>("/quick-replies");
  const { data: lb, mutate: mutateLb } = useApi<{ labels: Label[] }>("/labels");
  const [copied, setCopied] = useState(false);
  const [sc, setSc] = useState(""); const [body, setBody] = useState("");
  const [lname, setLname] = useState(""); const [lcolor, setLcolor] = useState("#00a884");
  const isAdmin = me?.user.role === "admin";
  if (!data) return <div className="flex h-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;

  const err = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong");
  async function setBot(v: boolean) { try { await api("/settings", { method: "PUT", body: { botEnabled: v } }); await mutate(); toast.success(v ? "Bot is on" : "Bot is off"); } catch (e) { err(e); } }
  async function addQr() { try { await api("/quick-replies", { body: { shortcut: sc, body } }); setSc(""); setBody(""); await mutateQr(); } catch (e) { err(e); } }
  async function delQr(id: string) { try { await api(`/quick-replies?id=${id}`, { method: "DELETE" }); await mutateQr(); } catch (e) { err(e); } }
  async function addLabel() { try { await api("/labels", { body: { name: lname, color: lcolor } }); setLname(""); await mutateLb(); } catch (e) { err(e); } }
  async function delLabel(id: string) { if (!confirm("Delete this label from all chats?")) return; try { await api(`/labels?id=${id}`, { method: "DELETE" }); await mutateLb(); } catch (e) { err(e); } }

  const ENV_LABELS: Record<string, string> = {
    WA_ACCESS_TOKEN: "WhatsApp access token", WA_PHONE_NUMBER_ID: "Phone number ID", WA_WABA_ID: "Business account ID (for templates)", WA_APP_SECRET: "App secret (verifies webhooks)",
    WA_VERIFY_TOKEN: "Webhook verify token", ANTHROPIC_API_KEY: "Anthropic key (bot)", DATABASE_URL: "Database (Postgres)", INBOX_SESSION_SECRET: "Login session secret",
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Settings" />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card title="Automatic replies (bot)" sub="The AI assistant that recommends products and takes sample requests. Chats you take over are paused automatically.">
            <button role="switch" aria-checked={data.botEnabled} disabled={!isAdmin} onClick={() => setBot(!data.botEnabled)} className="flex w-full items-center justify-between gap-3 rounded-lg bg-wa-panel px-4 py-3 text-left disabled:opacity-60">
              <span><span className="block text-sm font-medium">{data.botEnabled ? "Bot is ON" : "Bot is OFF"}</span><span className="text-xs text-wa-muted">{data.botEnabled ? "New customer messages get an automatic reply." : "Customers only hear from your team. (If your Make.com bot is still running, leave this off to avoid double replies.)"}</span></span>
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${data.botEnabled ? "bg-wa-green" : "bg-gray-300"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${data.botEnabled ? "left-[22px]" : "left-0.5"}`} /></span>
            </button>
            {!isAdmin && <p className="mt-2 text-xs text-wa-muted">Only admins can change this.</p>}
          </Card>

          <Card title="WhatsApp connection" sub={data.waMode === "live" ? "Connected to your WhatsApp Business number." : "Test mode: messages are stored but not sent to WhatsApp. Add your credentials to go live."}>
            <div className="mb-4 flex items-center gap-2"><Badge tone={data.waMode === "live" ? "green" : "amber"}>{data.waMode === "live" ? "Live" : "Test mode"}</Badge></div>
            <Field label="Webhook URL (paste into Meta)" hint="In Meta → WhatsApp → Configuration, set this as the Callback URL and subscribe to “messages”.">
              <div className="flex gap-2"><input readOnly className={inputCls} value={data.webhookUrl} onFocus={(e) => e.target.select()} /><Button variant="outline" onClick={() => { void navigator.clipboard?.writeText(data.webhookUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }} aria-label="Copy">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div>
            </Field>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">{Object.entries(data.env).map(([k, ok]) => <li key={k} className="flex items-center gap-2 text-sm">{ok ? <Check className="h-4 w-4 text-wa-green" /> : <X className="h-4 w-4 text-red-500" />}<span className={ok ? "" : "text-wa-muted"}>{ENV_LABELS[k] ?? k}</span></li>)}</ul>
          </Card>

          <Card title="Quick replies" sub="Type / in a chat to insert one. Great for hours, address, and pricing answers.">
            <ul className="mb-3 divide-y divide-wa-line rounded-lg border border-wa-line">
              {qr?.replies.map((r) => <li key={r.id} className="flex items-start gap-3 px-3 py-2.5"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-wa-green" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">/{r.shortcut}</p><p className="text-sm text-wa-muted">{r.body}</p></div><button onClick={() => delQr(r.id)} aria-label={`Delete /${r.shortcut}`} className="text-red-500"><Trash2 className="h-4 w-4" /></button></li>)}
              {qr?.replies.length === 0 && <li className="px-3 py-3 text-sm text-wa-muted">No quick replies yet.</li>}
            </ul>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr_auto]"><input className={inputCls} placeholder="shortcut" value={sc} onChange={(e) => setSc(e.target.value)} /><input className={inputCls} placeholder="Message text" value={body} onChange={(e) => setBody(e.target.value)} /><Button onClick={addQr} disabled={!sc.trim() || !body.trim()}>Add</Button></div>
          </Card>

          <Card title="Labels" sub="Colour tags you can put on chats to organise them.">
            <div className="mb-3 flex flex-wrap gap-2">{lb?.labels.map((l) => <span key={l.id} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white" style={{ background: l.color }}>{l.name}{isAdmin && <button onClick={() => delLabel(l.id)} aria-label={`Delete ${l.name}`}><X className="h-3.5 w-3.5" /></button>}</span>)}</div>
            {isAdmin ? <div className="flex gap-2"><input className={inputCls} placeholder="New label" value={lname} onChange={(e) => setLname(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lname.trim() && addLabel()} /><input type="color" aria-label="Label colour" value={lcolor} onChange={(e) => setLcolor(e.target.value)} className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-wa-line bg-white p-1" /><Button onClick={addLabel} disabled={!lname.trim()}>Add</Button></div> : <p className="text-xs text-wa-muted">Only admins can add or delete labels.</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
