import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { AddToCartButton } from "@/components/add-to-cart";
import { Link } from "@/i18n/navigation";
import { getProduct } from "@/lib/catalog";
import { formatDa } from "@/lib/money";
import { whatsappLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "LOULA VIA" };
  const locale = await getLocale();
  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const description =
    (locale === "ar" ? product.description_ar : product.description_fr) || name;

  return {
    title: name,
    description,
    openGraph: {
      title: `${name} · LOULA VIA`,
      description,
      images: product.image_url ? [{ url: product.image_url, alt: name }] : [{ url: "/logo.png", alt: "LOULA VIA" }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const locale = await getLocale();
  const t = await getTranslations("Product");
  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const description = locale === "ar" ? product.description_ar : product.description_fr;
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappUrl = number
    ? whatsappLink(
        number,
        `Bonjour, je souhaite commander : ${name} — ${formatDa(product.price)}. LOULA VIA`,
      )
    : "";

  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:py-12 lg:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ivory">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/logo.png"
              alt=""
              width={240}
              height={240}
              className="h-40 w-40 rounded-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <Link href="/" className="text-sm text-gold-dark">
          {t("back")}
        </Link>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{name}</h1>
        <p className="mt-4 text-lg text-gold-dark">{formatDa(product.price)}</p>
        {description ? (
          <p className="mt-6 max-w-prose leading-relaxed text-ink/80">{description}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
          <AddToCartButton
            product={{
              productId: product.id,
              nameFr: product.name_fr,
              nameAr: product.name_ar,
              price: product.price,
              imageUrl: product.image_url,
            }}
          />
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gold px-4 py-3 text-center text-sm transition hover:bg-ivory"
            >
              {t("whatsapp")}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
