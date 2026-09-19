"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChatList } from "./ChatList";

/** Two-pane on desktop; on phones it's list -> full-screen chat, like WhatsApp. */
export function ChatsLayout({ children }: { children: ReactNode }) {
  const inChat = usePathname().startsWith("/inbox/c/");
  return (
    <div className="flex h-full min-h-0">
      <aside className={clsx("h-full min-h-0 w-full shrink-0 flex-col border-r border-wa-line bg-white md:flex md:w-[380px] lg:w-[420px]", inChat ? "hidden" : "flex")}>
        <ChatList />
      </aside>
      <section className={clsx("h-full min-h-0 min-w-0 flex-1 flex-col", inChat ? "flex" : "hidden md:flex")}>{children}</section>
    </div>
  );
}
