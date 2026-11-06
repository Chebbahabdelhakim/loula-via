export function formatDa(amount: number) {
  const formatted = new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(amount);
  return `${formatted} DA`;
}
