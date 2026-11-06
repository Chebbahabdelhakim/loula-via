import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Thanks } from "./thanks";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Thanks");
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const { n } = await searchParams;
  const t = await getTranslations("Thanks");
  const orderNumber = n && /^\d+$/.test(n) ? n : "";

  if (!orderNumber) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-4xl">{t("title")}</h1>
        <p className="mt-4 text-ink/70">{t("missing")}</p>
      </div>
    );
  }

  return <Thanks orderNumber={orderNumber} />;
}
