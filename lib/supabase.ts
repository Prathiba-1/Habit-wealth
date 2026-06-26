// Lazy browser client — only instantiated when USE_MOCK=false
// Safe to import anywhere including client components

let _client: ReturnType<typeof import("@supabase/supabase-js").createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    const { createClient } = require("@supabase/supabase-js");
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client!;
}

// Convenience alias used in hooks
export const supabase = new Proxy({} as ReturnType<typeof import("@supabase/supabase-js").createClient>, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  }
});
