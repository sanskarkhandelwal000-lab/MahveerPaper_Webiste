import { route } from "@/lib/inbox/api";
import { runCampaignBatch } from "@/lib/inbox/campaigns";

export const maxDuration = 60;

/** Advance a sending campaign (used by the UI while a campaign page is open, and as a cron fallback). */
export const POST = route<{ id: string }>(async ({ params }) => runCampaignBatch(params.id, 25_000));
