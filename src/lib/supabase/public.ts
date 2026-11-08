import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createPublicClient() {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) {
    throw new Error("Supabase URL ou clé publique manquante.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
