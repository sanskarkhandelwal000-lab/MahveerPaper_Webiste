import { z } from "zod";
import { route, body, HttpError } from "@/lib/inbox/api";
import { query, json } from "@/lib/inbox/db";
import { campaignStatsSql as STATS } from "@/lib/inbox/campaigns";


export const GET = route(async () => ({ campaigns: await query(`${STATS} order by c.created_at desc`) }));

const varSpec = z.union([
  z.object({ source: z.literal("text"), value: z.string() }),
  z.object({ source: z.literal("contact"), field: z.enum(["name", "first_name", "company", "location"]), fallback: z.string().optional() }),
]);

const schema = z.object({
  name: z.string().min(1).max(80),
  templateId: z.string().uuid(),
  audience: z.object({
    all: z.boolean().optional(),
    listIds: z.array(z.string().uuid()).optional(),
    tags: z.array(z.string()).optional(),
    contactIds: z.array(z.string().uuid()).optional(),
  }),
  variables: z.record(z.string(), varSpec).default({}),
  scheduledAt: z.string().datetime().nullish(),
});

export const POST = route(async ({ req, user }) => {
  const b = await body(req, schema);
  const t = await query<{ status: string; components: Array<{ type: string; text?: string }> }>("select status, components from templates where id = $1", [b.templateId]);
  if (!t[0]) throw new HttpError("Template not found");
  if (t[0].status !== "APPROVED") throw new HttpError("Only approved templates can be sent. Check the template's status.");
  const need = new Set([...(t[0].components.find((c) => c.type === "BODY")?.text ?? "").matchAll(/\{\{(\d+)\}\}/g)].map((m) => m[1]));
  for (const n of need) if (!b.variables[n]) throw new HttpError(`Fill in a value for variable {{${n}}}.`);
  if (b.scheduledAt && new Date(b.scheduledAt).getTime() < Date.now() - 60_000) throw new HttpError("Pick a schedule time in the future.");
  const rows = await query<{ id: string }>(
    `insert into campaigns (name, template_id, audience, variables, status, scheduled_at, created_by)
     values ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7) returning id`,
    [b.name.trim(), b.templateId, json(b.audience), json(b.variables), b.scheduledAt ? "scheduled" : "draft", b.scheduledAt ?? null, user.id],
  );
  return { id: rows[0].id };
});
