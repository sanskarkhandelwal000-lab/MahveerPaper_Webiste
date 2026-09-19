"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, useApi, dateTime } from "@/lib/inbox/client";
import { Badge, Button, PageHeader, Spinner } from "../ui";
import { STATUS_TONE, type CampaignRow } from "./CampaignsPage";

interface Recipient { id: string; status: "pending" | "sent" | "delivered" | "read" | "failed"; error: string | null; sent_at: string | null; name: string; wa_id: string }
const R_TONE = { pending: "gray", sent: "blue", delivered: "blue", read: "green", failed: "red" } as const;

export function CampaignDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, mutate } = useApi<{ campaign: CampaignRow; recipients: Recipient[] }>(`/campaigns/${id}`, { poll: 3000 });
  const c = data?.campaign;

  // Keep a running campaign moving even without a cron job.
  useEffect(() => {
    if (c?.status !== "sending" && c?.status !== "scheduled") return;
    const run = () => api(c.status === "sending" ? `/campaigns/${id}/run` : "/campaigns/tick", { method: "POST", body: {} }).then(() => mutate()).catch(() => undefined);
    void run();
    const t = setInterval(run, 20000);
    return () => clearInterval(t);
  }, [c?.status, id, mutate]);

  async function cancel() {
    if (!confirm("Stop this campaign? Messages already sent can't be recalled.")) return;
    try { await api(`/campaigns/${id}/cancel`, { method: "POST", body: {} }); await mutate(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function del() {
    if (!confirm("Delete this campaign and its report?")) return;
    try { await api(`/campaigns/${id}`, { method: "DELETE" }); router.push("/inbox/campaigns"); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function start() {
    try { const r = await api<{ total: number }>(`/campaigns/${id}/start`, { method: "POST", body: {} }); toast.success(`Sending to ${r.total} contacts`); await mutate(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  if (!c) return <div className="flex h-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  const stats = [["Recipients", c.total], ["Sent", c.sent], ["Delivered", c.delivered], ["Read", c.read], ["Failed", c.failed]] as const;
  const pct = c.total ? Math.round(((c.sent + c.failed) / c.total) * 100) : 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title={c.name} sub={`Template: ${c.template_name}${c.scheduled_at ? ` · scheduled ${dateTime(c.scheduled_at)}` : ""}`}
        actions={<>
          <Link href="/inbox/campaigns" className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-wa-dark hover:bg-wa-panel"><ArrowLeft className="h-4 w-4" />All campaigns</Link>
          {c.status === "draft" && <Button onClick={start}>Send now</Button>}
          {["draft", "scheduled", "sending"].includes(c.status) && <Button variant="outline" onClick={cancel}><XCircle className="h-4 w-4" />Cancel</Button>}
          {c.status !== "sending" && <Button variant="ghost" onClick={del} aria-label="Delete campaign"><Trash2 className="h-4 w-4 text-red-500" /></Button>}
        </>} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between"><Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>{c.total > 0 && <span className="text-sm text-wa-muted">{pct}% processed</span>}</div>
            <div className="h-2.5 overflow-hidden rounded-full bg-wa-panel"><div className="h-full rounded-full bg-wa-green transition-all" style={{ width: `${pct}%` }} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{stats.map(([l, v]) => <div key={l} className="rounded-lg bg-wa-panel p-3 text-center"><p className="text-2xl font-light">{v}</p><p className="text-xs uppercase tracking-wide text-wa-muted">{l}</p></div>)}</div>
          </div>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <h2 className="border-b border-wa-line px-4 py-3 text-sm font-medium">Recipients</h2>
            {data.recipients.length === 0 ? <p className="px-4 py-8 text-center text-sm text-wa-muted">Recipients appear once the campaign starts.</p> : (
              <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><tbody>{data.recipients.map((r) => (
                <tr key={r.id} className="border-b border-wa-line last:border-0"><td className="px-4 py-2.5"><p className="font-medium">{r.name}</p><p className="text-xs text-wa-muted">+{r.wa_id}</p></td><td className="px-2 py-2.5"><Badge tone={R_TONE[r.status]}>{r.status}</Badge></td><td className="px-2 py-2.5 text-xs text-red-600">{r.error}</td><td className="px-4 py-2.5 text-right text-xs text-wa-muted">{dateTime(r.sent_at)}</td></tr>
              ))}</tbody></table></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
