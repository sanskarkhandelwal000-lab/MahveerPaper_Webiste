import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/inbox/auth";
import { waMode } from "@/lib/inbox/wa";
import { AppShell } from "@/components/inbox/AppShell";

export const dynamic = "force-dynamic";

export default async function InboxAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/inbox/login");
  return <AppShell user={user} mode={waMode()}>{children}</AppShell>;
}
