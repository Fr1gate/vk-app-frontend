const fullFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatAmount(value: number): string {
  if (Math.abs(value) < 100_000) return fullFormatter.format(value);
  return compactFormatter.format(value);
}
