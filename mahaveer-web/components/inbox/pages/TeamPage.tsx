"use client";
import { useState } from "react";
import { Plus, Pencil, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { api, useApi } from "@/lib/inbox/client";
import type { UserItem } from "@/lib/inbox/types";
import { Avatar, Badge, Button, Empty, Field, Modal, PageHeader, Spinner, inputCls } from "../ui";

export function TeamPage() {
  const { data, mutate } = useApi<{ users: UserItem[] }>("/team");
  const { data: me } = useApi<{ user: { id: string; role: string } }>("/auth/me");
  const [edit, setEdit] = useState<Partial<UserItem> | null>(null);
  const isAdmin = me?.user.role === "admin";
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Team" sub="Everyone who can use this inbox" actions={isAdmin ? <Button onClick={() => setEdit({ role: "agent" })}><Plus className="h-4 w-4" />Add member</Button> : undefined} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-wa-panel p-4 sm:p-6">
        {!data && <div className="flex justify-center py-12"><Spinner /></div>}
        {data?.users.length === 0 && <Empty icon={<User className="h-12 w-12" />} title="No team members" />}
        <div className="mx-auto max-w-3xl space-y-2">
          {data?.users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
              <Avatar name={u.name} size={44} />
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{u.name}{u.id === me?.user.id && <span className="ml-2 text-xs text-wa-muted">(you)</span>}</p><p className="truncate text-sm text-wa-muted">{u.email}</p></div>
              <div className="flex items-center gap-2">{u.role === "admin" ? <Badge tone="blue"><ShieldCheck className="mr-1 h-3 w-3" />Admin</Badge> : <Badge>Agent</Badge>}{!u.active && <Badge tone="red">Inactive</Badge>}</div>
              {isAdmin && <button onClick={() => setEdit(u)} aria-label={`Edit ${u.name}`} className="rounded-full p-2 text-wa-muted hover:bg-wa-panel"><Pencil className="h-4 w-4" /></button>}
            </div>
          ))}
          <p className="px-1 pt-3 text-xs text-wa-muted"><strong>Admins</strong> can manage the team, labels, templates, and settings. <strong>Agents</strong> can chat, add notes, and run campaigns.</p>
        </div>
      </div>
      {edit && <MemberModal initial={edit} selfId={me?.user.id} onClose={() => setEdit(null)} onDone={async () => { setEdit(null); await mutate(); }} />}
    </div>
  );
}

function MemberModal({ initial, selfId, onClose, onDone }: { initial: Partial<UserItem>; selfId?: string; onClose: () => void; onDone: () => Promise<void> }) {
  const isNew = !initial.id;
  const [f, setF] = useState({ name: initial.name ?? "", email: initial.email ?? "", password: "", role: initial.role ?? "agent", active: initial.active ?? true });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      if (isNew) await api("/team", { body: { name: f.name, email: f.email, password: f.password, role: f.role } });
      else await api(`/team/${initial.id}`, { method: "PATCH", body: { name: f.name, role: f.role, active: f.active, ...(f.password ? { password: f.password } : {}) } });
      toast.success(isNew ? "Member added" : "Saved");
      await onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save"); setBusy(false); }
  }
  return (
    <Modal title={isNew ? "Add team member" : "Edit member"} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save} busy={busy} disabled={!f.name.trim() || (isNew && (!f.email || f.password.length < 8)) || (!!f.password && f.password.length < 8)}>Save</Button></>}>
      <div className="space-y-4">
        <Field label="Name"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email"><input className={inputCls} type="email" disabled={!isNew} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label={isNew ? "Password" : "New password (leave blank to keep)"} hint="At least 8 characters."><input className={inputCls} type="password" autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
        <Field label="Role"><select className={inputCls} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as "admin" | "agent" })}><option value="agent">Agent</option><option value="admin">Admin</option></select></Field>
        {!isNew && initial.id !== selfId && <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-wa-green" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} />Active (can sign in)</label>}
      </div>
    </Modal>
  );
}
