"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { feesSchema, productSchema } from "@/lib/validation";

async function adminClient() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) return null;
  return supabase;
}

export async function signOut() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveProduct(input: unknown) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Vérifiez le formulaire." };

  const supabase = await adminClient();
  if (!supabase) return { ok: false as const, message: "Connexion requise." };

  const payload = {
    name_fr: parsed.data.nameFr,
    name_ar: parsed.data.nameAr,
    price: parsed.data.price,
    description_fr: parsed.data.descriptionFr || null,
    description_ar: parsed.data.descriptionAr || null,
    image_url: parsed.data.imageUrl || null,
    active: parsed.data.active,
  };

  const query = parsed.data.id
    ? supabase.from("products").update(payload).eq("id", parsed.data.id)
    : supabase.from("products").insert(payload);

  const { error } = await query;
  if (error) {
    return {
      ok: false as const,
      message: "Enregistrement refusé. Ce compte doit être dans la table admins.",
    };
  }

  updateTag("products");
  return { ok: true as const };
}

export async function deleteProduct(id: string) {
  const supabase = await adminClient();
  if (!supabase) return { ok: false as const, message: "Connexion requise." };

  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false as const, message: "Suppression impossible." };

  const imageUrl = product?.image_url as string | null | undefined;
  const marker = "/storage/v1/object/public/products/";
  if (imageUrl?.includes(marker)) {
    const path = decodeURIComponent(imageUrl.slice(imageUrl.indexOf(marker) + marker.length));
    await supabase.storage.from("products").remove([path]);
  }

  updateTag("products");
  return { ok: true as const };
}

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return;

  const supabase = await adminClient();
  if (!supabase) redirect("/admin/login");

  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/commandes");
}

export async function saveSettings(input: { whatsapp: string; fees: unknown }) {
  const fees = feesSchema.safeParse(input.fees);
  if (!fees.success) return { ok: false as const, message: "Frais invalides." };

  const whatsapp = input.whatsapp.replace(/\D/g, "");
  if (whatsapp && !/^213\d{8,10}$/.test(whatsapp)) {
    return {
      ok: false as const,
      message: "Numéro WhatsApp en format international, sans + (exemple : 213779293290).",
    };
  }

  const supabase = await adminClient();
  if (!supabase) return { ok: false as const, message: "Connexion requise." };

  const { error: settingsError } = await supabase
    .from("site_settings")
    .update({ value: whatsapp, updated_at: new Date().toISOString() })
    .eq("key", "whatsapp_number");

  if (settingsError) return { ok: false as const, message: "Réglages non enregistrés." };

  for (const fee of fees.data) {
    const { error } = await supabase
      .from("delivery_fees")
      .update({ fee: fee.fee })
      .eq("code", fee.code);
    if (error) return { ok: false as const, message: "Frais non enregistrés." };
  }

  updateTag("delivery-fees");
  return { ok: true as const };
}
