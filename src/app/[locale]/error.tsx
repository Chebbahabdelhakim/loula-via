"use client";

import { useTranslations } from "next-intl";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-3xl">{t("generic")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm text-cream"
      >
        {t("retry")}
      </button>
    </div>
  );
}
