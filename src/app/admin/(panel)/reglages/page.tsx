import { SettingsForm } from "./settings-form";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { DeliveryFee } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createSupabaseServer();
  const [{ data: fees }, { data: settings }] = await Promise.all([
    supabase.from("delivery_fees").select("code, name, fee").order("code", { ascending: true }),
    supabase.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
  ]);

  return (
    <section>
      <h1 className="font-display text-3xl">Réglages</h1>
      <div className="mt-6">
        <SettingsForm fees={(fees ?? []) as DeliveryFee[]} whatsapp={(settings?.value as string | undefined) ?? ""} />
      </div>
    </section>
  );
}
