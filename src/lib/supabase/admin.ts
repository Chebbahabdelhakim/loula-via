import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleEnv } from "@/lib/supabase/env";

export function createAdminClient() {
  const { url, key } = getSupabaseServiceRoleEnv();
  if (!url || !key) {
    throw new Error("Clé secrète Supabase manquante.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
