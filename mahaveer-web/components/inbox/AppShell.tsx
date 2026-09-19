"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Users, Megaphone, FileText, Package, BarChart3, Shield, Settings, LogOut, MoreHorizontal, KeyRound } from "lucide-react";
import clsx from "clsx";
import { api, useApi } from "@/lib/inbox/client";
import type { ConversationItem } from "@/lib/inbox/types";
import { Avatar, Button, Field, Modal, inputCls } from "./ui";
import { toast } from "sonner";

interface User { id: string; name: string; email: string; role: "admin" | "agent" }

const NAV = [
  { href: "/inbox", label: "Chats", icon: MessageSquare, match: (p: string) => p === "/inbox" || p.startsWith("/inbox/c/") },
  { href: "/inbox/contacts", label: "Contacts", icon: Users },
  { href: "/inbox/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/inbox/templates", label: "Templates", icon: FileText },
  { href: "/inbox/samples", label: "Samples", icon: Package },
  { href: "/inbox/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/inbox/team", label: "Team", icon: Shield },
  { href: "/inbox/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE_MAIN = ["/inbox", "/inbox/contacts", "/inbox/campaigns", "/inbox/samples"];

export function AppShell({ user, mode, children }: { user: User; mode: "live" | "mock"; children: ReactNode }) {
  const pathname = usePathname();
  const [moreFor, setMoreFor] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const { data } = useApi<{ conversations: ConversationItem[] }>("/conversations?filter=unread&limit=200", { poll: 6000 });
  const unread = (data?.conversations ?? []).reduce((n, c) => n + c.unread_count, 0);

  useEffect(() => {
    document.title = unread > 0 ? `(${unread}) Inbox` : "Inbox";
  }, [unread]);
  const moreOpen = moreFor === pathname; // closes automatically when the route changes
  const setMoreOpen = (o: boolean) => setMoreFor(o ? pathname : null);

  const inChat = pathname.startsWith("/inbox/c/");
  const isActive = (n: (typeof NAV)[number]) => ("match" in n && n.match ? n.match(pathname) : pathname.startsWith(n.href) && (n.href !== "/inbox" || pathname === "/inbox"));

  async function logout() {
    await api("/auth/logout", { method: "POST", body: {} });
    location.href = "/inbox/login";
  }

  return (
    <div className="flex h-full flex-col md:flex-row">
      {mode === "mock" && (
        <div className="shrink-0 bg-amber-100 px-3 py-1 text-center text-[11px] font-medium text-amber-900 md:hidden">Test mode — nothing is sent to WhatsApp</div>
      )}
      {/* Desktop rail */}
      <nav aria-label="Main" className="hidden w-[68px] shrink-0 flex-col items-center justify-between border-r border-wa-line bg-wa-panel py-3 md:flex">
        <div className="flex flex-col items-center gap-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = isActive(n);
            return (
              <Link key={n.href} href={n.href} title={n.label} aria-label={n.label} aria-current={active ? "page" : undefined}
                className={clsx("relative flex h-11 w-11 items-center justify-center rounded-full transition", active ? "bg-wa-line text-wa-ink" : "text-wa-muted hover:bg-wa-line/70")}>
                <Icon className="h-[22px] w-[22px]" />
                {n.label === "Chats" && unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-wa-unread px-1 text-center text-[11px] font-semibold leading-[18px] text-white">{unread > 99 ? "99+" : unread}</span>
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-3">
          {mode === "mock" && <span title="Test mode — nothing is sent to WhatsApp" className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-900">TEST</span>}
          <UserMenu user={user} onLogout={logout} onPassword={() => setPwOpen(true)} />
        </div>
      </nav>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">{children}</main>

      {/* Mobile bottom bar */}
      {!inChat && (
        <nav aria-label="Main" className="flex shrink-0 items-stretch border-t border-wa-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
          {NAV.filter((n) => MOBILE_MAIN.includes(n.href)).map((n) => {
            const Icon = n.icon;
            const active = isActive(n);
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={clsx("relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium", active ? "text-wa-dark" : "text-wa-muted")}>
                <span className={clsx("relative flex h-7 w-14 items-center justify-center rounded-full", active && "bg-wa-out")}>
                  <Icon className="h-[22px] w-[22px]" />
                  {n.label === "Chats" && unread > 0 && <span className="absolute right-1 top-0 min-w-[16px] rounded-full bg-wa-unread px-1 text-center text-[10px] font-semibold leading-4 text-white">{unread > 99 ? "99+" : unread}</span>}
                </span>
                {n.label}
              </Link>
            );
          })}
          <button onClick={() => setMoreOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-wa-muted">
            <span className="flex h-7 w-14 items-center justify-center"><MoreHorizontal className="h-[22px] w-[22px]" /></span>
            More
          </button>
        </nav>
      )}

      {moreOpen && (
        <Modal title="More" onClose={() => setMoreOpen(false)}>
          <div className="-mx-2 space-y-1">
            {NAV.filter((n) => !MOBILE_MAIN.includes(n.href)).map((n) => {
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href} className="flex items-center gap-4 rounded-lg px-3 py-3 text-[15px] hover:bg-wa-hover"><Icon className="h-5 w-5 text-wa-muted" />{n.label}</Link>
              );
            })}
            <button onClick={() => { setMoreOpen(false); setPwOpen(true); }} className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left text-[15px] hover:bg-wa-hover"><KeyRound className="h-5 w-5 text-wa-muted" />Change password</button>
            <button onClick={logout} className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left text-[15px] text-red-600 hover:bg-red-50"><LogOut className="h-5 w-5" />Sign out ({user.name})</button>
          </div>
        </Modal>
      )}
      {pwOpen && <PasswordModal onClose={() => setPwOpen(false)} />}
    </div>
  );
}

function UserMenu({ user, onLogout, onPassword }: { user: User; onLogout: () => void; onPassword: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Account menu" className="rounded-full ring-offset-2 hover:ring-2 hover:ring-wa-line"><Avatar name={user.name} size={36} /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-12 z-40 w-56 rounded-xl border border-wa-line bg-white py-2 shadow-xl">
            <div className="border-b border-wa-line px-4 pb-2"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-wa-muted">{user.email} · {user.role}</p></div>
            <button onClick={() => { setOpen(false); onPassword(); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-wa-hover"><KeyRound className="h-4 w-4 text-wa-muted" />Change password</button>
            <button onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button>
          </div>
        </>
      )}
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      await api("/auth/password", { body: { current, next } });
      toast.success("Password changed");
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change password");
      setBusy(false);
    }
  }
  return (
    <Modal title="Change password" onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save} busy={busy} disabled={!current || next.length < 8}>Save</Button></>}>
      <div className="space-y-4">
        <Field label="Current password"><input className={inputCls} type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="New password" hint="At least 8 characters."><input className={inputCls} type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
