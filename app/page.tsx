"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const { getSupabase } = await import("@/lib/supabase");
      const { data: { session } } = await getSupabase().auth.getSession();
      if (session) {
        router.replace("/overview");
      } else {
        router.replace("/login");
      }
    }
    check();
  }, [router]);

  // Blank while checking — no flash
  return null;
}