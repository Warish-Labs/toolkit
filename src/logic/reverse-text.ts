export type ReverseMode = 'string' | 'words' | 'lines';

export function reverseText(text: string, mode: ReverseMode): string {
  if (!text) return '';

  switch (mode) {
    case 'string':
      return text.split('').reverse().join('');

    case 'words':
      return text
        .split('\n')
        .map((line) => line.split(/(\s+)/).reverse().join(''))
        .join('\n');

    case 'lines':
      return text.split('\n').reverse().join('\n');

    default:
      return text;
  }
}
