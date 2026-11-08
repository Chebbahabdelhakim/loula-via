import type { Metadata } from "next";
import { Suspense } from "react";
import { cairo, inter, playfair } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Administration · LOULA VIA",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${playfair.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">
        <Suspense fallback={<main className="mx-auto max-w-md px-4 py-16">Chargement…</main>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
