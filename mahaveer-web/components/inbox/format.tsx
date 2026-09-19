import type { ReactNode } from "react";

const TOKEN = /(https?:\/\/[^\s<]+[^\s<.,;:!?)"'])|(\*[^*\n]+\*)|(_[^_\n]+_)|(~[^~\n]+~)|(`[^`\n]+`)/g;

/** Renders WhatsApp-style text: links, *bold*, _italic_, ~strike~, `mono`, and line breaks. */
export function renderText(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const t = m[0];
    if (m[1]) out.push(<a key={k++} href={t} target="_blank" rel="noopener noreferrer" className="break-all text-[#027eb5] underline">{t}</a>);
    else if (m[2]) out.push(<strong key={k++}>{t.slice(1, -1)}</strong>);
    else if (m[3]) out.push(<em key={k++}>{t.slice(1, -1)}</em>);
    else if (m[4]) out.push(<s key={k++}>{t.slice(1, -1)}</s>);
    else out.push(<code key={k++} className="rounded bg-black/5 px-1 font-mono text-[13px]">{t.slice(1, -1)}</code>);
    last = i + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
