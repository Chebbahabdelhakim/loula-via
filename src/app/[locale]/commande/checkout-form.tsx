"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { placeOrder, type OrderErrorCode } from "@/app/actions/place-order";
import { useCart } from "@/components/cart-provider";
import { formatDa } from "@/lib/money";
import { checkoutSchema } from "@/lib/validation";

export function CheckoutForm() {
  const t = useTranslations("Checkout");
  const errors = useTranslations("Errors");
  const locale = useLocale() as "fr" | "ar";
  const router = useRouter();
  const cart = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  if (!cart.ready) {
    return <p className="text-ink/60">{t("loading")}</p>;
  }

  if (cart.items.length === 0) {
    return <p className="rounded-card bg-ivory px-6 py-12 text-center">{t("empty")}</p>;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const payload = {
      customerName: name,
      phone,
      wilayaCode: cart.wilayaCode ?? 0,
      address,
      locale,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const path = parsed.error.issues[0]?.path[0];
      const code: OrderErrorCode =
        path === "phone"
          ? "phone"
          : path === "customerName"
            ? "name"
            : path === "address"
              ? "address"
              : path === "wilayaCode"
                ? "wilaya"
                : "invalid";
      setMessage(errors(code));
      return;
    }

    setPending(true);
    const result = await placeOrder(parsed.data);
    setPending(false);
    if (!result.ok) {
      setMessage(errors(result.code));
      return;
    }

    if (result.whatsappUrl) sessionStorage.setItem("loula-wa", result.whatsappUrl);
    cart.clear();
    router.push(`/merci?n=${result.orderNumber}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 rounded-card bg-ivory p-5">
        <label className="block text-sm" htmlFor="name">
          {t("name")}
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
          />
        </label>
        <label className="block text-sm" htmlFor="phone">
          {t("phone")}
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="05XXXXXXXX"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
          />
        </label>
        <label className="block text-sm" htmlFor="wilaya">
          {t("wilaya")}
          <select
            id="wilaya"
            required
            value={cart.wilayaCode ?? ""}
            onChange={(event) =>
              cart.setWilayaCode(event.target.value ? Number(event.target.value) : null)
            }
            className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
          >
            <option value="">{t("chooseWilaya")}</option>
            {cart.fees.map((fee) => (
              <option key={fee.code} value={fee.code}>
                {fee.code.toString().padStart(2, "0")} — {fee.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm" htmlFor="address">
          {t("address")}
          <textarea
            id="address"
            name="address"
            autoComplete="street-address"
            required
            rows={3}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
          />
        </label>
        <p className="rounded-card bg-cream px-3 py-3 text-sm">{t("payment")}</p>
        {message ? <p className="text-sm text-red-800">{message}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-ink py-3 text-sm text-cream transition hover:bg-gold-dark disabled:opacity-60"
        >
          {pending ? t("pending") : t("submit")}
        </button>
      </div>
      <aside className="h-fit rounded-card border border-gold/20 bg-ivory p-5">
        <h2 className="font-display text-2xl">{t("summary")}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {locale === "ar" ? item.nameAr : item.nameFr} × {item.quantity}
              </span>
              <span>{formatDa(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-gold/20 pt-3 text-sm">
          <p className="flex justify-between">
            <span>{t("delivery")}</span>
            <span>{cart.deliveryFee === null ? "—" : formatDa(cart.deliveryFee)}</span>
          </p>
          <p className="flex justify-between text-base font-medium">
            <span>{t("total")}</span>
            <span>{formatDa(cart.total)}</span>
          </p>
        </div>
      </aside>
    </form>
  );
}
