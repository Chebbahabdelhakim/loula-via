import type { Metadata } from "next";
import { cairo, inter, playfair } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Administration · LOULA VIA",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${playfair.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
