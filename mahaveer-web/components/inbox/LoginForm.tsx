"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { api } from "@/lib/inbox/client";
import { Button, Field, inputCls } from "./ui";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/auth/login", { body: { email, password } });
      location.href = "/inbox";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-wa-panel">
      <div className="h-56 bg-wa-green" />
      <div className="-mt-40 flex flex-1 items-start justify-center overflow-y-auto px-4 pb-8">
        <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wa-green text-white"><MessageCircle className="h-6 w-6" /></div>
            <div>
              <h1 className="text-lg font-medium leading-tight">Mahaveer Papers</h1>
              <p className="text-sm text-wa-muted">WhatsApp Inbox</p>
            </div>
          </div>
          <div className="space-y-4">
            <Field label="Email"><input className={inputCls} type="email" autoComplete="username" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Password"><input className={inputCls} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <Button type="submit" busy={busy} className="w-full">Sign in</Button>
          </div>
          <p className="mt-5 text-center text-xs text-wa-muted">Team access only. Ask an admin if you need an account.</p>
        </form>
      </div>
    </div>
  );
}
