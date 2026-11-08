import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createSupabaseBrowser() {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) {
    throw new Error("Supabase URL ou clé publique manquante.");
  }

  return createBrowserClient(url, key);
}
