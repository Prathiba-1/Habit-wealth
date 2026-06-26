import { NextResponse } from "next/server";

export async function POST() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: rows } = await sb.from("conversations").select("role, content, created_at")
    .eq("user_id", user.id).order("created_at", { ascending: true }).limit(30);

  const messages = (rows ?? []).map((r) => ({ role: r.role, content: r.content, timestamp: r.created_at }));

  if (messages.length === 0) {
    const { data: prefs } = await sb.from("user_preferences").select("assistant_name, full_name").eq("user_id", user.id).single();
    const name     = prefs?.assistant_name ?? "Clara";
    const userName = prefs?.full_name?.split(" ")[0] ?? "";
    return NextResponse.json({
      messages: [{
        role: "assistant",
        content: `Hey${userName ? ` ${userName}` : ""}! I'm ${name}, your financial mentor. I've looked at your numbers and I'm ready to help. What do you want to explore?`,
        timestamp: new Date().toISOString(),
      }],
    });
  }

  return NextResponse.json({ messages });
}
