"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale: Locale = locale === "fr" ? "ar" : "fr";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="min-h-11 rounded-full border border-gold/40 px-3 py-1.5 text-sm tracking-wide text-ink transition hover:border-gold hover:bg-ivory"
      aria-label={t("language")}
    >
      {t("switchTo")}
    </button>
  );
}
