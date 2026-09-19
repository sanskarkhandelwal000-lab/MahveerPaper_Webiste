import { route } from "@/lib/inbox/api";
import { tickCampaigns } from "@/lib/inbox/campaigns";

export const maxDuration = 60;

/** Fallback for hosts without cron: the campaigns page pings this while open. */
export const POST = route(async () => {
  await tickCampaigns();
  return { ok: true };
});
