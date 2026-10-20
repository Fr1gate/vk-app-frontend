export function formatDuration(seconds: number): string {
  if (seconds >= 3_600) {
    const hours = seconds / 3_600;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1).replace(".", ",")} ч`;
  }
  if (seconds >= 60) return `${Math.round(seconds / 60)} мин`;
  return `${seconds} с`;
}
