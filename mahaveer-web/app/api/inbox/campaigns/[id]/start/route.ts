import { after } from "next/server";
import { route, HttpError } from "@/lib/inbox/api";
import { queryOne } from "@/lib/inbox/db";
import { startCampaign, runCampaignBatch } from "@/lib/inbox/campaigns";

export const maxDuration = 60;

export const POST = route<{ id: string }>(async ({ params }) => {
  const c = await queryOne<{ status: string }>("select status from campaigns where id = $1", [params.id]);
  if (!c) throw new HttpError("Campaign not found", 404);
  if (!["draft", "scheduled"].includes(c.status)) throw new HttpError("This campaign has already started.");
  const total = await startCampaign(params.id);
  after(() => runCampaignBatch(params.id, 50_000).then(() => undefined));
  return { total };
});
