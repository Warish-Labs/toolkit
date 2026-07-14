export type TrimMode =
  | 'trim-both'
  | 'trim-start'
  | 'trim-end'
  | 'collapse-spaces'
  | 'remove-all-spaces';

export function trimWhitespace(text: string, mode: TrimMode): string {
  if (!text) return '';

  switch (mode) {
    case 'trim-both':
      return text
        .split('\n')
        .map((line) => line.trim())
        .join('\n');

    case 'trim-start':
      return text
        .split('\n')
        .map((line) => line.trimStart())
        .join('\n');

    case 'trim-end':
      return text
        .split('\n')
        .map((line) => line.trimEnd())
        .join('\n');

    case 'collapse-spaces':
      return text.replace(/[ \t]+/g, ' ').trim();

    case 'remove-all-spaces':
      return text.replace(/\s/g, '');

    default:
      return text;
  }
}
