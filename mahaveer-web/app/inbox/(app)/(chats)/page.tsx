import { MessageCircle, Lock } from "lucide-react";

export default function InboxHome() {
  return (
    <div className="hidden h-full flex-1 flex-col items-center justify-center gap-4 border-b-[6px] border-wa-green bg-wa-panel px-8 text-center md:flex">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-wa-green shadow-sm"><MessageCircle className="h-12 w-12" /></div>
      <h2 className="text-3xl font-light text-wa-ink">Mahaveer Papers Inbox</h2>
      <p className="max-w-md text-sm text-wa-muted">Select a chat to read and reply. Customer messages, bot replies and your manual replies all appear here in one place.</p>
      <p className="mt-6 flex items-center gap-1.5 text-xs text-wa-muted"><Lock className="h-3 w-3" /> Team access only</p>
    </div>
  );
}
