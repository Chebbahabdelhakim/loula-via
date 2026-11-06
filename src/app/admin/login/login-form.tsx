"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm({ notice }: { notice: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const supabase = createSupabaseBrowser();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPending(false);
    if (signError) {
      setError("E-mail ou mot de passe incorrect. Si le compte vient d'être créé, désactivez la confirmation d'e-mail dans Supabase ou confirmez l'adresse.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {notice ? <p className="rounded-card bg-cream px-3 py-3 text-sm">{notice}</p> : null}
      <label className="block text-sm" htmlFor="email">
        E-mail
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
        />
      </label>
      <label className="block text-sm" htmlFor="password">
        Mot de passe
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3"
        />
      </label>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink py-3 text-sm text-cream disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
