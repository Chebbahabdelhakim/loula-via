import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { InstagramLink } from "@/components/instagram-link";
import { site } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <footer className="mt-16 border-t border-gold/20 bg-ivory">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="LOULA VIA"
            width={1080}
            height={1080}
            className="h-24 w-24 rounded-full object-cover"
          />
        </Link>
        <p className="font-display text-xl">{t("tagline")}</p>
        <div className="flex items-center gap-4">
          <InstagramLink
            label={`${nav("instagram")} ${site.instagramHandle}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm transition hover:bg-cream"
          >
            {nav("instagram")}
          </InstagramLink>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm text-cream transition hover:bg-gold-dark"
            >
              {t("whatsapp")}
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-gold/30 px-4 py-2 text-sm text-ink/50">
              {t("whatsapp")}
            </span>
          )}
        </div>
        <p className="text-sm text-ink/60">
          © {site.name}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
