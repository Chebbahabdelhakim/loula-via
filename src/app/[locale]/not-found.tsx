import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Errors");
  const nav = await getTranslations("Nav");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-5xl text-gold">404</p>
      <p className="mt-4 text-ink/75">{t("notFound")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-5 py-2.5 text-sm text-cream"
      >
        {nav("home")}
      </Link>
    </div>
  );
}
