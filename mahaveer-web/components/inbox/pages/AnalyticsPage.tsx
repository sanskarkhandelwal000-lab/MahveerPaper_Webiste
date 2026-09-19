"use client";
import { useState } from "react";
import clsx from "clsx";
import { useApi } from "@/lib/inbox/client";
import { PageHeader, Spinner } from "../ui";

interface Data {
  days: number;
  totals: { contacts: number; open_chats: number; unread_chats: number; needs_human: number; inbound: number; outbound: number; resolved: number };
  daily: Array<{ day: string; inbound: number; outbound: number }>;
  bySender: Array<{ sender_type: string; n: number }>;
  agents: Array<{ name: string; messages: number; chats: number }>;
  response: { avg_sec: number | null; median_sec: number | null } | null;
  labels: Array<{ name: string; color: string; n: number }>;
  campaigns: { campaigns: number; sent: number; delivered: number; read: number } | null;
}

const dur = (s: number | null | undefined) => (s == null ? "—" : s < 90 ? `${s}s` : s < 5400 ? `${Math.round(s / 60)} min` : `${(s / 3600).toFixed(1)} h`);
const SENDER: Record<string, string> = { bot: "Bot", agent: "Team", campaign: "Campaigns", system: "System" };

export function AnalyticsPage() {
  const [days, setDays] = useState(14);
  const { data } = useApi<Data>(`/analytics?days=${days}`, { poll: 30000 });
  if (!data) return <div className="flex h-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  const t = data.totals;
  const cards: Array<[string, number | string, string?]> = [
    ["Open chats", t.open_chats], ["Unread chats", t.unread_chats], ["Need a human", t.needs_human, t.needs_human > 0 ? "text-amber-600" : undefined],
    [`Received (${days}d)`, t.inbound], [`Sent (${days}d)`, t.outbound], ["Avg. first reply", dur(data.response?.avg_sec)],
    ["Median first reply", dur(data.response?.median_sec)], ["Contacts", t.contacts], [`Resolved (${days}d)`, t.resolved],
  ];
  const max = Math.max(1, ...data.daily.flatMap((d) => [d.inbound, d.outbound]));
  const W = 700, H = 200, pad = 28, bw = (W - pad * 2) / data.daily.length;
  const totalOut = data.bySender.reduce((n, s) => n + s.n, 0) || 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Analytics" sub="How conversations are going" actions={
        <div role="tablist" aria-label="Period" className="flex rounded-full bg-wa-panel p-1">{[7, 14, 30, 90].map((d) => <button key={d} role="tab" aria-selected={days === d} onClick={() => setDays(d)} className={clsx("rounded-full px-3.5 py-1.5 text-sm font-medium", days === d ? "bg-white shadow-sm" : "text-wa-muted")}>{d}d</button>)}</div>} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{cards.map(([l, v, c]) => <div key={l} className="rounded-xl bg-white p-4 shadow-sm"><p className={clsx("text-3xl font-light", c)}>{v}</p><p className="mt-1 text-xs uppercase tracking-wide text-wa-muted">{l}</p></div>)}</div>

          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-medium">Messages per day</h2><div className="flex gap-4 text-xs text-wa-muted"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-[#53bdeb]" />Received</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-wa-green" />Sent</span></div></div>
            <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" role="img" aria-label={`Messages per day for the last ${days} days`}>
              {[0, 0.5, 1].map((f) => <g key={f}><line x1={pad} x2={W - pad} y1={H - f * (H - 10)} y2={H - f * (H - 10)} stroke="#e9edef" /><text x={pad - 6} y={H - f * (H - 10) + 4} textAnchor="end" fontSize="10" fill="#667781">{Math.round(max * f)}</text></g>)}
              {data.daily.map((d, i) => {
                const x = pad + i * bw; const hi = (d.inbound / max) * (H - 10); const ho = (d.outbound / max) * (H - 10); const w = Math.max(2, bw * 0.34);
                return (
                  <g key={d.day}><title>{`${d.day}: ${d.inbound} received, ${d.outbound} sent`}</title>
                    <rect x={x + bw * 0.12} y={H - hi} width={w} height={hi} rx="2" fill="#53bdeb" />
                    <rect x={x + bw * 0.12 + w + 2} y={H - ho} width={w} height={ho} rx="2" fill="#00a884" />
                    {(data.daily.length <= 14 || i % Math.ceil(data.daily.length / 10) === 0) && <text x={x + bw / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="#667781">{new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</text>}
                  </g>
                );
              })}
            </svg>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5"><h2 className="mb-3 text-base font-medium">Who is replying</h2>
              {data.bySender.length === 0 ? <p className="text-sm text-wa-muted">No replies yet.</p> : <ul className="space-y-3">{data.bySender.map((s) => <li key={s.sender_type}><div className="mb-1 flex justify-between text-sm"><span>{SENDER[s.sender_type] ?? s.sender_type}</span><span className="text-wa-muted">{s.n} · {Math.round((s.n / totalOut) * 100)}%</span></div><div className="h-2 rounded-full bg-wa-panel"><div className="h-full rounded-full bg-wa-green" style={{ width: `${(s.n / totalOut) * 100}%` }} /></div></li>)}</ul>}
            </section>
            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5"><h2 className="mb-3 text-base font-medium">Team activity</h2>
              {data.agents.length === 0 ? <p className="text-sm text-wa-muted">No manual replies in this period.</p> : <table className="w-full text-sm"><thead className="text-left text-xs uppercase tracking-wide text-wa-muted"><tr><th className="pb-2">Member</th><th className="pb-2 text-right">Messages</th><th className="pb-2 text-right">Chats</th></tr></thead><tbody>{data.agents.map((a) => <tr key={a.name} className="border-t border-wa-line"><td className="py-2">{a.name}</td><td className="py-2 text-right">{a.messages}</td><td className="py-2 text-right">{a.chats}</td></tr>)}</tbody></table>}
            </section>
            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5"><h2 className="mb-3 text-base font-medium">Chats by label</h2>
              {data.labels.length === 0 ? <p className="text-sm text-wa-muted">No labels yet.</p> : <ul className="space-y-2">{data.labels.map((l) => <li key={l.name} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full" style={{ background: l.color }} />{l.name}</span><span className="text-wa-muted">{l.n}</span></li>)}</ul>}
            </section>
            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5"><h2 className="mb-3 text-base font-medium">Campaigns ({days}d)</h2>
              {!data.campaigns || data.campaigns.campaigns === 0 ? <p className="text-sm text-wa-muted">No campaigns in this period.</p> : <dl className="grid grid-cols-2 gap-3 text-sm">{([["Campaigns", data.campaigns.campaigns], ["Sent", data.campaigns.sent], ["Delivered", data.campaigns.delivered], ["Read", data.campaigns.read]] as const).map(([l, v]) => <div key={l} className="rounded-lg bg-wa-panel p-3"><dd className="text-2xl font-light">{v}</dd><dt className="text-xs uppercase tracking-wide text-wa-muted">{l}</dt></div>)}</dl>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
