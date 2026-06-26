"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function SignupPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  async function handleSubmit() {
    if (!name || !email || !password || mismatch) return;
    setError(null);
    setLoading(true);

    if (USE_MOCK) {
      setSent(true);
      setLoading(false);
      return;
    }

    const { getSupabase } = await import("@/lib/supabase");
    const sb = getSupabase();

    const { data, error: signUpError } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // After clicking the email link, Supabase redirects here
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Seed empty rows immediately — user exists even before confirming
    if (data.user) {
      const userId = data.user.id;
      await Promise.all([
        sb.from("financial_profiles").upsert({
          user_id: userId, income_monthly: 0, expenses_json: {},
          savings_amount: 0, emergency_fund: 0, debt_amount: 0,
          debt_interest_rate: 0, monthly_budget: 0,
          savings_target_pct: 20, emergency_fund_target_months: 6,
        }, { onConflict: "user_id" }),
        sb.from("user_preferences").upsert({
          user_id: userId, full_name: name, assistant_name: "Clara", currency: "INR",
        }, { onConflict: "user_id" }),
      ]);
    }

    setSent(true);
    setLoading(false);
  }

  // ── check your email screen ───────────────────────────────────────────────
  if (sent) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 text-center">
        <div>
          <div className="font-mono text-teal text-[13px] tracking-widest uppercase mb-1">
            habit wealth
          </div>
        </div>

        <div className="bg-bg-1/90 backdrop-blur border border-[var(--border)] rounded-lg p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-ghost border border-teal/20 flex items-center justify-center">
            <Mail size={20} className="text-teal" />
          </div>
          <div>
            <h2 className="text-[16px] font-medium text-ink-0">Check your inbox</h2>
            <p className="text-[12px] text-ink-2 mt-1.5 leading-relaxed">
              We sent a confirmation link to <span className="text-ink-1 font-medium">{email}</span>.
              Click it to activate your account and set up your financial profile.
            </p>
          </div>
          <div className="w-full border-t border-[var(--border)] pt-4 text-[11px] text-ink-2">
            Didn't get it? Check spam or{" "}
            <button
              onClick={() => { setSent(false); }}
              className="text-teal hover:opacity-80 transition-opacity"
            >
              try again
            </button>
          </div>
        </div>

        {USE_MOCK && (
          <Link
            href="/onboarding"
            className="text-[12px] text-teal hover:opacity-80 transition-opacity"
          >
            (Mock) Skip to onboarding →
          </Link>
        )}
      </div>
    );
  }

  // ── signup form ───────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <div className="text-center">
        <div className="font-mono text-teal text-[13px] tracking-widest uppercase mb-1">
          habit wealth
        </div>
        <h1 className="text-[22px] font-medium text-ink-0">Create account</h1>
        <p className="text-[13px] text-ink-2 mt-1">Start building wealthy habits</p>
      </div>

      <div className="bg-bg-1/90 backdrop-blur border border-[var(--border)] rounded-lg p-6 flex flex-col gap-4">
        {error && (
          <div className="bg-red/10 border border-red/20 rounded-md px-3 py-2 text-[12px] text-red">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-ink-2">Full name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Arjun Sharma"
            className="bg-bg-2 border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-ink-0 outline-none placeholder:text-ink-2 focus:border-teal transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-ink-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-bg-2 border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-ink-0 outline-none placeholder:text-ink-2 focus:border-teal transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-ink-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-bg-2 border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-ink-0 outline-none placeholder:text-ink-2 focus:border-teal transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-ink-2">Confirm password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className={`bg-bg-2 border rounded-md px-3 py-2 text-[13px] text-ink-0 outline-none placeholder:text-ink-2 transition-colors ${mismatch ? "border-red" : "border-[var(--border)] focus:border-teal"}`} />
          {mismatch && <p className="text-[11px] text-red">Passwords don't match</p>}
        </div>

        <button onClick={handleSubmit}
          disabled={loading || mismatch || !name || !email || !password}
          className="mt-1 w-full bg-teal text-black text-[13px] font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </div>

      <p className="text-center text-[12px] text-ink-2">
        Already have an account?{" "}
        <Link href="/login" className="text-teal hover:opacity-80 transition-opacity">Sign in</Link>
      </p>
    </div>
  );
}
