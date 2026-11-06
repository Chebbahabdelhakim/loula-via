import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { createSupabaseServer } from "@/lib/supabase/server";

const links = [
  { href: "/admin", label: "Tableau" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/reglages", label: "Réglages" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-full">
      <header className="border-b border-gold/20 bg-ivory">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl">LOULA VIA</p>
            <p className="text-xs text-ink/60">{user.email}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-gold/30 px-3 py-2 text-sm"
              >
                {link.label}
              </Link>
            ))}
            <form action={signOut}>
              <button type="submit" className="rounded-full bg-ink px-3 py-2 text-sm text-cream">
                Déconnexion
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
    </div>
  );
}
