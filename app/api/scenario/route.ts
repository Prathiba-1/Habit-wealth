import { NextRequest, NextResponse } from "next/server";
import { runScenario } from "@/lib/finance-calc";
import type { ScenarioType } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { type, value } = await req.json() as { type: ScenarioType; value: number };

  const { data: profile } = await sb
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Pure maths — no AI needed here
  return NextResponse.json(runScenario(profile, type, value));
}
