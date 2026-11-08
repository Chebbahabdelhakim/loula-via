import { redirect } from "next/navigation";
import { ProductManager } from "./product-manager";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import type { Product } from "@/lib/types";

export default async function ProductsPage() {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) redirect("/admin/login?erreur=config");

  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id, name_fr, name_ar, price, image_url, description_fr, description_ar, active, created_at")
    .order("created_at", { ascending: false });

  return <ProductManager products={(data ?? []) as Product[]} />;
}
