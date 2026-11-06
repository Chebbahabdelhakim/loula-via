import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { DeliveryFee, Product } from "@/lib/types";

export async function getActiveProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name_fr, name_ar, price, image_url, description_fr, description_ar, active, created_at",
      )
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  "use cache";
  cacheTag("products", `product-${id}`);
  cacheLife("minutes");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name_fr, name_ar, price, image_url, description_fr, description_ar, active, created_at",
      )
      .eq("id", id)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;
    return data as Product;
  } catch {
    return null;
  }
}

export async function getDeliveryFees(): Promise<DeliveryFee[]> {
  "use cache";
  cacheTag("delivery-fees");
  cacheLife("minutes");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("delivery_fees")
      .select("code, name, fee")
      .order("code", { ascending: true });

    if (error || !data) return [];
    return data as DeliveryFee[];
  } catch {
    return [];
  }
}
