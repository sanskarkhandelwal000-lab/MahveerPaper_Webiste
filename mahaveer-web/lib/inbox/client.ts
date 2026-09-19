"use client";
import useSWR, { type SWRConfiguration } from "swr";

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown; form?: FormData } = {}): Promise<T> {
  const res = await fetch(`/api/inbox${path}`, {
    method: init.method ?? (init.body || init.form ? "POST" : "GET"),
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.form ?? (init.body ? JSON.stringify(init.body) : undefined),
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && typeof window !== "undefined" && !location.pathname.startsWith("/inbox/login")) {
    location.href = "/inbox/login";
  }
  if (!res.ok) throw new ApiError(data.error ?? "Something went wrong", res.status, data.code);
  return data as T;
}

const fetcher = (path: string) => api(path);

/** GET with caching + optional polling. `path` null pauses the request. */
export function useApi<T>(path: string | null, opts: SWRConfiguration & { poll?: number } = {}) {
  const { poll, ...rest } = opts;
  return useSWR<T>(path, fetcher as (p: string) => Promise<T>, {
    refreshInterval: poll,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...rest,
  });
}

export function timeShort(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (days === 0) return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString("en-IN", { weekday: "long" });
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

export const clockTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();

export function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString("en-IN", { weekday: "long" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export const dateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }) : "—";
