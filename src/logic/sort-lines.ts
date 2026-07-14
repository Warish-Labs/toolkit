export type SortMode = 'alphabetical' | 'alphabetical-reverse' | 'numerical' | 'numerical-reverse' | 'shuffle';

export interface SortLinesOptions {
  mode: SortMode;
  caseInsensitive: boolean;
}

export function sortLines(text: string, options: SortLinesOptions): string {
  if (!text) return '';

  const lines = text.split('\n');

  switch (options.mode) {
    case 'alphabetical':
      return [...lines]
        .sort((a, b) =>
          options.caseInsensitive
            ? a.toLowerCase().localeCompare(b.toLowerCase())
            : a.localeCompare(b)
        )
        .join('\n');

    case 'alphabetical-reverse':
      return [...lines]
        .sort((a, b) =>
          options.caseInsensitive
            ? b.toLowerCase().localeCompare(a.toLowerCase())
            : b.localeCompare(a)
        )
        .join('\n');

    case 'numerical':
      return [...lines]
        .sort((a, b) => {
          const numA = parseFloat(a.trim());
          const numB = parseFloat(b.trim());
          if (isNaN(numA) && isNaN(numB)) return 0;
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          return numA - numB;
        })
        .join('\n');

    case 'numerical-reverse':
      return [...lines]
        .sort((a, b) => {
          const numA = parseFloat(a.trim());
          const numB = parseFloat(b.trim());
          if (isNaN(numA) && isNaN(numB)) return 0;
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          return numB - numA;
        })
        .join('\n');

    case 'shuffle':
      return [...lines]
        .map((line) => ({ line, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((o) => o.line)
        .join('\n');

    default:
      return text;
  }
}
