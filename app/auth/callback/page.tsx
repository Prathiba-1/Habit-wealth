"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// This page receives the email confirmation redirect.
// The browser already has the session set via the URL fragment (#access_token)
// from Supabase — we just need to detect it and redirect appropriately.
export default function AuthCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handle() {
      const { getSupabase } = await import("@/lib/supabase");
      const sb = getSupabase();

      // Supabase automatically reads the fragment token and sets the session
      const { data: { session } } = await sb.auth.getSession();

      if (!session) {
        // No session — something went wrong
        router.replace("/login?error=confirm_failed");
        return;
      }

      // Check if this user has completed onboarding
      const { data: profile } = await sb
        .from("financial_profiles")
        .select("income_monthly")
        .eq("user_id", session.user.id)
        .single();

      if (!profile || profile.income_monthly === 0) {
        router.replace("/onboarding");
      } else {
        router.replace("/overview");
      }
    }

    handle();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
        <p className="text-[13px] text-ink-2">Confirming your account…</p>
      </div>
    </div>
  );
}
