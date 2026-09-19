import { SCHEMA_SQL } from "./schema";

/**
 * One tiny query interface over two Postgres backends:
 *  - DATABASE_URL set  -> node-postgres (Supabase / Neon / any Postgres) — production
 *  - DATABASE_URL unset -> embedded PGlite persisted in ./.data — local development
 * Always pass JSON values as JSON.stringify(...) with a ::jsonb cast in the SQL.
 */
type Row = Record<string, unknown>;

interface Backend {
  query(sql: string, params?: unknown[]): Promise<Row[]>;
  exec(sql: string): Promise<void>;
}

const g = globalThis as unknown as {
  __inboxBackend?: Promise<Backend>;
  __inboxReady?: Promise<void>;
};

async function createBackend(): Promise<Backend> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = await import("pg");
    const local = /localhost|127\.0\.0\.1/.test(url);
    const pool = new Pool({
      connectionString: url,
      ssl: local ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
    return {
      query: async (sql, params) => (await pool.query(sql, params as unknown[])).rows as Row[],
      exec: async (sql) => {
        await pool.query(sql);
      },
    };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = process.env.INBOX_PGLITE_DIR ?? "./.data/pglite";
  (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const db = new PGlite(dir);
  await db.waitReady;
  return {
    query: async (sql, params) => (await db.query(sql, params as unknown[])).rows as Row[],
    exec: async (sql) => {
      await db.exec(sql);
    },
  };
}

function backend(): Promise<Backend> {
  if (!g.__inboxBackend) {
    g.__inboxBackend = createBackend();
    g.__inboxBackend.catch(() => {
      g.__inboxBackend = undefined; // don't cache a failed connection
    });
  }
  return g.__inboxBackend;
}

/** Applies the schema once per process, then seeds the first admin if there are no users. */
export function ready(): Promise<void> {
  if (!g.__inboxReady) {
    g.__inboxReady = (async () => {
      const b = await backend();
      await b.exec(SCHEMA_SQL);
      const { seedInitialData } = await import("./seed");
      await seedInitialData();
    })();
    g.__inboxReady.catch(() => {
      g.__inboxReady = undefined;
    });
  }
  return g.__inboxReady;
}

export async function query<T = Row>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ready();
  return (await backend()).query(sql, params) as Promise<T[]>;
}

export async function queryOne<T = Row>(sql: string, params: unknown[] = []): Promise<T | null> {
  return (await query<T>(sql, params))[0] ?? null;
}

/** Raw access that skips seeding — only used by seed.ts itself to avoid recursion. */
export async function rawQuery<T = Row>(sql: string, params: unknown[] = []): Promise<T[]> {
  return (await backend()).query(sql, params) as Promise<T[]>;
}

export const json = (v: unknown) => JSON.stringify(v ?? null);
