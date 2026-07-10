export type CaseType =
  | 'uppercase'
  | 'lowercase'
  | 'titleCase'
  | 'sentenceCase'
  | 'camelCase'
  | 'pascalCase'
  | 'snakeCase'
  | 'kebabCase'
  | 'constantCase';

export function convertCase(text: string, caseType: CaseType): string {
  if (!text) return '';

  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titleCase':
      return text.replace(/\b\w/g, (char) => char.toUpperCase());
    case 'sentenceCase':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase());
    case 'camelCase':
      return toWords(text)
        .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w)))
        .join('');
    case 'pascalCase':
      return toWords(text).map(capitalize).join('');
    case 'snakeCase':
      return toWords(text).map((w) => w.toLowerCase()).join('_');
    case 'kebabCase':
      return toWords(text).map((w) => w.toLowerCase()).join('-');
    case 'constantCase':
      return toWords(text).map((w) => w.toUpperCase()).join('_');
  }
}

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
