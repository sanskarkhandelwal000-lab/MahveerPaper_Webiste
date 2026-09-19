"use client";
import { useEffect, type ReactNode } from "react";
import { X, Loader2 } from "lucide-react";
import clsx from "clsx";

const COLORS = ["#25a244", "#0891b2", "#7c3aed", "#db2777", "#ea580c", "#2563eb", "#0d9488", "#b45309", "#4f46e5", "#be123c"];
const colorFor = (s: string) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const initials = name.replace(/^\+/, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "#";
  return (
    <div
      className={clsx("flex shrink-0 select-none items-center justify-center rounded-full font-medium text-white", className)}
      style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.4 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={clsx("animate-spin text-wa-green", className ?? "h-5 w-5")} />;
}

export function Modal({ title, onClose, children, wide, footer }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label={title} className={clsx("flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl", wide ? "sm:max-w-2xl" : "sm:max-w-md")}>
        <div className="flex items-center justify-between border-b border-wa-line px-5 py-4">
          <h2 className="text-[17px] font-medium text-wa-ink">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-wa-muted hover:bg-wa-panel"><X className="h-5 w-5" /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-wa-line bg-wa-panel/60 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "outline"; busy?: boolean };
export function Button({ variant = "primary", busy, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || busy}
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-wa-green text-white hover:bg-wa-dark",
        variant === "outline" && "border border-wa-line bg-white text-wa-ink hover:bg-wa-hover",
        variant === "ghost" && "text-wa-dark hover:bg-wa-panel",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export const inputCls =
  "w-full rounded-lg border border-wa-line bg-white px-3 py-2.5 text-base text-wa-ink placeholder:text-wa-muted/70 focus:border-wa-green focus:outline-none focus:ring-1 focus:ring-wa-green sm:text-sm";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-wa-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-wa-muted">{hint}</span>}
    </label>
  );
}

export function Empty({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-wa-muted">
      <div className="text-wa-muted/60">{icon}</div>
      <p className="text-base font-medium text-wa-ink">{title}</p>
      {children && <p className="max-w-sm text-sm">{children}</p>}
    </div>
  );
}

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "amber" | "red" | "blue" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-wa-line bg-white px-4 py-4 sm:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-medium text-wa-ink">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-wa-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
