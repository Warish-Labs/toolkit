export function repeatText(text: string, count: number, separator: string): string {
  if (!text || count < 1) return '';
  const safeCount = Math.min(Math.max(Math.floor(count), 1), 1000);
  return Array(safeCount).fill(text).join(separator);
}
