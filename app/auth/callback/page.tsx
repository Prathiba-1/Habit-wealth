"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      const { getSupabase } = await import("@/lib/supabase");
      const sb = getSupabase();

      const { data: { session } } = await sb.auth.getSession();

      if (!session) {
        router.replace("/login?error=confirm_failed");
        return;
      }

      const { data: profile } = await sb
        .from("financial_profiles")
        .select("income_monthly")
        .eq("user_id", session.user.id)
        .single();

      if (!profile) {
        router.replace("/onboarding");
      } else {
        router.replace("/overview");
      }
    }

    handle();
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
        <p className="text-[13px] text-ink-2">Confirming your account…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}