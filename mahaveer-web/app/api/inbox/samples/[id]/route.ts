import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const PATCH = route<{ id: string }>(async ({ req, params }) => {
  const { status } = await body(req, z.object({ status: z.enum(["awaiting", "new", "shipped", "closed"]) }));
  await query("update sample_requests set status = $2 where id = $1", [params.id, status]);
  return { ok: true };
});
