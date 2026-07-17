import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { buildCatalogPromptContext, resolveProductIds } from "@/lib/chatCatalog";
import { siteConfig } from "@/lib/config";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1000),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

const replySchema = z.object({
  reply: z.string(),
  productIds: z.array(z.string()),
});

const SYSTEM_PROMPT = `You are the product recommendation assistant on the Mahaveer Papers website, a premium imported paper and boards store (Bangalore & Ahmedabad).

Your only job is to help visitors find the right paper or board from our catalogue below, and to recommend specific products by id when you have enough information.

Catalogue (id | book | name | gsm | colours | type | application | description):
${buildCatalogPromptContext()}

Rules:
- Only recommend products from the catalogue above. Never invent a product, id, GSM, colour count, or price.
- If the request is ambiguous (e.g. no colour, application, or weight given), ask ONE short clarifying question instead of guessing, and leave productIds empty.
- When you do recommend, pick the most relevant 1-4 products, most relevant first.
- Keep replies short and warm — 1-3 sentences, no bullet lists, no markdown.
- If asked about pricing, bulk orders, or samples, tell them to use the "Request a Quote" form or contact ${siteConfig.contact.emails[0]} — you don't have pricing data.
- If asked something unrelated to paper/products (e.g. general chit-chat, other companies), politely redirect to how you can help with paper selection.
- Always respond with the required JSON shape.`;

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

    const response = await client.beta.messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
      output_format: betaZodOutputFormat(replySchema),
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    const { reply, productIds } = response.parsed_output;
    const products = resolveProductIds(productIds);

    return NextResponse.json({ reply, products });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
