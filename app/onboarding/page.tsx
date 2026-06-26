"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ─── types ────────────────────────────────────────────────────────────────────

interface OnboardingData {
  full_name:                    string;
  income_monthly:               string;
  monthly_budget:               string;
  savings_target_pct:           string;
  emergency_fund_target_months: string;
  current_savings:              string;
  debt_amount:                  string;
  debt_interest_rate:           string;
}

const EMPTY: OnboardingData = {
  full_name:                    "",
  income_monthly:               "",
  monthly_budget:               "",
  savings_target_pct:           "20",
  emergency_fund_target_months: "6",
  current_savings:              "",
  debt_amount:                  "",
  debt_interest_rate:           "",
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, prefix, suffix, placeholder, hint, type = "number",
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; placeholder?: string; hint?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-ink-2 font-medium uppercase tracking-wide">{label}</label>
      <div className="flex items-center bg-bg-2 border border-[var(--border)] rounded-md overflow-hidden focus-within:border-teal transition-colors">
        {prefix && (
          <span className="px-3 text-[13px] text-ink-2 border-r border-[var(--border)] font-mono py-2.5">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2.5 text-[13px] text-ink-0 font-mono outline-none placeholder:text-ink-2 placeholder:font-sans"
        />
        {suffix && (
          <span className="px-3 text-[13px] text-ink-2 border-l border-[var(--border)] font-mono py-2.5">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-ink-2">{hint}</p>}
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-5 h-1.5 bg-teal"
              : i < current
              ? "w-1.5 h-1.5 bg-teal/40"
              : "w-1.5 h-1.5 bg-bg-3"
          }`}
        />
      ))}
    </div>
  );
}

// ─── steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title:    "Welcome! What's your name?",
    subtitle: "Let's personalise your experience",
    fields:   ["full_name"],
  },
  {
    title:    "Your income",
    subtitle: "Used to calculate your savings rate and budget",
    fields:   ["income_monthly", "monthly_budget"],
  },
  {
    title:    "Savings goals",
    subtitle: "We'll track your progress automatically",
    fields:   ["savings_target_pct", "current_savings"],
  },
  {
    title:    "Safety net",
    subtitle: "How many months of expenses do you want saved?",
    fields:   ["emergency_fund_target_months"],
  },
  {
    title:    "Any debt? (optional)",
    subtitle: "Skip if you have none — just leave blank",
    fields:   ["debt_amount", "debt_interest_rate"],
  },
];

// ─── page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router  = useRouter();
  const [step,    setStep]    = useState(0);
  const [data,    setData]    = useState<OnboardingData>(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Pre-fill name from Supabase user metadata if available
  useEffect(() => {
    if (USE_MOCK) return;
    (async () => {
      const { getSupabase } = await import("@/lib/supabase");
      const { data: { user } } = await getSupabase().auth.getUser();
      if (user?.user_metadata?.full_name) {
        setData((d) => ({ ...d, full_name: user.user_metadata.full_name }));
      }

      // If profile already has income set, user has already onboarded — go to overview
      const { data: profile } = await getSupabase()
        .from("financial_profiles")
        .select("income_monthly")
        .single();
      if (profile?.income_monthly > 0) {
        router.replace("/overview");
      }
    })();
  }, [router]);

  function update(key: keyof OnboardingData, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function canAdvance(): boolean {
    const s = STEPS[step];
    return s.fields.every((f) => {
      // Optional fields on last step
      if (step === 4) return true;
      const val = data[f as keyof OnboardingData];
      return val.trim().length > 0;
    });
  }

  async function handleFinish() {
    setSaving(true);
    setError(null);

    if (USE_MOCK) {
      router.push("/overview");
      return;
    }

    try {
      const { getSupabase } = await import("@/lib/supabase");
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const num = (v: string, fallback = 0) => parseFloat(v) || fallback;

      await Promise.all([
        sb.from("financial_profiles").upsert({
          user_id:                      user.id,
          income_monthly:               num(data.income_monthly),
          monthly_budget:               num(data.monthly_budget),
          savings_target_pct:           num(data.savings_target_pct, 20),
          emergency_fund_target_months: num(data.emergency_fund_target_months, 6),
          savings_amount:               num(data.current_savings),
          emergency_fund:               num(data.current_savings),
          debt_amount:                  num(data.debt_amount),
          debt_interest_rate:           num(data.debt_interest_rate),
          expenses_json:                {},
          updated_at:                   new Date().toISOString(),
        }, { onConflict: "user_id" }),

        sb.from("user_preferences").upsert({
          user_id:        user.id,
          full_name:      data.full_name,
          assistant_name: "Clara",
          currency:       "INR",
          updated_at:     new Date().toISOString(),
        }, { onConflict: "user_id" }),
      ]);

      router.push("/overview");
    } catch (err) {
      setError("Something went wrong saving your profile — please try again.");
      console.error(err);
      setSaving(false);
    }
  }

  const isLast  = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="w-full max-w-md flex flex-col">
      {/* Wordmark */}
      <div className="text-center mb-6">
        <div className="font-mono text-teal text-[13px] tracking-widest uppercase">
          habit wealth
        </div>
      </div>

      {/* Card */}
      <div className="bg-bg-1/90 backdrop-blur border border-[var(--border)] rounded-xl p-7">
        <StepDots total={STEPS.length} current={step} />

        <div className="mb-6">
          <h2 className="text-[18px] font-medium text-ink-0">{current.title}</h2>
          <p className="text-[12px] text-ink-2 mt-1">{current.subtitle}</p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {current.fields.includes("full_name") && (
            <Field label="Full name" type="text" value={data.full_name}
              onChange={(v) => update("full_name", v)} placeholder="Arjun Sharma" />
          )}
          {current.fields.includes("income_monthly") && (
            <Field label="Monthly income" value={data.income_monthly}
              onChange={(v) => update("income_monthly", v)}
              prefix="₹" placeholder="92000"
              hint="Your take-home pay after tax" />
          )}
          {current.fields.includes("monthly_budget") && (
            <Field label="Monthly spending budget" value={data.monthly_budget}
              onChange={(v) => update("monthly_budget", v)}
              prefix="₹" placeholder="60000"
              hint="Max you want to spend on living expenses" />
          )}
          {current.fields.includes("savings_target_pct") && (
            <Field label="Savings target" value={data.savings_target_pct}
              onChange={(v) => update("savings_target_pct", v)}
              suffix="% of income" placeholder="20"
              hint="20% is a solid starting point" />
          )}
          {current.fields.includes("current_savings") && (
            <Field label="Current savings" value={data.current_savings}
              onChange={(v) => update("current_savings", v)}
              prefix="₹" placeholder="150000"
              hint="Total across all accounts right now" />
          )}
          {current.fields.includes("emergency_fund_target_months") && (
            <Field label="Target coverage" value={data.emergency_fund_target_months}
              onChange={(v) => update("emergency_fund_target_months", v)}
              suffix="months" placeholder="6"
              hint="3–6 months recommended. 6+ if self-employed." />
          )}
          {current.fields.includes("debt_amount") && (
            <Field label="Total outstanding debt" value={data.debt_amount}
              onChange={(v) => update("debt_amount", v)}
              prefix="₹" placeholder="0 (leave blank if none)" />
          )}
          {current.fields.includes("debt_interest_rate") && (
            <Field label="Average interest rate" value={data.debt_interest_rate}
              onChange={(v) => update("debt_interest_rate", v)}
              suffix="% p.a." placeholder="0" />
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red/10 border border-red/20 rounded-md px-3 py-2 text-[12px] text-red">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-[12px] text-ink-2 hover:text-ink-0 transition-colors px-3 py-2 rounded-md hover:bg-bg-3"
            >
              <ChevronLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {isLast ? (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex items-center gap-1.5 bg-teal text-black text-[13px] font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {saving ? "Saving…" : (<><Check size={14} /> Finish setup</>)}
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="flex items-center gap-1.5 bg-teal text-black text-[13px] font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Skip link for returning users */}
      <p className="text-center text-[11px] text-ink-2/60 mt-4">
        Already set up?{" "}
        <button onClick={() => router.push("/overview")} className="text-teal/70 hover:text-teal transition-colors">
          Go to dashboard
        </button>
      </p>
    </div>
  );
}
