"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Thanks({ orderNumber }: { orderNumber: string }) {
  const t = useTranslations("Thanks");
  const [whatsappUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("loula-wa") ?? "";
  });

  useEffect(() => {
    if (!whatsappUrl) return;
    const timer = window.setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 900);
    return () => window.clearTimeout(timer);
  }, [whatsappUrl]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">LOULA VIA</p>
      <h1 className="mt-4 font-display text-4xl">{t("title")}</h1>
      <p className="mt-4 text-lg">
        {t("number")} <span className="font-medium">#{orderNumber}</span>
      </p>
      <p className="mt-3 text-ink/70">{t("body")}</p>
      <p className="mt-3 text-sm text-ink/70">{t("deliveryFeeConfirmed")}</p>
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm text-cream"
        >
          {t("whatsapp")}
        </a>
      ) : null}
      <Link href="/" className="mt-4 text-sm text-gold-dark">
        {t("home")}
      </Link>
    </div>
  );
}
