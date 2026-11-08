import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { formatDa } from "@/lib/money";

function algiersStamp(date: Date, monthOnly = false) {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return monthOnly ? `${day.slice(0, 7)}-01T00:00:00+01:00` : `${day}T00:00:00+01:00`;
}

export default async function DashboardPage() {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) redirect("/admin/login?erreur=config");

  const supabase = await createSupabaseServer();
  const now = new Date();
  const dayStart = new Date(algiersStamp(now)).toISOString();
  const monthStart = new Date(algiersStamp(now, true)).toISOString();

  const [today, fresh, month] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", dayStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "nouvelle"),
    supabase.from("orders").select("total, status").gte("created_at", monthStart),
  ]);

  const revenue = (month.data ?? [])
    .filter((order) => order.status !== "annulée")
    .reduce((sum, order) => sum + (order.total as number), 0);

  const cards = [
    { label: "Commandes du jour", value: String(today.count ?? 0) },
    { label: "Nouvelles commandes", value: String(fresh.count ?? 0) },
    { label: "Chiffre du mois", value: formatDa(revenue) },
  ];

  return (
    <section>
      <h1 className="font-display text-3xl">Tableau de bord</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-card bg-ivory p-5">
            <p className="text-sm text-ink/60">{card.label}</p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
