import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "./checkout-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Checkout");
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage() {
  const t = await getTranslations("Checkout");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">{t("title")}</h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
