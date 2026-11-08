import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function createSupabaseServer() {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) {
    throw new Error("Supabase URL ou clé publique manquante.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Le proxy se charge de rafraîchir la session.
        }
      },
    },
  });
}
