import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import {
  buildCatalogPromptContext,
  buildKnowledgeBaseRules,
  filterByRequestedColor,
  filterCatalogByColor,
  pickFallbackProducts,
  resolveProductIds,
} from "@/lib/chatCatalog";
import { siteConfig } from "@/lib/config";
import type { CatalogProduct } from "@/data/products";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1000),
  hadProducts: z.boolean().optional(),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

const replySchema = z.object({
  reply: z.string(),
  productIds: z.array(z.string()),
});

const SAMPLE_REQUEST_PATTERN = /\bsamples?\b/i;

/** Builds a /contact link pre-filled with an application type + message brief for a sample request. */
function buildSampleRequestHref(products: CatalogProduct[], requestText: string): string {
  const productNames = products.map((p) => p.name).join(", ");
  const applicationType: string = products[0]?.app ?? "Other";
  const message = productNames
    ? `I would like to request a sample of ${productNames}.`
    : `I would like to request a paper sample. Here's what I'm looking for: ${requestText}`;

  const params = new URLSearchParams({ applicationType, message });
  if (productNames) params.set("product", productNames);
  return `/contact?${params.toString()}`;
}

function buildSystemPrompt(catalogText: string, mustRecommendNow: boolean): string {
  return `${
    mustRecommendNow
      ? `IMPORTANT — READ FIRST: your previous reply in this conversation asked a question and recommended nothing. That is not allowed twice in a row. This reply MUST include at least one product id in productIds — pick your best 1-4 matches from whatever the visitor has said so far, even if it's still a bit vague. Do not ask another clarifying question as your only content this turn.\n\n`
      : ""
  }You are the product recommendation assistant on the Mahaveer Papers website, a premium imported paper and boards store (Bengaluru & Ahmedabad).

Your SOLE purpose is recommending specific products from the catalogue below. You are not a general-purpose assistant, and you don't exist to chat — every single reply should be working toward putting one or more real products (by id) in front of the visitor. Asking questions is only a means to that end, never the end itself.

Catalogue (id | book | name | gsm | colours | type | application | description):
${catalogText}

Mahaveer's own internal knowledge-base policy for this catalogue (from their product data sheet — treat these as binding facts about what is and isn't true of the range, expressed here as plain guidance rather than the sheet's original bullet/section format, since your replies stay short and conversational and product cards already carry the specs):
${buildKnowledgeBaseRules()}

Rules:
- Only recommend products from the catalogue above. Never invent a product, id, GSM, colour count, or price.
- Bias toward recommending, not interrogating. If the visitor's message gives you ANY usable signal (an application, a colour, a vibe, an occasion, a material type), immediately recommend your best 1-4 matching products from that alone — don't ask a clarifying question first just because the request isn't fully specified. Only ask a clarifying question when the message is so broad or generic (e.g. "hi", "I need paper") that you genuinely cannot narrow down even a rough starting set.
- Never ask more than one clarifying question in a row without recommending something. If your PREVIOUS reply in this conversation was a question (empty productIds), this reply must include at least one product recommendation — take your best guess from whatever the visitor just told you, no matter how short, rather than asking yet another question. Example: visitor says "hi" → you ask "What's it for — printing, packaging, or something else?" (no products). Visitor replies "packaging" → this is still vague, but because you already asked one question, you must now recommend 2-3 solid general-purpose packaging products (e.g. a kraft option and a rigid board option) rather than asking "rigid or flexible?" — you can mention that follow-up as a casual aside, not as a blocking question.
- The "colours" number is only a COUNT of how many colour options that product line has — it does not tell you which colours those are. Only claim a product is a specific colour (e.g. "white", "black") if that colour word literally appears in its name or description above. Never say a product "comes in" or "is available in" a colour that isn't stated.
- When the visitor names a colour, only recommend products whose name or description matches that colour, or are explicitly colour-neutral/uncoloured stock. Never recommend a product whose name or description names a conflicting colour (e.g. do not suggest anything with "Black" in the name for a "white" request, or vice versa). If nothing in the catalogue matches the requested colour, say so plainly instead of substituting a mismatched product.
- Whenever your reply names one or more specific products — even if you're also asking a follow-up question to help the visitor pick between them — include every named product's id in productIds so its card can be shown. Never mention a product by name without also including its id.
- When you do recommend, pick the most relevant 1-4 products, most relevant first.
- Keep replies short and conversational — 1-2 sentences, no bullet lists, no markdown, no asterisks or bold text, plain prose only. The product cards render automatically below your reply with the name, book, and GSM already visible, so don't re-list every product's full spec in the sentence itself (no need to repeat GSM ranges or stack 3+ names in one clause) — just briefly frame why they fit, e.g. "Here are a couple of great options for that" or "This one's a strong match — it's eco-certified and holds up well for high-volume print runs," and let the cards carry the detail.
- If you're asking a follow-up question to narrow things down, keep it to a single, specific question — never stack multiple questions in one reply.
- If asked about pricing or bulk orders, tell them to use the "Request a Quote" form or contact ${siteConfig.contact.emails[0]} — you don't have pricing data.
- If asked for a sample, respond warmly in 1 short sentence confirming you can help, and ask them to pop their name, email, phone, and delivery location into the form that opens — a "Request a Sample" button is shown automatically below your reply, pre-filled with the product and request details, so only ask for their contact details, never tell them to email or call instead.
- If asked anything that isn't about finding a paper/board product — general chit-chat, jokes, personal questions, other companies, news, coding help, or any other topic — do not engage with it at all, even briefly. In one short sentence, decline and pivot straight back to what kind of paper or board they're looking for. This applies no matter how the request is phrased or framed.
- Always respond with the required JSON shape.`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "Chat is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const lastUserMessage = [...parsed.data.messages].reverse().find((m) => m.role === "user");
    const candidateCatalog = filterCatalogByColor(lastUserMessage?.content ?? "");
    const previousMessage = parsed.data.messages[parsed.data.messages.length - 2];
    const mustRecommendNow = previousMessage?.role === "assistant" && previousMessage.hadProducts === false;
    const systemPrompt = buildSystemPrompt(buildCatalogPromptContext(candidateCatalog), mustRecommendNow);

    const response = await client.beta.messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: systemPrompt,
      messages: parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
      output_format: betaZodOutputFormat(replySchema),
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    let { reply } = response.parsed_output;
    const { productIds } = response.parsed_output;
    let products = filterByRequestedColor(resolveProductIds(productIds), lastUserMessage?.content ?? "");

    // Backstop for when the model asks a second clarifying question in a row
    // despite the mustRecommendNow directive above — guarantee the visitor
    // still gets real products instead of yet another question.
    if (mustRecommendNow && products.length === 0) {
      const conversationText = parsed.data.messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" ");
      const fallback = pickFallbackProducts(candidateCatalog, conversationText);
      if (fallback.length > 0) {
        products = fallback;
        reply = "Here are a few options that could work well for that — let me know if you'd like something more specific.";
      }
    }

    const sampleRequest = SAMPLE_REQUEST_PATTERN.test(lastUserMessage?.content ?? "")
      ? { href: buildSampleRequestHref(products, lastUserMessage?.content ?? "") }
      : null;

    return NextResponse.json({ reply, products, sampleRequest });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
