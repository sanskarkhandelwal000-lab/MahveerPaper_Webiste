import { route, HttpError } from "@/lib/inbox/api";
import { queryOne, query } from "@/lib/inbox/db";
import { deleteMetaTemplate } from "@/lib/inbox/wa";

export const DELETE = route<{ id: string }>(async ({ params }) => {
  const t = await queryOne<{ name: string }>("select name from templates where id = $1", [params.id]);
  if (!t) throw new HttpError("Template not found", 404);
  const used = await queryOne<{ n: number }>("select count(*)::int as n from campaigns where template_id = $1", [params.id]);
  if (used && used.n > 0) throw new HttpError("This template is used by a campaign and can't be deleted.");
  await deleteMetaTemplate(t.name);
  await query("delete from templates where id = $1", [params.id]);
  return { ok: true };
}, { admin: true });
