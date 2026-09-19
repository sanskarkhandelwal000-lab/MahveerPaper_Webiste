import { ChatView } from "@/components/inbox/ChatView";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatView key={id} id={id} />;
}
