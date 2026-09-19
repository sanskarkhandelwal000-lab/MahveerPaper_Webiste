"use client";
import { useRouter } from "next/navigation";
import { Package, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { api, useApi, dateTime } from "@/lib/inbox/client";
import { Badge, Empty, PageHeader, Spinner, inputCls } from "../ui";

interface Sample { id: string; product_name: string | null; status: "awaiting" | "new" | "shipped" | "closed"; created_at: string; name: string | null; email: string | null; location: string | null; wa_id: string | null; contact_name: string; conversation_id: string | null }

const TONE = { awaiting: "amber", new: "blue", shipped: "green", closed: "gray" } as const;

export function SamplesPage() {
  const router = useRouter();
  const { data, mutate, isLoading } = useApi<{ samples: Sample[] }>("/samples", { poll: 15000 });
  const rows = data?.samples ?? [];
  async function setStatus(id: string, status: string) {
    try { await api(`/samples/${id}`, { method: "PATCH", body: { status } }); await mutate(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Sample requests" sub="Requests customers made from the product cards in WhatsApp" />
      <div className="min-h-0 flex-1 overflow-auto bg-white">
        {isLoading && !data && <div className="flex justify-center py-12"><Spinner /></div>}
        {data && rows.length === 0 && <Empty icon={<Package className="h-12 w-12" />} title="No sample requests yet">When a customer taps “Request Sample” on a product and sends their details, it shows up here.</Empty>}
        {rows.length > 0 && (
          <ul className="divide-y divide-wa-line md:hidden">
            {rows.map((s) => (
              <li key={s.id} className="space-y-2 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="font-medium">{s.product_name ?? "—"}</p><p className="text-sm">{s.name ?? s.contact_name} <span className="text-xs text-wa-muted">{s.wa_id ? `+${s.wa_id}` : ""}</span></p></div>
                  {s.conversation_id && <button onClick={() => router.push(`/inbox/c/${s.conversation_id}`)} aria-label="Open chat" className="rounded-full p-2 text-wa-dark hover:bg-wa-out"><MessageCircle className="h-5 w-5" /></button>}
                </div>
                {s.status === "awaiting" ? <Badge tone="amber">Waiting for their details</Badge> : <p className="text-sm text-wa-muted">{s.email}<br />{s.location}</p>}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-wa-muted">{dateTime(s.created_at)}</span>
                  <select aria-label="Status" className={`${inputCls} !w-auto !py-1.5`} value={s.status} onChange={(e) => setStatus(s.id, e.target.value)}><option value="awaiting">Awaiting details</option><option value="new">New</option><option value="shipped">Shipped</option><option value="closed">Closed</option></select>
                </div>
              </li>
            ))}
          </ul>
        )}
        {rows.length > 0 && (
          <table className="hidden w-full min-w-[760px] text-left text-sm md:table">
            <thead className="sticky top-0 bg-wa-panel text-xs uppercase tracking-wide text-wa-muted"><tr><th className="px-4 py-2.5 sm:px-6">Product</th><th className="px-2 py-2.5">Customer</th><th className="px-2 py-2.5">Delivery details</th><th className="px-2 py-2.5">Requested</th><th className="px-2 py-2.5">Status</th><th className="px-4 py-2.5" /></tr></thead>
            <tbody>{rows.map((s) => (
              <tr key={s.id} className="border-b border-wa-line align-top hover:bg-wa-hover">
                <td className="px-4 py-3 font-medium sm:px-6">{s.product_name ?? "—"}</td>
                <td className="px-2 py-3"><p>{s.name ?? s.contact_name}</p><p className="text-xs text-wa-muted">{s.wa_id ? `+${s.wa_id}` : ""}</p></td>
                <td className="px-2 py-3 text-wa-muted">{s.status === "awaiting" ? <Badge tone="amber">Waiting for their details</Badge> : <><p>{s.email}</p><p className="max-w-64">{s.location}</p></>}</td>
                <td className="px-2 py-3 text-wa-muted">{dateTime(s.created_at)}</td>
                <td className="px-2 py-3"><select aria-label="Status" className={`${inputCls} !w-auto !py-1.5`} value={s.status} onChange={(e) => setStatus(s.id, e.target.value)}><option value="awaiting">Awaiting details</option><option value="new">New</option><option value="shipped">Shipped</option><option value="closed">Closed</option></select><span className="ml-2 hidden"><Badge tone={TONE[s.status]}>{s.status}</Badge></span></td>
                <td className="px-4 py-3 text-right">{s.conversation_id && <button onClick={() => router.push(`/inbox/c/${s.conversation_id}`)} aria-label="Open chat" title="Open chat" className="rounded-full p-2 text-wa-dark hover:bg-wa-out"><MessageCircle className="h-4 w-4" /></button>}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
