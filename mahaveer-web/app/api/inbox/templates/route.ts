import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query, json } from "@/lib/inbox/db";
import { createMetaTemplate, waMode } from "@/lib/inbox/wa";

export const GET = route(async () => ({
  templates: await query("select id, name, language, category, status, components, rejected_reason from templates order by created_at desc"),
  waMode: waMode(),
}));

const button = z.discriminatedUnion("type", [
  z.object({ type: z.literal("QUICK_REPLY"), text: z.string().min(1).max(25) }),
  z.object({ type: z.literal("URL"), text: z.string().min(1).max(25), url: z.string().url() }),
  z.object({ type: z.literal("PHONE_NUMBER"), text: z.string().min(1).max(25), phone_number: z.string().min(6) }),
]);

const schema = z.object({
  name: z.string().min(1).max(60).regex(/^[a-z0-9_]+$/, "Name can only use lowercase letters, numbers and underscores"),
  language: z.string().default("en"),
  category: z.enum(["MARKETING", "UTILITY"]),
  header: z.string().max(60).optional(),
  body: z.string().min(1).max(1024),
  footer: z.string().max(60).optional(),
  examples: z.array(z.string()).default([]),
  buttons: z.array(button).max(10).default([]),
});

export const POST = route(async ({ req }) => {
  const b = await body(req, schema);
  const vars = [...b.body.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
  const max = vars.length ? Math.max(...vars) : 0;
  for (let i = 1; i <= max; i++) if (!vars.includes(i)) throw new HttpError(`Variables must be numbered in order: {{1}}, {{2}}… ({{${i}}} is missing)`);
  if (b.body.trim().startsWith("{{") || b.body.trim().endsWith("}}")) throw new HttpError("Meta doesn't allow a template to start or end with a variable — add some text around it.");
  if (max && b.examples.filter((e) => e.trim()).length < max) throw new HttpError(`Add an example value for each variable (${max}) — Meta requires them for review.`);

  const components: unknown[] = [];
  if (b.header?.trim()) components.push({ type: "HEADER", format: "TEXT", text: b.header.trim() });
  components.push({ type: "BODY", text: b.body, ...(max ? { example: { body_text: [b.examples.slice(0, max)] } } : {}) });
  if (b.footer?.trim()) components.push({ type: "FOOTER", text: b.footer.trim() });
  if (b.buttons.length) components.push({ type: "BUTTONS", buttons: b.buttons });

  const meta = await createMetaTemplate({ name: b.name, language: b.language, category: b.category, components });
  const rows = await query(
    `insert into templates (wa_template_id, name, language, category, status, components) values ($1,$2,$3,$4,$5,$6::jsonb)
     on conflict (name, language) do update set category = excluded.category, status = excluded.status, components = excluded.components, updated_at = now()
     returning id, name, language, category, status, components, rejected_reason`,
    [meta.id, b.name, b.language, b.category, meta.status ?? "PENDING", json(components)],
  );
  return { template: rows[0] };
});
