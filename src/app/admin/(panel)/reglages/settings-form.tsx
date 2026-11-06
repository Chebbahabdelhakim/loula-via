"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/admin/actions";
import type { DeliveryFee } from "@/lib/types";

export function SettingsForm({
  fees,
  whatsapp,
}: {
  fees: DeliveryFee[];
  whatsapp: string;
}) {
  const router = useRouter();
  const [number, setNumber] = useState(whatsapp);
  const [rows, setRows] = useState(fees);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const result = await saveSettings({
      whatsapp: number,
      fees: rows.map((row) => ({ code: row.code, fee: Number(row.fee) })),
    });
    setPending(false);
    setMessage(result.ok ? "Réglages enregistrés." : result.message);
    if (result.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block text-sm">
        Numéro WhatsApp (international, sans +)
        <input
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          inputMode="numeric"
          placeholder="213779293290"
          className="mt-1 w-full rounded-card border border-gold/30 bg-ivory px-3 py-3"
        />
      </label>
      <p className="text-sm text-ink/60">
        S’il est rempli, ce numéro est utilisé pour les nouvelles commandes. Sinon, le site utilise NEXT_PUBLIC_WHATSAPP_NUMBER.
      </p>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <label key={row.code} className="grid grid-cols-[1fr_7rem] items-center gap-3 text-sm">
            <span>
              {String(row.code).padStart(2, "0")} — {row.name}
            </span>
            <input
              type="number"
              min={0}
              value={row.fee}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, fee: Number(event.target.value) };
                setRows(next);
              }}
              className="rounded-card border border-gold/30 bg-ivory px-3 py-2"
            />
          </label>
        ))}
      </div>
      {message ? <p className="text-sm">{message}</p> : null}
      <button type="submit" disabled={pending} className="rounded-full bg-ink px-5 py-3 text-sm text-cream disabled:opacity-60">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
