import { z } from "zod";
import { route, body } from "@/lib/inbox/api";
import { resolveAudience } from "@/lib/inbox/campaigns";
import { queryOne } from "@/lib/inbox/db";

export const POST = route(async ({ req }) => {
  const a = await body(req, z.object({
    all: z.boolean().optional(),
    listIds: z.array(z.string().uuid()).optional(),
    tags: z.array(z.string()).optional(),
    contactIds: z.array(z.string().uuid()).optional(),
  }));
  const people = await resolveAudience(a);
  const skipped = await queryOne<{ n: number }>("select count(*)::int as n from contacts where not opted_in or blocked");
  return {
    count: people.length,
    sample: people.slice(0, 5).map((p) => p.name || p.profile_name || `+${p.wa_id}`),
    excludedNotOptedIn: skipped?.n ?? 0,
  };
});
