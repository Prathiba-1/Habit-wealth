import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { createClient } = await import("@supabase/supabase-js");
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { message, history = [] } = await req.json();

  const [{ data: profile }, { data: prefs }] = await Promise.all([
    sb.from("financial_profiles").select("*").eq("user_id", user.id).single(),
    sb.from("user_preferences").select("*").eq("user_id", user.id).single(),
  ]);

  const assistantName  = prefs?.assistant_name ?? "Clara";
  const totalExpenses  = profile
    ? Object.values(profile.expenses_json as Record<string, number>).reduce((a, b) => a + b, 0)
    : 0;
  const monthlySavings = profile ? profile.income_monthly - totalExpenses : 0;

  const systemPrompt = `You are ${assistantName}, an AI financial mentor inside the Habit Wealth app. Give concise, numbers-first advice in plain English. Never use bullet lists — write in short paragraphs. Always be specific to the user's actual numbers.

User profile:
- Monthly income: ₹${profile?.income_monthly ?? 0}
- Monthly expenses: ₹${totalExpenses} (${JSON.stringify(profile?.expenses_json ?? {})})
- Monthly savings: ₹${monthlySavings}
- Savings rate: ${profile?.income_monthly ? Math.round((monthlySavings / profile.income_monthly) * 100) : 0}%
- Emergency fund: ₹${profile?.emergency_fund ?? 0}
- Total debt: ₹${profile?.debt_amount ?? 0} at ${profile?.debt_interest_rate ?? 0}% p.a.
- Monthly budget cap: ₹${profile?.monthly_budget ?? 0}
- Savings target: ${profile?.savings_target_pct ?? 20}%
- Emergency fund target: ${profile?.emergency_fund_target_months ?? 6} months

Keep responses under 120 words unless asked for a detailed plan.`;

  // Persist user message
  await sb.from("conversations").insert({ user_id: user.id, role: "user", content: message });

  // Build Gemini chat history (exclude the latest message — sent separately)
  const chatHistory = history.map((m: { role: string; content: string }) => ({
    role:  m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const model = genAI.getGenerativeModel({
    model:          "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const chat = model.startChat({ history: chatHistory });

  const encoder = new TextEncoder();
  const stream  = new ReadableStream({
    async start(controller) {
      let fullContent = "";
      try {
        const result = await chat.sendMessageStream(message);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullContent += text;
            controller.enqueue(encoder.encode(`data: ${text}\n\n`));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));

        // Persist assistant reply
        await sb.from("conversations").insert({
          user_id: user.id,
          role:    "assistant",
          content: fullContent,
        });
      } catch (err) {
        controller.enqueue(encoder.encode(`data: Sorry, something went wrong.\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        console.error("Gemini stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
