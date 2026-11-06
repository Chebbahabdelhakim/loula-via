"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import { compressImage } from "@/lib/compress-image";
import { formatDa } from "@/lib/money";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import type { Product } from "@/lib/types";

const emptyForm = {
  id: "",
  nameFr: "",
  nameAr: "",
  price: "",
  descriptionFr: "",
  descriptionAr: "",
  imageUrl: "",
  active: true,
};

export function ProductManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function startCreate() {
    setForm(emptyForm);
    setFile(null);
    setPreview("");
    setMessage("");
    setOpen(true);
  }

  function startEdit(product: Product) {
    setForm({
      id: product.id,
      nameFr: product.name_fr,
      nameAr: product.name_ar,
      price: String(product.price),
      descriptionFr: product.description_fr ?? "",
      descriptionAr: product.description_ar ?? "",
      imageUrl: product.image_url ?? "",
      active: product.active,
    });
    setFile(null);
    setPreview(product.image_url ?? "");
    setMessage("");
    setOpen(true);
  }

  function onFile(selected: File | null) {
    setFile(selected);
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(selected ? URL.createObjectURL(selected) : form.imageUrl);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      let imageUrl = form.imageUrl || null;
      if (file) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          setMessage("Choisissez une photo JPG, PNG ou WEBP.");
          setPending(false);
          return;
        }
        const blob = await compressImage(file);
        const path = `${crypto.randomUUID()}.jpg`;
        const supabase = createSupabaseBrowser();
        const { error } = await supabase.storage.from("products").upload(path, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });
        if (error) {
          setMessage("Envoi de la photo refusé. Vérifiez que le compte est admin.");
          setPending(false);
          return;
        }
        imageUrl = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
      }

      const result = await saveProduct({
        id: form.id || undefined,
        nameFr: form.nameFr,
        nameAr: form.nameAr,
        price: Number(form.price),
        descriptionFr: form.descriptionFr,
        descriptionAr: form.descriptionAr,
        imageUrl,
        active: form.active,
      });
      if (!result.ok) {
        setMessage(result.message);
        setPending(false);
        return;
      }
      setOpen(false);
      setForm(emptyForm);
      setFile(null);
      setPreview("");
      router.refresh();
    } catch {
      setMessage("La photo n'a pas pu être préparée.");
    }
    setPending(false);
  }

  async function onDelete(product: Product) {
    if (!window.confirm(`Supprimer « ${product.name_fr} » ?`)) return;
    const result = await deleteProduct(product.id);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    router.refresh();
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Produits</h1>
        <button type="button" onClick={startCreate} className="rounded-full bg-ink px-4 py-2 text-sm text-cream">
          Ajouter
        </button>
      </div>
      {message && !open ? <p className="mt-4 text-sm text-red-800">{message}</p> : null}

      {open ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-card bg-ivory p-4">
          <h2 className="font-display text-2xl">{form.id ? "Modifier" : "Nouveau produit"}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Nom français
              <input required value={form.nameFr} onChange={(event) => setForm({ ...form, nameFr: event.target.value })} className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3" />
            </label>
            <label className="text-sm">
              Nom arabe
              <input required value={form.nameAr} onChange={(event) => setForm({ ...form, nameAr: event.target.value })} className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3" />
            </label>
          </div>
          <label className="block text-sm">
            Prix (DA)
            <input required type="number" min={0} value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3" />
          </label>
          <label className="block text-sm">
            Description française
            <textarea value={form.descriptionFr} onChange={(event) => setForm({ ...form, descriptionFr: event.target.value })} rows={3} className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3" />
          </label>
          <label className="block text-sm">
            Description arabe
            <textarea value={form.descriptionAr} onChange={(event) => setForm({ ...form, descriptionAr: event.target.value })} rows={3} className="mt-1 w-full rounded-card border border-gold/30 bg-cream px-3 py-3" />
          </label>
          <label className="block text-sm">
            Photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => onFile(event.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm"
            />
          </label>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu" className="aspect-[4/5] w-40 rounded-card object-cover" />
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
            Produit visible sur la boutique
          </label>
          {message ? <p className="text-sm text-red-800">{message}</p> : null}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-full bg-ink px-4 py-2 text-sm text-cream disabled:opacity-60">
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-gold/40 px-4 py-2 text-sm">
              Annuler
            </button>
          </div>
        </form>
      ) : null}

      <ul className="mt-6 space-y-3">
        {products.map((product) => (
          <li key={product.id} className="flex flex-col gap-3 rounded-card bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{product.name_fr}</p>
              <p className="text-sm text-ink/60">{product.name_ar}</p>
              <p className="mt-1 text-sm text-gold-dark">
                {formatDa(product.price)} · {product.active ? "visible" : "masqué"}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(product)} className="rounded-full border border-gold/40 px-4 py-2 text-sm">
                Modifier
              </button>
              <button type="button" onClick={() => onDelete(product)} className="rounded-full border border-red-900/30 px-4 py-2 text-sm text-red-900">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
