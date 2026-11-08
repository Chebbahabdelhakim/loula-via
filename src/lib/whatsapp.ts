import { formatDa } from "@/lib/money";

export type OrderLine = {
  name: string;
  quantity: number;
  lineTotal: number;
};

export function buildOrderMessage(input: {
  orderNumber: number;
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  lines: OrderLine[];
  total: number;
  locale: "fr" | "ar";
}) {
  const articles = input.lines
    .map((line) => `- ${line.name} x${line.quantity} = ${formatDa(line.lineTotal)}`)
    .join("\n");
  const deliveryNotice =
    input.locale === "ar"
      ? "تكاليف التوصيل تؤكد عبر الهاتف"
      : "Frais de livraison confirmés par téléphone";

  return [
    `Nouvelle commande #${input.orderNumber} - LOULA VIA`,
    `Nom : ${input.customerName}`,
    `Téléphone : ${input.phone}`,
    `Wilaya : ${input.wilaya}`,
    `Adresse : ${input.address}`,
    "Articles :",
    articles,
    deliveryNotice,
    `Total : ${formatDa(input.total)}`,
    "Paiement : à la livraison",
  ].join("\n");
}

export function whatsappLink(number: string, text: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
