export interface FindReplaceOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
}

export interface FindReplaceResult {
  output: string;
  count: number;
  error?: string;
}

export function findAndReplace(
  text: string,
  find: string,
  replace: string,
  options: FindReplaceOptions
): FindReplaceResult {
  if (!text || !find) {
    return { output: text, count: 0 };
  }

  try {
    let pattern: RegExp;

    if (options.useRegex) {
      const flags = options.caseSensitive ? 'g' : 'gi';
      pattern = new RegExp(find, flags);
    } else {
      const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordBound = options.wholeWord ? `\\b${escaped}\\b` : escaped;
      const flags = options.caseSensitive ? 'g' : 'gi';
      pattern = new RegExp(wordBound, flags);
    }

    let count = 0;
    const output = text.replace(pattern, (match) => {
      count++;
      return replace;
    });

    return { output, count };
  } catch (e) {
    return {
      output: text,
      count: 0,
      error: e instanceof Error ? e.message : 'Invalid pattern',
    };
  }
}
