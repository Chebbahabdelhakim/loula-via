import Image from "next/image";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CartButton } from "@/components/cart-button";
import { InstagramLink } from "@/components/instagram-link";
import { LocaleSwitcher } from "@/components/locale-switcher";

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="shrink-0" aria-label={t("home")}>
          <Image
            src="/logo.png"
            alt="LOULA VIA"
            width={1080}
            height={1080}
            priority
            className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
          />
        </Link>
        <div className="flex items-center gap-2">
          <InstagramLink
            label={t("instagram")}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gold/40 p-2 text-ink transition hover:border-gold hover:bg-ivory"
          />
          <Suspense fallback={<span className="h-11 w-16 rounded-full bg-gold/10" />}>
            <LocaleSwitcher />
          </Suspense>
          <Suspense fallback={<span className="h-11 w-11 rounded-full bg-gold/10" />}>
            <CartButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
