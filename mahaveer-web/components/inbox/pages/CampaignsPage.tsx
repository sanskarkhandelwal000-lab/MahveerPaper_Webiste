"use client";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Megaphone } from "lucide-react";
import { api, useApi, dateTime } from "@/lib/inbox/client";
import { Badge, Button, Empty, PageHeader, Spinner } from "../ui";

export interface CampaignRow {
  id: string; name: string; status: "draft" | "scheduled" | "sending" | "completed" | "cancelled";
  scheduled_at: string | null; started_at: string | null; created_at: string; template_name: string; created_by_name: string | null;
  total: number; sent: number; delivered: number; read: number; failed: number;
}

export const STATUS_TONE = { draft: "gray", scheduled: "blue", sending: "amber", completed: "green", cancelled: "red" } as const;

export function CampaignsPage() {
  const { data, mutate, isLoading } = useApi<{ campaigns: CampaignRow[] }>("/campaigns", { poll: 5000 });
  const rows = useMemo(() => data?.campaigns ?? [], [data]);

  // Hosts without cron: nudge due/scheduled/running campaigns while this page is open.
  useEffect(() => {
    if (!rows.some((c) => c.status === "scheduled" || c.status === "sending")) return;
    const t = setInterval(() => { void api("/campaigns/tick", { method: "POST", body: {} }).then(() => mutate()).catch(() => undefined); }, 30000);
    return () => clearInterval(t);
  }, [rows, mutate]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Campaigns" sub="Send an approved template to many contacts at once" actions={<Link href="/inbox/campaigns/new"><Button><Plus className="h-4 w-4" />New campaign</Button></Link>} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        {isLoading && !data && <div className="flex justify-center py-12"><Spinner /></div>}
        {data && rows.length === 0 && <Empty icon={<Megaphone className="h-12 w-12" />} title="No campaigns yet">Create a template, add opted-in contacts, then send your first campaign.</Empty>}
        <div className="mx-auto max-w-4xl space-y-3">
          {rows.map((c) => {
            const pct = c.total ? Math.round(((c.sent + c.failed) / c.total) * 100) : 0;
            return (
              <Link key={c.id} href={`/inbox/campaigns/${c.id}`} className="block rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0"><h3 className="truncate text-base font-medium">{c.name}</h3><p className="text-xs text-wa-muted">Template: {c.template_name} · {c.status === "scheduled" ? `scheduled ${dateTime(c.scheduled_at)}` : `created ${dateTime(c.created_at)}`}{c.created_by_name ? ` · ${c.created_by_name}` : ""}</p></div>
                  <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                </div>
                {c.total > 0 && (
                  <>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-wa-panel"><div className="h-full rounded-full bg-wa-green transition-all" style={{ width: `${pct}%` }} /></div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-wa-muted"><span><strong className="text-wa-ink">{c.sent}</strong> / {c.total} sent</span><span><strong className="text-wa-ink">{c.delivered}</strong> delivered</span><span><strong className="text-wa-ink">{c.read}</strong> read</span>{c.failed > 0 && <span className="text-red-600"><strong>{c.failed}</strong> failed</span>}</div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
