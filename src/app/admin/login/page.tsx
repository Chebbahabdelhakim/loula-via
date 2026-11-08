import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-16">
      <p className="text-center font-display text-3xl">LOULA VIA</p>
      <p className="mt-2 text-center text-sm text-ink/60">Administration</p>
      <div className="mt-8 rounded-card bg-ivory p-6">
        <LoginForm
          notice={
            erreur === "config"
              ? "Configuration Supabase incomplète. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) dans .env.local, puis redémarrez le serveur."
              : erreur === "cle"
              ? "La clé secrète Supabase est absente ou incorrecte. Remplacez SUPABASE_SERVICE_ROLE_KEY dans .env.local par la clé sb_secret_."
              : erreur === "acces"
                ? "Ce compte n'est pas administrateur. Ajoutez-le dans la table admins."
                : ""
          }
        />
      </div>
    </main>
  );
}
