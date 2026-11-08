# LOULA VIA

Boutique en ligne de sacs et accessoires pour femmes (Algérie). Le site est en français et en arabe. Le paiement se fait uniquement à la livraison. Une commande est d’abord enregistrée, puis un message WhatsApp s’ouvre, déjà rédigé.

## Notes de maintenance

- Le projet accepte les noms Supabase actuels `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY`, ainsi que les anciens noms `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` en secours.
- L’accès `/admin` est vérifié côté serveur à partir de la table `admins`, pas seulement par le middleware.
- Les composants du panier lisent depuis `localStorage` dans leur état initial pour éviter le flash visuel et les états incohérents à l’hydratation.

## Ce qui a été choisi pour vous

- Frais de livraison de départ : Alger 400 DA, Blida, Boumerdès et Tipaza 600 DA, les autres wilayas 800 DA. Vous les changez dans l’admin, page Réglages.
- Les numéros de commande commencent à 1001.
- Le prix indiqué dans le message WhatsApp est le total de la ligne (prix × quantité).
- Le numéro WhatsApp des commandes est celui enregistré dans Réglages s’il n’est pas vide. Sinon, c’est `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- `NEXT_PUBLIC_SITE_URL` sert à l’aperçu du lien (WhatsApp, Instagram) et au sitemap. En local : `http://localhost:3000`. En ligne : l’adresse du site, avec `https://`.
- Next.js 16 protège `/admin` dans `src/proxy.ts` (c’est le nouveau nom de l’ancien fichier middleware).
- Les quatre produits de démonstration n’ont pas de photo. Ajoutez-les depuis l’admin.

## 1. Créer le projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com) et créez un projet.
2. Choisissez un mot de passe de base de données et une région proche (par exemple Francfort).
3. Attendez que le projet soit prêt.

## 2. Créer les tables

1. Dans Supabase, ouvrez **SQL Editor** → **New query**.
2. Ouvrez le fichier `supabase/schema.sql` de ce dossier, copiez tout son contenu, collez-le dans l’éditeur, puis cliquez sur **Run**.
3. Ouvrez une nouvelle requête, copiez `supabase/seed.sql`, collez-le, puis **Run**.
4. Vérifiez **Table Editor** : vous devez voir `products`, `delivery_fees` (58 lignes), `orders`, `order_items`, `site_settings` et `admins`.
5. Vérifiez **Storage** : le bucket public `products` est créé par le schéma; les règles autorisent la lecture publique des photos et leur gestion par les comptes administrateurs.

## 3. Créer les deux administrateurs

Maher et Wail se connectent avec un e-mail et un mot de passe.

1. **Authentication** → **Sign In / Providers** → **Email**.
2. Pour une boutique simple, désactivez **Confirm email**. Sinon, chaque compte doit cliquer un lien reçu par e-mail avant de pouvoir se connecter.
3. **Authentication** → **Users** → **Add user** → **Create new user**. Créez le compte de Maher, puis celui de Wail. Cochez **Auto Confirm User** si l’option est proposée.
4. Revenez dans le **SQL Editor** et exécutez ces deux requêtes en remplaçant les e-mails :

```sql
insert into public.admins (user_id, full_name)
select id, 'Maher' from auth.users where email = 'EMAIL_DE_MAHER';

insert into public.admins (user_id, full_name)
select id, 'Wail' from auth.users where email = 'EMAIL_DE_WAIL';
```

5. Vérifiez que la table `admins` contient bien deux lignes. Un compte qui n’y figure pas ne peut pas ouvrir `/admin`.

## 4. Récupérer les clés

Dans Supabase : **Project Settings** → **API Keys**.

- L’URL du projet (`https://xxxx.supabase.co`) va dans `NEXT_PUBLIC_SUPABASE_URL`.
- La clé **publishable** (`sb_publishable_...`) va dans `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Elle peut être visible dans le navigateur.
- La clé **secret** (`sb_secret_...`) va dans `SUPABASE_SECRET_KEY`. Elle ne doit jamais être collée dans le code, dans GitHub, ni dans un message public. Elle sert uniquement au serveur pour enregistrer les commandes et vérifier les admins.

## 5. Remplir `.env.local`

Le fichier est à la racine du projet :

`C:\Users\21354\Desktop\Maher\.env.local`

Il est masqué par Git (le point au début du nom). Dans Cursor : Ctrl+P, puis tapez `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_WHATSAPP_NUMBER=213779293290
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` est le numéro de la boutique, au format international, **sans** le signe `+`.

Tant que `SUPABASE_SECRET_KEY` contient un texte d’exemple, les commandes ne s’enregistrent pas et l’admin refuse l’accès même avec le bon mot de passe. Remplacez-le par la vraie clé `sb_secret_`, puis relancez `npm run dev`.

Le modèle sans secrets est `.env.example`. Ne le remplissez pas avec les vraies clés.

## 6. Lancer le site sur votre ordinateur

Ouvrez un terminal dans ce dossier.

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Le site redirige vers `/fr`. Le bouton de langue passe en arabe (`/ar`) et inverse le sens de la page.

- Boutique : accueil, fiche produit, panier, commande, page de remerciement.
- Admin : [http://localhost:3000/admin](http://localhost:3000/admin).

Pour arrêter le site : Ctrl+C dans le terminal.

Vérifier que tout compile :

```bash
npm run build
```

## 7. Mettre le projet sur GitHub

1. Créez un dépôt vide sur [https://github.com/new](https://github.com/new), sans README.
2. Dans le dossier du projet :

```bash
git add .
git commit -m "Boutique LOULA VIA"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/loula-via.git
git push -u origin main
```

`.env.local` ne part pas sur GitHub. C’est voulu.

## 8. Déployer sur Vercel

1. Allez sur [https://vercel.com](https://vercel.com) et connectez-vous avec GitHub.
2. **Add New** → **Project** → importez le dépôt.
3. Avant de déployer, ouvrez **Environment Variables** et ajoutez les cinq variables de `.env.local`. Mettez la vraie clé secrète. Pour `NEXT_PUBLIC_SITE_URL`, vous pouvez d’abord mettre l’adresse Vercel (`https://votre-projet.vercel.app`), puis la changer quand le domaine est branché.
4. Cliquez sur **Deploy**.
5. À chaque nouveau `git push`, Vercel redéploie le site.

## 9. Brancher un nom de domaine

1. Achetez le domaine chez un registrar (Namecheap, OVH, Google Domains, etc.).
2. Dans Vercel : le projet → **Settings** → **Domains** → ajoutez le domaine, par exemple `loula-via.dz` ou `www.loula-via.com`.
3. Vercel affiche les enregistrements DNS à créer (souvent un `A` vers `76.76.21.21` et un `CNAME` `www` vers `cname.vercel-dns.com`). Copiez-les chez le registrar.
4. Attendez la validation (quelques minutes à quelques heures).
5. Changez `NEXT_PUBLIC_SITE_URL` dans Vercel pour `https://votre-domaine`, puis redéployez (**Deployments** → **Redeploy**).

## Utilisation au quotidien

- **Produits** : photo JPG, PNG ou WEBP. Elle est réduite dans le navigateur avant l’envoi. Décochez « visible » pour masquer un article sans le supprimer.
- **Commandes** : filtre par statut, changement de statut en un bouton, **Appeler** et **WhatsApp client**.
- **Réglages** : frais de chaque wilaya et numéro WhatsApp.
- Le panier du client est gardé dans son téléphone (`localStorage`). Les prix de la commande sont recalculés sur le serveur à partir de la base, pas à partir du panier.

## En cas de problème

- Page boutique vide : `schema.sql` puis `seed.sql` n’ont pas été exécutés, ou la clé publishable est fausse.
- « La commande n'a pas pu être enregistrée » : la clé secrète est fausse ou encore le texte d’exemple.
- Connexion admin impossible : confirmation d’e-mail encore active, ou le compte n’est pas dans `admins`.
- Photo refusée : le bucket `products` n’existe pas, ou le compte n’est pas admin.
