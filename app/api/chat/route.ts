import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface IncomingMessage {
  role: "user" | "assistant" | "system" | "error";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ZAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ZAI_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  const baseUrl = (process.env.ZAI_BASE_URL || "https://api.z.ai/api/paas/v4").replace(/\/+$/, "");
  const model = process.env.ZAI_MODEL || "glm-4.6";

  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];

  // Only forward user/assistant turns, drop any error bubbles from the UI.
  const messages = incoming
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a helpful, concise assistant running in a hackathon demo chatbot.",
          },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg =
        data?.error?.message || data?.message || `z.ai API error (${upstream.status})`;
      return NextResponse.json({ error: msg }, { status: upstream.status });
    }

    const reply: string | undefined = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "No reply returned from z.ai API.", raw: data },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to reach z.ai API." },
      { status: 500 }
    );
  }
}
