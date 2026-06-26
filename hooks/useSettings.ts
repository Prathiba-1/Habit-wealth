"use client";

import { useState, useEffect } from "react";
import { mockProfile } from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export interface ProfileSettings {
  full_name: string;
  email: string;
  income_monthly: number;
  monthly_budget: number;
  savings_target_pct: number;
  emergency_fund_target_months: number;
  debt_amount: number;
  debt_interest_rate: number;
  currency: string;
  assistant_name: string;
}

const MOCK_DEFAULTS: ProfileSettings = {
  full_name:                    "Arjun Sharma",
  email:                        "arjun@example.com",
  income_monthly:               mockProfile.income_monthly,
  monthly_budget:               mockProfile.monthly_budget,
  savings_target_pct:           20,
  emergency_fund_target_months: 6,
  debt_amount:                  mockProfile.debt_amount,
  debt_interest_rate:           mockProfile.debt_interest_rate,
  currency:                     "INR",
  assistant_name:               "Clara",
};

// ─── mock version ─────────────────────────────────────────────────────────────

function useMockSettings() {
  const [settings, setSettings] = useState<ProfileSettings>(MOCK_DEFAULTS);
  function updateSettings(patch: Partial<ProfileSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }
  return { settings, updateSettings, loading: false };
}

// ─── supabase version ─────────────────────────────────────────────────────────

function useSupabaseSettings() {
  const [settings, setSettings] = useState<ProfileSettings>(MOCK_DEFAULTS);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const { getSupabase } = await import("@/lib/supabase");
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: profile }, { data: prefs }] = await Promise.all([
        sb.from("financial_profiles").select("*").eq("user_id", user.id).single(),
        sb.from("user_preferences").select("*").eq("user_id", user.id).single(),
      ]);

      setSettings({
        full_name:                    prefs?.full_name                     ?? "",
        email:                        user.email                           ?? "",
        income_monthly:               profile?.income_monthly              ?? 0,
        monthly_budget:               profile?.monthly_budget              ?? 20000,
        savings_target_pct:           profile?.savings_target_pct          ?? 20,
        emergency_fund_target_months: profile?.emergency_fund_target_months ?? 6,
        debt_amount:                  profile?.debt_amount                  ?? 0,
        debt_interest_rate:           profile?.debt_interest_rate           ?? 0,
        currency:                     prefs?.currency                       ?? "INR",
        assistant_name:               prefs?.assistant_name                 ?? "Clara",
      });
      setLoading(false);
    }
    load();
  }, []);

  async function updateSettings(patch: Partial<ProfileSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));

    const { getSupabase } = await import("@/lib/supabase");
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const profilePatch: Record<string, unknown> = {};
    const prefsPatch:   Record<string, unknown> = {};

    if (patch.income_monthly               !== undefined) profilePatch.income_monthly               = patch.income_monthly;
    if (patch.monthly_budget               !== undefined) profilePatch.monthly_budget               = patch.monthly_budget;
    if (patch.savings_target_pct           !== undefined) profilePatch.savings_target_pct           = patch.savings_target_pct;
    if (patch.emergency_fund_target_months !== undefined) profilePatch.emergency_fund_target_months = patch.emergency_fund_target_months;
    if (patch.debt_amount                  !== undefined) profilePatch.debt_amount                  = patch.debt_amount;
    if (patch.debt_interest_rate           !== undefined) profilePatch.debt_interest_rate           = patch.debt_interest_rate;
    if (patch.full_name                    !== undefined) prefsPatch.full_name                      = patch.full_name;
    if (patch.assistant_name               !== undefined) prefsPatch.assistant_name                 = patch.assistant_name;
    if (patch.currency                     !== undefined) prefsPatch.currency                       = patch.currency;

    const ops: Promise<unknown>[] = [];

    if (Object.keys(profilePatch).length > 0)
      ops.push(sb.from("financial_profiles").update({ ...profilePatch, updated_at: new Date().toISOString() }).eq("user_id", user.id));

    if (Object.keys(prefsPatch).length > 0)
      ops.push(sb.from("user_preferences").update({ ...prefsPatch, updated_at: new Date().toISOString() }).eq("user_id", user.id));

    if (patch.email && patch.email !== "")
      ops.push(sb.auth.updateUser({ email: patch.email }));

    await Promise.all(ops);
  }

  return { settings, updateSettings, loading };
}

// ─── public API ──────────────────────────────────────────────────────────────

export function useSettings() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (USE_MOCK) return useMockSettings();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSupabaseSettings();
}
