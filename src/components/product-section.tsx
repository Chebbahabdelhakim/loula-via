import { getLocale, getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product-card";
import { getActiveProducts } from "@/lib/catalog";

export async function ProductSection() {
  const [products, t, locale] = await Promise.all([
    getActiveProducts(),
    getTranslations("Products"),
    getLocale(),
  ]);

  if (products.length === 0) {
    return (
      <p className="mt-8 rounded-card border border-gold/20 bg-ivory px-6 py-16 text-center text-ink/70">
        {t("empty")}
      </p>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} locale={locale} priority={index < 2} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="animate-pulse overflow-hidden rounded-card bg-ivory">
          <div className="aspect-[4/5] bg-gold/10" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 rounded bg-gold/15" />
            <div className="h-10 rounded-full bg-gold/10" />
          </div>
        </li>
      ))}
    </ul>
  );
}
