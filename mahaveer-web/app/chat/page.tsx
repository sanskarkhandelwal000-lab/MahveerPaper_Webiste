import type { Metadata } from "next";
import { FullPageChat } from "@/components/chat/FullPageChat";

export const metadata: Metadata = {
  title: "Chat with Mahaveer Papers",
  description: "Ask our AI assistant for paper recommendations, samples, and quotes.",
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return <FullPageChat />;
}
