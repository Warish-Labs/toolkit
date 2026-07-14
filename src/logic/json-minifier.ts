export function minifyJson(jsonStr: string): string {
  if (!jsonStr.trim()) {
    throw new Error('Input is empty');
  }

  // Parse first to validate it's correct JSON
  const parsed = JSON.parse(jsonStr);
  return JSON.stringify(parsed);
}
