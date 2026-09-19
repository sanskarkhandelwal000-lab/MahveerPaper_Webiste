import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { getSessionUser, unauthorized, forbidden, type SessionUser } from "./auth";
import { WindowClosedError } from "./messages";

type Ctx<P> = { user: SessionUser; params: P; req: NextRequest };

/**
 * Wraps a route handler: requires a signed-in user (and optionally admin), resolves params,
 * turns thrown errors into JSON responses. Handlers may return a plain object (sent as JSON) or a Response.
 */
export function route<P = Record<string, string>>(
  handler: (ctx: Ctx<P>) => Promise<unknown>,
  opts: { admin?: boolean } = {},
) {
  return async (req: NextRequest, segment: { params: Promise<P> }) => {
    try {
      const user = await getSessionUser();
      if (!user) return unauthorized();
      if (opts.admin && user.role !== "admin") return forbidden();
      const out = await handler({ user, params: await (segment?.params ?? Promise.resolve({} as P)), req });
      return out instanceof Response ? out : NextResponse.json(out ?? { ok: true });
    } catch (e) {
      if (e instanceof ZodError) {
        return NextResponse.json({ error: e.issues.map((i) => i.message).join("; ") || "Invalid input" }, { status: 400 });
      }
      if (e instanceof WindowClosedError) {
        return NextResponse.json({ error: e.message, code: "WINDOW_CLOSED" }, { status: 409 });
      }
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error("inbox api error:", e);
      return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong" }, { status: 500 });
    }
  };
}

export class HttpError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function body<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  const raw = await req.json().catch(() => ({}));
  return schema.parse(raw);
}
