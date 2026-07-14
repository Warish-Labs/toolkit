export interface UnicodeCharInfo {
  char: string;
  codePoint: string; // U+XXXX
  decCode: number;
  hexCode: string;
  htmlEntity: string;
}

export function inspectUnicode(text: string): UnicodeCharInfo[] {
  if (!text) return [];

  const results: UnicodeCharInfo[] = [];
  
  // Use Array.from to correctly iterate over surrogate pairs (multi-byte emoji)
  const characters = Array.from(text);

  for (const char of characters) {
    const codePointNum = char.codePointAt(0);
    if (codePointNum === undefined) continue;

    const hex = codePointNum.toString(16).toUpperCase().padStart(4, '0');
    
    results.push({
      char,
      codePoint: `U+${hex}`,
      decCode: codePointNum,
      hexCode: `0x${hex}`,
      htmlEntity: `&#${codePointNum};`,
    });
  }

  return results;
}
