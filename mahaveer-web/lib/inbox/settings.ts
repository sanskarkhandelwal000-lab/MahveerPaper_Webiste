import { query, queryOne, json } from "./db";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const r = await queryOne<{ value: T }>("select value from settings where key = $1", [key]);
  return r ? r.value : fallback;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await query(
    "insert into settings (key, value) values ($1, $2::jsonb) on conflict (key) do update set value = excluded.value",
    [key, json(value)],
  );
}

export const botEnabled = () => getSetting<boolean>("bot_enabled", false);

/** Scrolling product carousel (a paid marketing template). Off = free single product cards. Default on. */
export const carouselEnabled = () => getSetting<boolean>("carousel_enabled", true);
