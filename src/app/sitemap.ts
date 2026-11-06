import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/catalog";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const products = await getActiveProducts();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${base}/${locale}`,
      changeFrequency: "daily",
      priority: 1,
    });
    for (const product of products) {
      entries.push({
        url: `${base}/${locale}/produit/${product.id}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
