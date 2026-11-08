"use client";

import { useTranslations } from "next-intl";
import { useCart, type CartLine } from "@/components/cart-provider";

export function AddToCartButton({
  product,
}: {
  product: Omit<CartLine, "quantity">;
}) {
  const t = useTranslations("Products");
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="min-h-11 w-full rounded-full bg-ink px-4 py-3 text-sm text-cream transition hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
    >
      {t("addToCart")}
    </button>
  );
}
