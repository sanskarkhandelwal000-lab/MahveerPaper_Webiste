import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/inbox/auth";
import { LoginForm } from "@/components/inbox/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/inbox");
  return <LoginForm />;
}
