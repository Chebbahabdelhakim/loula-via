import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ProductGridSkeleton, ProductSection } from "@/components/product-section";

export default async function HomePage() {
  const t = await getTranslations("Hero");
  const products = await getTranslations("Products");
  const banner = await getTranslations("Banner");

  return (
    <div>
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:py-24">
        <p className="animate-rise text-xs uppercase tracking-[0.35em] text-gold-dark">
          {t("eyebrow")}
        </p>
        <h1 className="animate-rise mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="animate-rise mt-5 max-w-xl text-base text-ink/75 sm:text-lg">
          {t("subtitle")}
        </p>
        <a
          href="#collection"
          className="animate-rise mt-8 rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-cream transition hover:bg-gold-dark"
        >
          {t("cta")}
        </a>
      </section>

      <p className="bg-ink px-4 py-3 text-center text-sm tracking-wide text-cream">
        {banner("delivery")}
      </p>

      <section id="collection" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl sm:text-4xl">{products("title")}</h2>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductSection />
        </Suspense>
      </section>
    </div>
  );
}
