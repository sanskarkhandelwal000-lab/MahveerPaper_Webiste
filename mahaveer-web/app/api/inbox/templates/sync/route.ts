import { route } from "@/lib/inbox/api";
import { query, json } from "@/lib/inbox/db";
import { listMetaTemplates } from "@/lib/inbox/wa";

/** Pulls template list + approval status from Meta into the local table. */
export const POST = route(async () => {
  const remote = await listMetaTemplates();
  for (const t of remote) {
    await query(
      `insert into templates (wa_template_id, name, language, category, status, components, rejected_reason)
       values ($1,$2,$3,$4,$5,$6::jsonb,$7)
       on conflict (name, language) do update set wa_template_id = excluded.wa_template_id, category = excluded.category,
         status = excluded.status, components = excluded.components, rejected_reason = excluded.rejected_reason, updated_at = now()`,
      [t.id, t.name, t.language, t.category, t.status, json(t.components), t.rejected_reason ?? null],
    );
  }
  return { synced: remote.length };
});
