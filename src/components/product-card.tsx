import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/add-to-cart";
import { formatDa } from "@/lib/money";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  locale,
  priority = false,
}: {
  product: Product;
  locale: string;
  priority?: boolean;
}) {
  const name = locale === "ar" ? product.name_ar : product.name_fr;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-gold/15 bg-ivory">
      <Link href={`/produit/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-cream">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Image
                src="/logo.png"
                alt=""
                width={160}
                height={160}
                className="h-20 w-20 rounded-full object-cover opacity-80"
              />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="font-display text-lg leading-snug sm:text-xl">
            <Link href={`/produit/${product.id}`}>{name}</Link>
          </h3>
          <p className="mt-1 text-sm text-gold-dark">{formatDa(product.price)}</p>
        </div>
        <div className="mt-auto">
          <AddToCartButton
            product={{
              productId: product.id,
              nameFr: product.name_fr,
              nameAr: product.name_ar,
              price: product.price,
              imageUrl: product.image_url,
            }}
          />
        </div>
      </div>
    </article>
  );
}
