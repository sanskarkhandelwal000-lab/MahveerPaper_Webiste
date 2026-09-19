import bcrypt from "bcryptjs";
import { rawQuery as q, json } from "./db";

/**
 * First-run seeding.
 *  - Admin: from INBOX_ADMIN_EMAIL / INBOX_ADMIN_PASSWORD. In development only, falls back to
 *    admin@mahaveer.local / admin123 so the UI can be opened immediately.
 *  - Starter labels + quick replies (only when those tables are empty).
 *  - Demo conversations: only when INBOX_DEMO=1 (never in production by default).
 */
export async function seedInitialData(): Promise<void> {
  const users = await q<{ n: number }>("select count(*)::int as n from users");
  if (users[0].n === 0) {
    const dev = process.env.NODE_ENV !== "production";
    const email = process.env.INBOX_ADMIN_EMAIL ?? (dev ? "admin@mahaveer.local" : undefined);
    const password = process.env.INBOX_ADMIN_PASSWORD ?? (dev ? "admin123" : undefined);
    if (email && password) {
      await q("insert into users (email, name, password_hash, role) values ($1, $2, $3, 'admin')", [
        email.toLowerCase(),
        "Admin",
        await bcrypt.hash(password, 10),
      ]);
    }
  }

  const labels = await q<{ n: number }>("select count(*)::int as n from labels");
  if (labels[0].n === 0) {
    for (const [name, color] of [
      ["New lead", "#2563eb"],
      ["Sample request", "#ea580c"],
      ["Customer", "#16a34a"],
      ["Follow up", "#9333ea"],
    ]) {
      await q("insert into labels (name, color) values ($1, $2)", [name, color]);
    }
  }

  const qr = await q<{ n: number }>("select count(*)::int as n from quick_replies");
  if (qr[0].n === 0) {
    for (const [shortcut, body] of [
      ["hello", "Hello! Thanks for reaching out to Mahaveer Papers. How can we help you today?"],
      ["thanks", "Thank you! Let us know if you need anything else."],
      ["quote", "For pricing and bulk orders please share the paper name, GSM, size and quantity, and we'll send you a quote."],
      ["hours", "Our showroom is open Monday to Saturday, 10am to 7pm."],
    ]) {
      await q("insert into quick_replies (shortcut, body) values ($1, $2)", [shortcut, body]);
    }
  }

  if (process.env.INBOX_DEMO === "1") await seedDemo();
}

export async function seedDemo(): Promise<void> {
  const existing = await q<{ n: number }>("select count(*)::int as n from contacts");
  if (existing[0].n > 0) return;

  const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();

  const people: Array<{
    wa: string; name: string; tags: string[]; email?: string; location?: string;
    msgs: Array<{ d: "in" | "out"; by?: string; text?: string; type?: string; min: number; status?: string; extra?: Record<string, unknown> }>;
    unread?: number; pinned?: boolean; needsHuman?: boolean; paused?: boolean;
  }> = [
    {
      wa: "919876500001", name: "Riya Shah", tags: ["packaging", "bengaluru"], email: "riya@studio.in", location: "Bengaluru",
      unread: 2, needsHuman: true,
      msgs: [
        { d: "in", text: "Hi", min: 190 },
        { d: "out", by: "bot", text: "Hello! What are you looking for — printing, packaging, or something else?", min: 189, status: "read" },
        { d: "in", text: "Need black paper for luxury gift boxes, around 300 gsm", min: 185 },
        { d: "out", by: "bot", text: "VTC Black and Mystique both work well for gift boxes at 300 gsm.", min: 184, status: "read" },
        { d: "in", text: "Can someone call me? I want to discuss a bulk order of 2000 sheets.", min: 12 },
        { d: "in", text: "Also do you deliver to Whitefield?", min: 11 },
      ],
    },
    {
      wa: "919876500002", name: "Anil Mehta", tags: ["customer", "ahmedabad"], location: "Ahmedabad", pinned: true,
      msgs: [
        { d: "in", text: "Please share your showroom location", min: 1500 },
        { d: "out", by: "agent", text: "Sure! Here is our Ahmedabad branch.", min: 1490, status: "read" },
        { d: "out", by: "agent", type: "location", min: 1489, status: "read", extra: { location: { latitude: 23.0225, longitude: 72.5714, name: "Mahaveer Papers Ahmedabad", address: "D-11, Sumel Business Park 6, Dudheshwar" } } },
        { d: "in", text: "Thank you, will visit tomorrow", min: 1480 },
        { d: "out", by: "agent", text: "Great, see you then!", min: 1479, status: "delivered" },
      ],
    },
    {
      wa: "919876500003", name: "Kavya Iyer", tags: ["sample-request"], email: "kavya@invites.co", location: "Chennai", unread: 1,
      msgs: [
        { d: "in", text: "Need something for wedding invitations", min: 70 },
        { d: "out", by: "bot", text: "Burano and Twill are lovely for wedding invitations.", min: 69, status: "read" },
        { d: "out", by: "bot", type: "interactive", text: "Burano — Spectrum · 250 · 320 GSM", min: 69, status: "read", extra: { interactive: { buttons: ["Request Sample"] } } },
        { d: "in", type: "button", text: "Request Sample", min: 66 },
        { d: "out", by: "bot", text: "Great choice — Burano! Just reply with your Name, Email and Delivery Address in one message, separated by commas.", min: 66, status: "read" },
        { d: "in", text: "Kavya Iyer, kavya@invites.co, 14 Anna Nagar, Chennai", min: 60 },
        { d: "out", by: "bot", text: "Thanks Kavya Iyer! We've got your sample request for Burano.", min: 60, status: "read" },
        { d: "in", type: "contacts", min: 5, extra: { contacts: [{ name: { formatted_name: "Suresh Print House" }, phones: [{ phone: "+91 98450 11223" }] }] } },
      ],
    },
    {
      wa: "919876500004", name: "Print Works Pune", tags: ["printer"], location: "Pune", paused: true,
      msgs: [
        { d: "in", text: "Do you stock Tyvek?", min: 3000 },
        { d: "out", by: "bot", text: "Yes, Tyvek 1073B is available in 56 and 105 GSM.", min: 2999, status: "read" },
        { d: "out", by: "agent", text: "Hi, this is Bhavik from Mahaveer. Happy to share a quote — what quantity?", min: 2900, status: "failed", extra: { error: "Message outside the 24-hour window" } },
      ],
    },
  ];

  for (const p of people) {
    const c = await q<{ id: string }>(
      `insert into contacts (wa_id, name, profile_name, email, location, tags, opted_in, opted_in_at)
       values ($1,$2,$2,$3,$4,$5,true, now()) returning id`,
      [p.wa, p.name, p.email ?? null, p.location ?? null, p.tags],
    );
    const last = p.msgs[p.msgs.length - 1];
    const lastIn = [...p.msgs].reverse().find((m) => m.d === "in");
    const conv = await q<{ id: string }>(
      `insert into conversations (contact_id, unread_count, pinned, needs_human, bot_paused, last_message_at,
         last_message_preview, last_message_direction, last_inbound_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
      [
        c[0].id, p.unread ?? 0, p.pinned ?? false, p.needsHuman ?? false, p.paused ?? false,
        ago(last.min), last.text ?? (last.type === "contacts" ? "👤 Contact" : last.type === "location" ? "📍 Location" : "Message"), last.d, lastIn ? ago(lastIn.min) : null,
      ],
    );
    let i = 0;
    for (const m of p.msgs) {
      i += 1;
      await q(
        `insert into messages (conversation_id, wa_message_id, direction, sender_type, type, body, location, contacts, interactive, status, error, created_at)
         values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10,$11,$12)`,
        [
          conv[0].id, `demo-${p.wa}-${i}`, m.d,
          m.d === "in" ? "customer" : (m.by ?? "agent"),
          m.type ?? "text", m.text ?? null,
          json(m.extra?.location ?? null), json(m.extra?.contacts ?? null), json(m.extra?.interactive ?? null),
          m.d === "in" ? "delivered" : (m.status ?? "sent"), (m.extra?.error as string) ?? null, ago(m.min),
        ],
      );
    }
  }

  await q("insert into sample_requests (contact_id, wa_id, product_id, product_name, name, email, location, status) select id, wa_id, 'burano', 'Burano', 'Kavya Iyer', 'kavya@invites.co', '14 Anna Nagar, Chennai', 'new' from contacts where wa_id = '919876500003'");
  await q(
    `insert into templates (name, language, category, status, components) values
     ('festive_offer', 'en', 'MARKETING', 'APPROVED', $1::jsonb),
     ('order_update', 'en', 'UTILITY', 'APPROVED', $2::jsonb),
     ('new_catalogue', 'en', 'MARKETING', 'PENDING', $3::jsonb)`,
    [
      json([{ type: "BODY", text: "Hi {{1}}, our festive paper range is now in stock. Reply to see the latest options." }]),
      json([{ type: "BODY", text: "Hi {{1}}, your order {{2}} is ready for pickup." }]),
      json([{ type: "BODY", text: "Hi {{1}}, our new Favini catalogue is here." }]),
    ],
  );
}
