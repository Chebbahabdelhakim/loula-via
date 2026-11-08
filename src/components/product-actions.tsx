"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart, type CartLine } from "@/components/cart-provider";

export function ProductActions({
  product,
}: {
  product: Omit<CartLine, "quantity">;
}) {
  const t = useTranslations("Product");
  const products = useTranslations("Products");
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <div className="mt-8 flex max-w-sm flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          addItem(product, { open: false });
          router.push("/commande");
        }}
        className="min-h-11 rounded-full bg-ink px-4 py-3 text-sm text-cream transition hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
      >
        {t("buyNow")}
      </button>
      <button
        type="button"
        onClick={() => addItem(product)}
        className="min-h-11 rounded-full border border-ink/20 bg-ivory px-4 py-3 text-sm transition hover:border-gold-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
      >
        {products("addToCart")}
      </button>
      <ul className="mt-1 space-y-1 text-sm text-ink/80">
        <li>{t("payOnDelivery")}</li>
        <li>{t("deliveryAlgeria")}</li>
      </ul>
    </div>
  );
}
