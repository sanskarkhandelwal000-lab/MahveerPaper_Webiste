import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { catalogProducts } from "@/data/products";
import {
  buildCatalogPromptContext,
  buildKnowledgeBaseRules,
  filterByRequestedColor,
  filterCatalogByColor,
  pickFallbackProducts,
  resolveProductIds,
} from "@/lib/chatCatalog";
import { siteConfig } from "@/lib/config";
import { query, queryOne, json } from "./db";
import { sendOutbound, type InboundResult } from "./messages";
import { botEnabled } from "./settings";
import { CAROUSEL_LANG, carouselName, carouselReady } from "./carousel";

/**
 * The WhatsApp bot — a port of the Make.com scenario, using the same catalogue,
 * knowledge-base rules and Claude model as the website chatbot.
 *
 * Flow per inbound message:
 *   1. "STOP" / "START"   -> opt-out / opt-in (always, even if the bot is off)
 *   2. bot off / chat paused / needs a human -> do nothing
 *   3. asks for a person   -> flag "needs a human", pause the bot
 *   4. taps "Request Sample" -> start the in-chat sample form
 *   5. answers the sample form -> save the request
 *   6. anything else -> Claude recommends products, sends photo cards with a Request Sample button
 */

const replySchema = z.object({
  reply: z.string(),
  productIds: z.array(z.string()),
  options: z.array(z.string()),
  /** Everything the customer has told us so far; "" for anything still unknown. */
  brief: z.object({ application: z.string(), colour: z.string(), weight: z.string(), finish: z.string(), printing: z.string() }),
});
const MAX_QUESTIONS = 1; // never interrogate: at most one clarifying question, and only when nothing sensible can be recommended
const MODEL = "claude-haiku-4-5";

const STOP = /^\s*(stop|unsubscribe|opt[\s-]?out|cancel)\s*[.!]*\s*$/i;
const START = /^\s*(start|subscribe|opt[\s-]?in)\s*[.!]*\s*$/i;
const HUMAN = /\b(human|real person|talk to (a |an )?(someone|person|agent|human|team)|speak (to|with) (a |an )?(someone|person|agent|human|team|executive)|call me|customer (care|support)|representative)\b/i;

// Opening messages like "Hi", "hello there", "Namaste", "good morning" (emoji and punctuation ignored)
const GREETING = /^(h+i+|hello+|hey+|heya|hii+|hola|namaste|namaskar|pranam|yo|greetings|good\s*(morning|afternoon|evening|day)|gm)(\s+(there|team|sir|madam|mahaveer|mahaveer\s+papers|everyone))?$/i;
const isGreeting = (t: string) => GREETING.test(t.replace(/[^\p{L}\s]/gu, " ").replace(/\s+/g, " ").trim());

const image = (p: (typeof catalogProducts)[number]) => {
  const rel = p.image ?? Object.values(p.colorImages ?? {})[0];
  return rel ? `${siteConfig.url.replace(/\/$/, "")}${rel}` : undefined;
};

/** What we have learned about the customer's project so far ("" / missing = not known yet). */
interface Brief { application?: string; colour?: string; weight?: string; finish?: string; printing?: string }

interface BotState {
  brief?: Brief;
  /** Clarifying questions asked since the last recommendation. */
  asked?: number;
  /** Product ids already shown, so "more options" gives new ones. */
  shown?: string[];
  awaitingSample?: { sampleId: string; productName: string; attempts: number };
  lastHadProducts?: boolean;
}

async function state(conversationId: string): Promise<BotState> {
  const r = await queryOne<{ bot_state: BotState }>("select bot_state from conversations where id = $1", [conversationId]);
  return r?.bot_state ?? {};
}
const patchState = (id: string, patch: BotState) =>
  query("update conversations set bot_state = bot_state || $2::jsonb where id = $1", [id, json(patch)]);
const clearKey = (id: string, key: keyof BotState) => query("update conversations set bot_state = bot_state - $2 where id = $1", [id, key]);

const say = (conversationId: string, body: string) =>
  sendOutbound({ kind: "text", body }, { conversationId, senderType: "bot" });

export async function runBot(inbound: InboundResult): Promise<void> {
  // A tap on one of our quick-answer options is just the customer typing that answer.
  const m = inbound.buttonId?.startsWith("OPT::") ? { ...inbound, buttonId: null } : inbound;
  try {
    const text = m.text.trim();

    // 1. Consent commands work regardless of the bot switch (WhatsApp policy)
    if (!m.buttonId && STOP.test(text)) {
      await query("update contacts set opted_in = false, opted_in_at = null where id = $1", [m.contactId]);
      await say(m.conversationId, "You've been unsubscribed from promotional messages. You can still message us any time. Reply START to opt back in.");
      return;
    }
    if (!m.buttonId && START.test(text)) {
      await query("update contacts set opted_in = true, opted_in_at = coalesce(opted_in_at, now()) where id = $1", [m.contactId]);
      await say(m.conversationId, "Thanks — you're subscribed to updates from Mahaveer Papers. Reply STOP any time to opt out.");
      return;
    }

    // 2. Bot switched off, or a human has the chat
    if (m.botPaused || m.needsHuman || !(await botEnabled())) return;
    if (!text && !m.buttonId) return; // media, location, etc.: leave it for the team

    // 3. Asked for a person
    if (!m.buttonId && HUMAN.test(text)) {
      await query("update conversations set needs_human = true, bot_paused = true where id = $1", [m.conversationId]);
      await say(m.conversationId, "Of course — I've let our team know. Someone will reply here shortly (Mon–Sat, 10am–7pm).");
      return;
    }

    // 4. Request Sample button
    if (m.buttonId?.startsWith("SAMPLE::")) return startSample(m, m.buttonId.slice("SAMPLE::".length));

    // 4a. "Something else" at the very first question: explain what to tell us, in stages
    if (!m.buttonId && /^something else$/i.test(text) && !(await state(m.conversationId)).brief?.application) return askOpenEnded(m);

    // 4b. Details button on a product card
    if (m.buttonId?.startsWith("DETAIL::")) return sendDetails(m, m.buttonId.slice("DETAIL::".length));

    const st = await state(m.conversationId);

    // 4c. Someone opens the conversation with a greeting
    if (!m.buttonId && !st.awaitingSample && isGreeting(text)) return greet(m);

    // 5. Answering the sample form
    if (st.awaitingSample) {
      const handled = await handleSampleAnswer(m, st.awaitingSample, text);
      if (handled) return;
    }

    // 6. Product recommendations
    await recommend(m, text, st);
  } catch (e) {
    console.error("inbox bot error:", e);
    await say(m.conversationId, `Sorry, I'm having trouble right now — please try again in a moment, or reach us at ${siteConfig.url} or ${siteConfig.contact.whatsapp}.`).catch(() => undefined);
  }
}

// ---------- sample requests ----------

async function startSample(m: InboundResult, productId: string): Promise<void> {
  const p = catalogProducts.find((x) => x.id === productId);
  if (!p) return void (await say(m.conversationId, "Sorry, I couldn't find that product. Tell me what you're looking for and I'll suggest options."));
  // A new tap replaces any earlier unfinished request for this chat
  await query("delete from sample_requests where wa_id = $1 and status = 'awaiting'", [m.waId]);
  const rows = await query<{ id: string }>(
    "insert into sample_requests (contact_id, wa_id, product_id, product_name, status) values ($1,$2,$3,$4,'awaiting') returning id",
    [m.contactId, m.waId, p.id, p.name],
  );
  await patchState(m.conversationId, { awaitingSample: { sampleId: rows[0].id, productName: p.name, attempts: 0 } });
  await say(
    m.conversationId,
    `Great choice — ${p.name}! Just reply with your Name, Email and Delivery Address in one message, separated by commas, and I'll get your free sample on its way.\n\nExample: Riya Shah, riya@email.com, 12 MG Road, Bengaluru 560001`,
  );
}

/** Returns true if the message was consumed by the sample form. */
async function handleSampleAnswer(m: InboundResult, s: NonNullable<BotState["awaitingSample"]>, text: string): Promise<boolean> {
  const parts = text.split(",").map((x) => x.trim()).filter(Boolean);
  const emailPart = parts.find((x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
  if (!emailPart || parts.length < 3) {
    // Not an answer. Let one clearly-off-topic message through to normal chat; otherwise re-prompt.
    if (s.attempts >= 1) { await clearKey(m.conversationId, "awaitingSample"); return false; }
    await patchState(m.conversationId, { awaitingSample: { ...s, attempts: s.attempts + 1 } });
    await say(m.conversationId, "To send your sample I need your Name, Email and Delivery Address in one message, separated by commas — e.g. Riya Shah, riya@email.com, 12 MG Road, Bengaluru 560001.");
    return true;
  }
  const rest = parts.filter((x) => x !== emailPart);
  const name = rest[0];
  const location = rest.slice(1).join(", ");
  await query("update sample_requests set status = 'new', name = $2, email = $3, location = $4 where id = $1", [s.sampleId, name, emailPart, location]);
  await query(
    `update contacts set name = coalesce(name, $2), email = coalesce(email, $3), location = coalesce(location, $4), updated_at = now() where id = $1`,
    [m.contactId, name, emailPart, location],
  );
  await query(
    `insert into conversation_labels (conversation_id, label_id) select $1, id from labels where name = 'Sample request' on conflict do nothing`,
    [m.conversationId],
  );
  await clearKey(m.conversationId, "awaitingSample");
  await say(m.conversationId, `Thanks ${name}! We've got your sample request for ${s.productName} — our team will send it to ${location} and reach out at ${emailPart} shortly.`);
  return true;
}

// ---------- product cards ----------

/** A varied set for one application group: different paper families first, best-rated first. */
function groupPicks(covers: string[]): Array<(typeof catalogProducts)[number]> {
  const match = catalogProducts.filter((p) => p.applications?.some((a) => covers.includes(a)) && image(p));
  const ranked = [...match].sort((a, b) => (b.premiumRating ?? 0) - (a.premiumRating ?? 0));
  const out: typeof match = [];
  const books = new Set<string>();
  for (const p of ranked) if (!books.has(p.book)) { books.add(p.book); out.push(p); if (out.length === 4) return out; }
  for (const p of ranked) if (!out.includes(p)) { out.push(p); if (out.length === 4) break; }
  return out;
}

const oneLine = (t: string, max: number) => t.replace(/\s+/g, " ").trim().slice(0, max);

/** "Details" tap: full-size photo plus the key facts and a Request Sample button. */
async function sendDetails(m: InboundResult, productId: string): Promise<void> {
  const p = catalogProducts.find((x) => x.id === productId);
  if (!p) return void (await say(m.conversationId, "Sorry, I couldn't find that product. Tell me what you're looking for and I'll suggest options."));
  const lines = [
    `${p.name} — ${p.book}`,
    `Weight: ${p.gsm}`,
    p.sizes ? `Sizes: ${p.sizes}` : "",
    p.colors ? `${p.colors} colour${p.colors === 1 ? "" : "s"}${p.colorNames?.length ? `: ${p.colorNames.slice(0, 6).join(", ")}${p.colorNames.length > 6 ? "…" : ""}` : ""}` : "",
    p.finish ? `Finish: ${p.finish}` : "",
    p.bestFor ? `Best for: ${p.bestFor}` : "",
    p.description ? `\n${oneLine(p.description, 300)}` : "",
  ].filter(Boolean);
  await sendOutbound(
    { kind: "interactive", body: lines.join("\n").slice(0, 1024), buttons: [{ id: `SAMPLE::${p.id}`, title: "Request Sample" }], imageLink: image(p) },
    { conversationId: m.conversationId, senderType: "bot" },
  );
}

/** Sends products as a scrolling carousel when an approved template fits; otherwise one card each. */
async function sendProducts(conversationId: string, products: Array<(typeof catalogProducts)[number]>): Promise<void> {
  const shown = products.slice(0, 4);
  const withImage = shown.filter((p) => image(p));
  if (withImage.length >= 2 && (await carouselReady(withImage.length))) {
    const sent = await sendOutbound(
      {
        kind: "carousel",
        templateName: carouselName(withImage.length),
        language: CAROUSEL_LANG,
        summary: `Product carousel: ${withImage.map((p) => p.name).join(", ")}`,
        cards: withImage.map((p) => ({
          imageLink: image(p) as string,
          params: [oneLine(`${p.name} (${p.book}, ${p.gsm})`, 70)],
          detailsPayload: `DETAIL::${p.id}`,
          samplePayload: `SAMPLE::${p.id}`,
        })),
      },
      { conversationId, senderType: "bot" },
    );
    if (sent.status !== "failed") return;
  }
  for (const p of shown) {
    await sendOutbound(
      { kind: "interactive", body: `${p.name} — ${p.book} · ${p.gsm}`.slice(0, 1024), buttons: [{ id: `SAMPLE::${p.id}`, title: "Request Sample" }], imageLink: image(p) },
      { conversationId, senderType: "bot" },
    );
  }
}

// ---------- greeting ----------

/** The 25 catalogue applications, grouped into a menu that fits WhatsApp's 10-row list. */
const APPLICATION_GROUPS: Array<{ title: string; covers: string[] }> = [
  { title: "Wedding & Invitations", covers: ["Wedding & Invitation Cards", "Wedding Invitation Overlays"] },
  { title: "Luxury & Rigid Boxes", covers: ["Luxury Packaging", "Premium Boxes", "Rigid Boxes", "Rigid Box Wrapping", "Sustainable Luxury Packaging"] },
  { title: "Cartons & Packaging", covers: ["Folding Cartons", "Commercial Packaging", "Sustainable Packaging"] },
  { title: "Brochures & Printing", covers: ["Premium Brochures", "Premium Printing", "General Printing"] },
  { title: "Stationery", covers: ["Stationery"] },
  { title: "Book Covers & Binding", covers: ["Book Covers & Binding"] },
  { title: "Labels & Tags", covers: ["Premium Product Labels", "Durable Tags", "Exhibition Badges"] },
  { title: "Art & Watercolour", covers: ["Watercolour", "Professional Watercolour", "Acrylic", "Gouache", "Tempera"] },
  { title: "Displays & Coasters", covers: ["Displays", "Coasters"] },
];
const OTHER = "Something else";

function timeGreeting(): string {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

async function askOpenEnded(m: InboundResult): Promise<void> {
  await say(
    m.conversationId,
    "No problem — just tell me in your own words what you're making (a menu card, gift box, notebook cover, label, sketchbook…). " +
      "Add the colour, thickness or how it will be printed if you know, and I'll suggest the best papers right away.",
  );
  await patchState(m.conversationId, { brief: {}, asked: 0, shown: [] });
}

async function greet(m: InboundResult): Promise<void> {
  await sendChoices(
    m.conversationId,
    `${timeGreeting()}! 👋 Welcome to Mahaveer Papers — premium imported papers and boards.\n\nWhat will you be using the paper for? Pick the closest match and I'll show you the best options right away.`,
    [...APPLICATION_GROUPS.map((g) => g.title), OTHER],
  );
  // Fresh conversation: forget any earlier project
  await patchState(m.conversationId, { brief: {}, asked: 0, shown: [] });
}

// ---------- tap-to-answer choices ----------

const cleanOptions = (raw: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const o of raw) {
    const t = o.replace(/\s+/g, " ").trim();
    if (t && t.length <= 24 && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); out.push(t); }
  }
  return out.slice(0, 10);
};

/** Up to 3 choices -> tap buttons; 4-10 -> a list menu. Falls back to plain text if WhatsApp refuses. */
async function sendChoices(conversationId: string, body: string, options: string[]): Promise<void> {
  const opts = { conversationId, senderType: "bot" as const };
  const max = options.length <= 3 ? 20 : 24; // WhatsApp: button titles 20 chars, list rows 24
  const choices = options.map((title, i) => ({ id: `OPT::${i}`, title: title.slice(0, max) }));
  const text = body.slice(0, 1024);
  const sent = choices.length <= 3
    ? await sendOutbound({ kind: "interactive", body: text, buttons: choices }, opts)
    : await sendOutbound({ kind: "list", body: text, buttonLabel: "Choose one", rows: choices }, opts);
  if (sent.status === "failed") await say(conversationId, `${body}\n\n${options.join(" / ")}`);
}

// ---------- recommendations ----------

const SAMPLE_WORD = /\bsamples?\b/i;

function systemPrompt(catalogText: string, ctx: { asked: number; brief: Brief; shown: string[]; mustRecommend: boolean }): string {
  const known = Object.entries(ctx.brief).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("; ") || "nothing yet";
  const groups = APPLICATION_GROUPS.map((g) => `- "${g.title}" = ${g.covers.join(", ")}`).join("\n");
  return `${ctx.mustRecommend ? `IMPORTANT — READ FIRST: do NOT ask any question this turn (options must be empty). This reply MUST recommend 1-4 products (productIds non-empty) using everything the customer has told you, choosing sensible defaults and saying briefly what you assumed. If their wish cannot be met exactly (for example a colour we do not stock), say so in a few words and recommend the closest real alternatives instead.\n\n` : ""}You are the paper consultant for Mahaveer Papers, a premium imported paper and boards store (Bengaluru & Ahmedabad), chatting with a customer over WhatsApp.

Work like a good shop expert: first understand the customer's project properly, THEN recommend. Do not throw random products at people.

Catalogue (id | book | name | gsm | colours | type | application | description):
${catalogText}

Mahaveer's own internal knowledge-base policy for this catalogue (treat these as binding facts about what is and isn't true of the range):
${buildKnowledgeBaseRules()}

The customer's first-question menu groups the catalogue applications like this:
${groups}

What we know about their project so far: ${known}.
Clarifying questions already asked: ${ctx.asked}.
Products already shown to this customer: ${ctx.shown.length ? ctx.shown.join(", ") : "none"}.

Your priority is to be genuinely useful FAST. Customers on WhatsApp are impatient, and every extra question costs you the customer. Think like an expert shop assistant who reads the situation, not a form.
- Default: recommend on the first turn where you have ANY usable signal — an application (including a menu choice such as "Luxury & Rigid Boxes"), a use, a colour, a material, an occasion. Do not ask for weight, finish or printing method up front. Infer sensible specs from your expertise (for example wedding invitation cards usually want 250-350 GSM ivory, white or textured board; rigid box wrapping wants a rich wrapping paper; brochures want smooth printable stock), choose defaults, and say what you assumed in a few words.
- When you only know the application, show a VARIED set (different looks, weights and finishes) so the customer can react, and end your reply with one short line inviting them to tell you colour, thickness or budget if they want it narrowed.
- Ask a clarifying question ONLY when you truly cannot recommend anything sensible (for example "I need paper", "something nice", "what do you have"). Ask at most ONE question in the whole conversation: one short question with tap-to-answer "options" (2-10 items, each at most 20 characters, plain text, no emoji). Never ask a second one — after any answer, recommend.
- Once products have been shown, do not ask clarifying questions at all (other than the "Different colour" case below): answer what they said directly — price and bulk questions get the quote instructions, product questions get a direct answer — or refine the recommendation.
- If the customer refines ("darker", "thicker", "in red", "cheaper", "more options"), combine it with everything said earlier, recommend again, and prefer products NOT already shown unless they ask about those.
- If they say "Different colour" without naming one, ask which colour with options that the catalogue genuinely offers for their application. That counts as your one question.
- When a wish cannot be met exactly (a colour or finish the catalogue does not have), say so plainly in a few words and recommend the closest real alternatives — never answer with a question.
- "Not sure" or "any" is a valid answer: choose sensible defaults and say so.
- Reply in the same language and style as the customer (English, Hindi or Hinglish).
- Keep memory: fill "brief" with everything known so far (application, colour, weight, finish, printing), using "" for anything unknown, and carry earlier answers forward.

Rules:
- Only recommend products from the catalogue above. Never invent a product, id, GSM, colour count, or price.
- The "colours" number is only a COUNT of how many colour options that product line has — it does not tell you which colours those are. Only claim a product is a specific colour (e.g. "white", "black") if that colour word literally appears in its name or description above. Never say a product "comes in" a colour that isn't stated.
- When the customer names a colour, only recommend products whose name or description matches that colour, or are explicitly colour-neutral/uncoloured stock. If nothing in the catalogue matches the requested colour, say so plainly instead of substituting a mismatched product.
- Whenever your reply names one or more specific products, include every named product's id in productIds so its photo card can be sent. Never mention a product by name without also including its id.
- When you recommend, do NOT end with a question and leave "options" empty — the customer gets tap buttons to refine automatically.
- When you do recommend, pick the most relevant 1-4 products, most relevant first, and explain in 1-2 sentences why they fit THEIR project (mention the details they gave you).
- Keep replies short and conversational — 1-3 sentences, no bullet lists, no markdown, no asterisks or bold text, plain prose only. Product photo cards with the name, book and GSM are sent automatically right after your reply, so don't re-list specs.
- If asked about pricing or bulk orders, tell them to request a quote at ${siteConfig.url}/contact or email ${siteConfig.contact.emails[0]} — you don't have pricing data.
- If asked for a sample, reply warmly in 1 short sentence and recommend the product(s) that fit — every product card has a "Request Sample" button they can tap, after which the chat collects their details. Never ask for their details yourself and never point them to a website form.
- If asked anything that isn't about finding a paper/board product — general chit-chat, jokes, personal questions, other companies, news, coding help, or any other topic — do not engage with it at all, even briefly. In one short sentence, decline and pivot straight back to what they are making.
- Always respond with the required JSON shape.`;
}

async function recommend(m: InboundResult, text: string, st: BotState): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  // recent conversation as context (text only)
  const hist = await query<{ direction: "in" | "out"; body: string | null }>(
    `select direction, body from messages where conversation_id = $1 and type in ('text','interactive') and body is not null
       and sender_type in ('customer','bot') order by created_at desc limit 10`,
    [m.conversationId],
  );
  const turns: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const h of hist.reverse()) {
    const role = h.direction === "in" ? "user" : "assistant";
    const last = turns[turns.length - 1];
    if (last?.role === role) last.content += `\n${h.body}`;
    else turns.push({ role, content: h.body as string });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") turns.push({ role: "user", content: text });

  const brief = st.brief ?? {};
  const asked = st.asked ?? 0;
  const requestText = `${text} ${brief.colour ?? ""}`;
  let candidates = filterCatalogByColor(requestText);
  const chosen = APPLICATION_GROUPS.find((g) => g.title.toLowerCase() === text.toLowerCase());
  if (chosen) {
    const narrowed = candidates.filter((p) => p.applications?.some((a) => chosen.covers.includes(a)));
    if (narrowed.length >= 3) candidates = narrowed;
  }
  // Questions are a last resort: never after a menu tap, and never a second one.
  const menuChoice = !!chosen;
  const askingColour = /^different colou?r$/i.test(text);
  const mustRecommendNow = !askingColour && (menuChoice || asked >= MAX_QUESTIONS);
  const client = new Anthropic({ apiKey });
  const res = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 700,
    system: systemPrompt(buildCatalogPromptContext(candidates), { asked, brief, mustRecommend: mustRecommendNow, shown: (st.shown ?? []).map((id) => catalogProducts.find((p) => p.id === id)?.name ?? id) }),
    messages: turns,
    output_format: betaZodOutputFormat(replySchema),
  });
  if (!res.parsed_output) throw new Error("Claude returned no parsed output");

  let { reply } = res.parsed_output;
  let products = filterByRequestedColor(resolveProductIds(res.parsed_output.productIds), requestText);
  if (mustRecommendNow && products.length === 0) {
    const group = APPLICATION_GROUPS.find((g) => g.title.toLowerCase() === text.toLowerCase());
    const byApp = group ? groupPicks(group.covers) : [];
    const fb = byApp.length ? byApp : pickFallbackProducts(candidates, turns.filter((t) => t.role === "user").map((t) => t.content).join(" "));
    if (fb.length) {
      products = fb;
      reply = group
        ? `Here are some of our best picks for ${group.title.toLowerCase()} — tell me a colour, thickness or budget and I'll narrow it down.`
        : "Here are a few options that could work well for that — let me know if you'd like something more specific.";
    }
  }
  if (SAMPLE_WORD.test(text) && products.length === 0) {
    reply = "Happy to help with a sample — tell me what you're looking for (colour, use, or paper type) and I'll show you options you can request a sample of.";
  }

  const options = cleanOptions(res.parsed_output.options);
  if (products.length === 0 && options.length >= 2 && !SAMPLE_WORD.test(text)) {
    await sendChoices(m.conversationId, reply, options);
  } else {
    await say(m.conversationId, reply);
  }
  // A price / delivery answer about products already on screen doesn't need the cards again
  const alreadyShown = products.length > 0 && products.every((p) => st.shown?.includes(p.id));
  if (alreadyShown && /\b(price|cost|rate|quote|bulk|moq|minimum|delivery|shipping|gst|payment)\b/i.test(text)) products = [];
  await sendProducts(m.conversationId, products);
  const merged: Brief = { ...brief };
  for (const [k, v] of Object.entries(res.parsed_output.brief)) if (v.trim()) merged[k as keyof Brief] = v.trim();
  await patchState(m.conversationId, {
    brief: merged,
    asked: products.length ? 0 : asked + 1,
    shown: [...(st.shown ?? []), ...products.slice(0, 4).map((p) => p.id)].slice(-16),
    lastHadProducts: products.length > 0,
  });
  // One tap to refine, instead of making the customer type
  if (products.length) await sendChoices(m.conversationId, "Want me to narrow these down?", ["More options", "Different colour", "Talk to a person"]);
}
