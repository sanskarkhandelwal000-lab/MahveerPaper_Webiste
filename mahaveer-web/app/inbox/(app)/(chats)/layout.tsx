import { ChatsLayout } from "@/components/inbox/ChatsLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatsLayout>{children}</ChatsLayout>;
}
