import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabase(): any {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getSupabase()[prop as any];
  },
});