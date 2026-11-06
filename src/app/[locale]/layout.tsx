import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getDeliveryFees } from "@/lib/catalog";
import { routing } from "@/i18n/routing";
import { cairo, inter, playfair } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: {
      default: t("title"),
      template: "%s · LOULA VIA",
    },
    description: t("description"),
    applicationName: "LOULA VIA",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    openGraph: {
      type: "website",
      siteName: "LOULA VIA",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/logo.png", alt: "LOULA VIA" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/logo.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const fees = await getDeliveryFees();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${playfair.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <NextIntlClientProvider>
          <CartProvider fees={fees}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
