import Link from "next/link";
import { redirect } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/actions";
import { formatDa } from "@/lib/money";
import { toInternationalDz } from "@/lib/phone";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("fr-DZ", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Africa/Algiers",
    numberingSystem: "latn",
  }).format(new Date(value));
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) redirect("/admin/login?erreur=config");

  const { statut } = await searchParams;
  const status = ORDER_STATUSES.includes(statut as OrderStatus) ? (statut as OrderStatus) : "";
  const supabase = await createSupabaseServer();
  let query = supabase
    .from("orders")
    .select("id, order_number, customer_name, phone, wilaya, address, delivery_fee, total, status, created_at, order_items(id, product_id, product_name, unit_price, quantity)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <section>
      <h1 className="font-display text-3xl">Commandes</h1>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <Link href="/admin/commandes" className={`shrink-0 rounded-full px-3 py-2 text-sm ${status === "" ? "bg-ink text-cream" : "border border-gold/30"}`}>
          Toutes
        </Link>
        {ORDER_STATUSES.map((item) => (
          <Link
            key={item}
            href={`/admin/commandes?statut=${encodeURIComponent(item)}`}
            className={`shrink-0 rounded-full px-3 py-2 text-sm ${status === item ? "bg-ink text-cream" : "border border-gold/30"}`}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {orders.length === 0 ? <p className="text-ink/60">Aucune commande.</p> : null}
        {orders.map((order) => {
          const wa = toInternationalDz(order.phone);
          return (
            <article key={order.id} className="rounded-card bg-ivory p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl">#{order.order_number}</h2>
                  <p className="text-sm text-ink/60">{formatWhen(order.created_at)}</p>
                </div>
                <p className="rounded-full bg-cream px-3 py-1 text-sm">{order.status}</p>
              </div>
              <div className="mt-3 text-sm leading-6">
                <p>{order.customer_name}</p>
                <p>{order.phone}</p>
                <p>{order.wilaya}</p>
                <p>{order.address}</p>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {order.order_items?.map((item) => (
                  <li key={item.id}>
                    {item.product_name} × {item.quantity} = {formatDa(item.unit_price * item.quantity)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Livraison {formatDa(order.delivery_fee)} · Total {formatDa(order.total)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`tel:${order.phone}`} className="rounded-full border border-gold/40 px-3 py-2 text-sm">
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(`Bonjour, c'est LOULA VIA au sujet de votre commande #${order.order_number}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold/40 px-3 py-2 text-sm"
                >
                  WhatsApp client
                </a>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {ORDER_STATUSES.map((item) => (
                  <form key={item} action={updateOrderStatus}>
                    <input type="hidden" name="id" value={order.id} />
                    <input type="hidden" name="status" value={item} />
                    <button
                      type="submit"
                      disabled={order.status === item}
                      className="rounded-full bg-cream px-3 py-2 text-sm disabled:bg-ink disabled:text-cream"
                    >
                      {item}
                    </button>
                  </form>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
