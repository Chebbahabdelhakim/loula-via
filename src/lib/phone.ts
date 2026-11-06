export function toInternationalDz(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `213${digits.slice(1)}`;
  if (digits.startsWith("213")) return digits;
  return digits;
}
