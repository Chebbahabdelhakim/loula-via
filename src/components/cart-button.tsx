"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatDa } from "@/lib/money";
import { useCart } from "@/components/cart-provider";
import { getWilayaName, WILAYAS } from "@/lib/wilayas";

export function CartButton() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const cart = useCart();
  const count = cart.ready
    ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  useEffect(() => {
    if (!cart.open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [cart.open]);

  const drawer = (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-ink/30"
        onClick={() => cart.setOpen(false)}
      />
      <aside className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-ivory shadow-xl">
        <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
          <h2 className="font-display text-2xl">{t("title")}</h2>
          <button
            type="button"
            onClick={() => cart.setOpen(false)}
            className="min-h-11 min-w-11 rounded-full px-3 py-2 text-sm text-ink/70 transition hover:bg-cream"
          >
            {t("close")}
          </button>
        </div>

        {cart.items.length === 0 ? (
          <p className="px-5 py-12 text-center text-ink/70">{t("empty")}</p>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {cart.items.map((item) => {
                const name = locale === "ar" ? item.nameAr : item.nameFr;
                return (
                  <li key={item.productId} className="flex gap-3 border-b border-gold/15 pb-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{name}</p>
                      <p className="mt-1 text-sm text-gold-dark">{formatDa(item.price)}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={t("decrease")}
                          onClick={() => cart.setQuantity(item.productId, item.quantity - 1)}
                              className="h-11 w-11 rounded-full border border-gold/40"
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={t("increase")}
                          onClick={() => cart.setQuantity(item.productId, item.quantity + 1)}
                              className="h-11 w-11 rounded-full border border-gold/40"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => cart.removeItem(item.productId)}
                          className="ms-auto text-sm text-ink/60 underline"
                        >
                          {t("remove")}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-3 border-t border-gold/20 px-5 py-4">
              <label className="block text-sm" htmlFor="cart-wilaya">
                {t("wilaya")}
              </label>
              <select
                id="cart-wilaya"
                dir={locale === "ar" ? "rtl" : "ltr"}
                required
                value={cart.wilayaCode ?? ""}
                onChange={(event) =>
                  cart.setWilayaCode(event.target.value ? Number(event.target.value) : null)
                }
                className="min-h-11 w-full max-w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
              >
                <option value="" disabled>{t("chooseWilaya")}</option>
                {WILAYAS.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.code}>
                    {getWilayaName(wilaya, locale)}
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-base font-medium">
                <span>{t("total")}</span>
                <span>{formatDa(cart.total)}</span>
              </div>
              <p className="text-sm text-ink/70">{t("deliveryFeeConfirmed")}</p>
              <Link
                href="/commande"
                onClick={() => cart.setOpen(false)}
                className="block rounded-full bg-ink py-3 text-center text-sm text-cream transition hover:bg-gold-dark"
              >
                {t("checkout")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => cart.setOpen(true)}
        aria-label={t("title")}
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gold/40 p-2 text-ink transition hover:border-gold hover:bg-ivory"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
          <path d="M6 7h12l-1 12H7L6 7z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 7a3 3 0 0 1 6 0" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {cart.ready && count > 0 ? (
          <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] text-ink">
            {count}
          </span>
        ) : null}
      </button>

      {cart.open ? createPortal(drawer, document.body) : null}
    </>
  );
}
