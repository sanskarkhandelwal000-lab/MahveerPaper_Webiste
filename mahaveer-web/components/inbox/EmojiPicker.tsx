"use client";
import { useState } from "react";
import clsx from "clsx";

const SETS: Array<{ icon: string; label: string; emojis: string[] }> = [
  { icon: "😀", label: "Smileys", emojis: "😀 😃 😄 😁 😆 😅 😂 🤣 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😋 😛 😜 🤪 😝 🤗 🤭 🤔 🤐 😐 😑 😶 🙄 😏 😌 😔 😴 🤤 😷 🤒 🤕 🥳 😎 🤓 😕 😟 🙁 😮 😲 😳 🥺 😢 😭 😤 😡 😱 😨 😰 😓 🥱 🤝".split(" ") },
  { icon: "👍", label: "Gestures", emojis: "👍 👎 👌 ✌️ 🤞 🤟 🤘 👈 👉 👆 👇 ☝️ ✋ 🖐️ 👋 🤙 💪 🙏 👏 🙌 👐 🤲 🤝 ✍️ 👀 🧠".split(" ") },
  { icon: "❤️", label: "Hearts", emojis: "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💯 ✨ 🌟 ⭐ 🔥 🎉 🎊 🎁 🏆 ✅ ❌ ⚠️ ❓ ❗".split(" ") },
  { icon: "📦", label: "Business", emojis: "📦 📄 📃 📑 📋 📎 📌 📍 📞 📱 ✉️ 📧 🏢 🏭 🚚 🛒 💰 💳 🧾 📈 📉 🗓️ ⏰ ⏳ 🔔 🏷️ ✂️ 🖨️ 🎨 🖌️ 📚".split(" ") },
];

export function EmojiPicker({ onPick }: { onPick: (e: string) => void }) {
  const [tab, setTab] = useState(0);
  return (
    <div className="w-[min(92vw,20rem)] rounded-xl border border-wa-line bg-white shadow-xl">
      <div className="flex border-b border-wa-line">
        {SETS.map((s, i) => (
          <button key={s.label} onClick={() => setTab(i)} title={s.label} aria-label={s.label} className={clsx("flex-1 py-2 text-lg", tab === i ? "border-b-2 border-wa-green" : "opacity-60")}>{s.icon}</button>
        ))}
      </div>
      <div className="grid h-52 grid-cols-8 gap-0.5 overflow-y-auto p-2">
        {SETS[tab].emojis.map((e) => (
          <button key={e} onClick={() => onPick(e)} className="flex h-9 items-center justify-center rounded text-[22px] hover:bg-wa-panel">{e}</button>
        ))}
      </div>
    </div>
  );
}

export const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "🙏", "✅"];
