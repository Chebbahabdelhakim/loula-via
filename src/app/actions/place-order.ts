"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";
import { checkoutSchema } from "@/lib/validation";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { getWilaya } from "@/lib/wilayas";

export type OrderErrorCode =
  | "invalid"
  | "phone"
  | "name"
  | "address"
  | "wilaya"
  | "empty"
  | "product"
  | "save"
  | "whatsapp";

export type PlaceOrderResult =
  | { ok: true; orderNumber: number; whatsappUrl: string }
  | { ok: false; code: OrderErrorCode };

function errorCode(path: PropertyKey | undefined): OrderErrorCode {
  if (path === "phone") return "phone";
  if (path === "customerName") return "name";
  if (path === "address") return "address";
  if (path === "wilayaCode") return "wilaya";
  if (path === "items") return "empty";
  return "invalid";
}

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  try {
    return await placeOrderInner(input);
  } catch {
    return { ok: false, code: "save" };
  }
}

async function placeOrderInner(input: unknown): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, code: errorCode(parsed.error.issues[0]?.path[0]) };
  }

  const { customerName, phone, wilayaCode, address, locale, items } = parsed.data;
  const merged = new Map<string, number>();
  for (const item of items) {
    merged.set(item.productId, Math.min(20, (merged.get(item.productId) ?? 0) + item.quantity));
  }
  const uniqueItems = [...merged.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
  const admin = createAdminClient();
  const ids = uniqueItems.map((item) => item.productId);

  const [{ data: products, error: productError }, settingsResult] =
    await Promise.all([
      admin
        .from("products")
        .select("id, name_fr, name_ar, price, active")
        .in("id", ids),
      admin.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
    ]);

  if (productError || !products) {
    return { ok: false, code: "save" };
  }
  const selectedWilaya = getWilaya(wilayaCode);
  if (!selectedWilaya) return { ok: false, code: "wilaya" };

  const byId = new Map((products as Pick<Product, "id" | "name_fr" | "name_ar" | "price" | "active">[]).map((product) => [product.id, product]));
  const lines = [];

  for (const item of uniqueItems) {
    const product = byId.get(item.productId);
    if (!product || !product.active) return { ok: false, code: "product" };
    const name = locale === "ar" ? product.name_ar || product.name_fr : product.name_fr;
    lines.push({
      productId: product.id,
      name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    });
  }

  const deliveryFee = 0;
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const wilaya = `${String(selectedWilaya.code).padStart(2, "0")} - ${selectedWilaya.nameFr}`;
  const wilayaLabel = locale === "ar" ? selectedWilaya.nameAr : selectedWilaya.nameFr;

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_name: customerName,
      phone,
      wilaya,
      address,
      delivery_fee: deliveryFee,
      total,
      status: "nouvelle",
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) return { ok: false, code: "save" };

  const { error: itemsError } = await admin.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      product_id: line.productId,
      product_name: line.name,
      unit_price: line.unitPrice,
      quantity: line.quantity,
    })),
  );

  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return { ok: false, code: "save" };
  }

  const configured = (settingsResult.data?.value as string | undefined)?.replace(/\D/g, "");
  const number = configured || (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (!number) {
    return { ok: true, orderNumber: order.order_number, whatsappUrl: "" };
  }

  const whatsappUrl = whatsappLink(
    number,
    buildOrderMessage({
      orderNumber: order.order_number,
      customerName,
      phone,
      wilaya: wilayaLabel,
      address,
      lines: lines.map((line) => ({
        name: line.name,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
      })),
      total,
      locale,
    }),
  );

  return { ok: true, orderNumber: order.order_number, whatsappUrl };
}
