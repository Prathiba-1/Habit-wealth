"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setError(null);
    setLoading(true);

    if (USE_MOCK) {
      router.push("/overview");
      return;
    }

    const { getSupabase } = await import("@/lib/supabase");
    const sb = getSupabase();

    const { data, error: signInError } = await sb.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Sign in failed.");
      setLoading(false);
      return;
    }

    // Check if user has completed onboarding
    const { data: profile } = await sb
      .from("financial_profiles")
      .select("income_monthly")
      .eq("user_id", data.user.id)
      .single();

    if (!profile) {
      router.push("/onboarding");
    } else {
      router.push("/overview");
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <div className="text-center">
        <div className="font-mono text-teal text-[13px] tracking-widest uppercase mb-1">
          habit wealth
        </div>
        <h1 className="text-[22px] font-medium text-ink-0">Welcome back</h1>
        <p className="text-[13px] text-ink-2 mt-1">Sign in to your account</p>
      </div>

      <div className="bg-bg-1/90 backdrop-blur border border-[var(--border)] rounded-lg p-6 flex flex-col gap-4">
        {error && (
          <div className="bg-red/10 border border-red/20 rounded-md px-3 py-2 text-[12px] text-red">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-ink-2">Email</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="you@example.com"
            className="bg-bg-2 border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-ink-0 outline-none placeholder:text-ink-2 focus:border-teal transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-ink-2">Password</label>
            <Link href="/forgot-password" className="text-[11px] text-ink-2 hover:text-teal transition-colors">
              Forgot password?
            </Link>
          </div>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
            className="bg-bg-2 border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-ink-0 outline-none placeholder:text-ink-2 focus:border-teal transition-colors" />
        </div>

        <button onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="mt-1 w-full bg-teal text-black text-[13px] font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>

      <p className="text-center text-[12px] text-ink-2">
        No account?{" "}
        <Link href="/signup" className="text-teal hover:opacity-80 transition-opacity">Create one</Link>
      </p>
    </div>
  );
}
