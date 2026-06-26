import { NextResponse } from "next/server";

export async function POST() {
  const { createClient } = await import("@supabase/supabase-js");
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const [{ data: profile }, { data: goals }] = await Promise.all([
    sb.from("financial_profiles").select("*").eq("user_id", user.id).single(),
    sb.from("goals").select("*").eq("user_id", user.id).order("priority"),
  ]);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const totalExpenses  = Object.values(profile.expenses_json as Record<string, number>).reduce((a, b) => a + b, 0);
  const monthlySavings = profile.income_monthly - totalExpenses;

  const prompt = `You are a financial health assessor. Return ONLY a valid JSON object — no markdown, no code fences, no explanation, just raw JSON.

Financial data:
- Monthly income: ₹${profile.income_monthly}
- Monthly expenses: ₹${totalExpenses} (${JSON.stringify(profile.expenses_json)})
- Monthly savings: ₹${monthlySavings}
- Emergency fund: ₹${profile.emergency_fund} (target: ${profile.emergency_fund_target_months} months)
- Debt: ₹${profile.debt_amount} at ${profile.debt_interest_rate}% p.a.
- Goals: ${JSON.stringify(goals ?? [])}

Return exactly this JSON shape:
{
  "health_score": <integer 0-100>,
  "score_delta": <integer, positive or negative>,
  "strengths": [
    { "title": "<short title>", "desc": "<one sentence>" },
    { "title": "<short title>", "desc": "<one sentence>" }
  ],
  "risks": [
    { "title": "<short title>", "desc": "<one sentence>", "severity": "high" },
    { "title": "<short title>", "desc": "<one sentence>", "severity": "medium" }
  ],
  "top_action": { "title": "<short title>", "desc": "<one specific sentence with a number>" }
}`;

  try {
    const model    = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result   = await model.generateContent(prompt);
    const text     = result.response.text().replace(/```json|```/g, "").trim();
    const parsed   = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Assess error:", err);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}
