export type CaseType =
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'title'
  | 'sentence'
  | 'toggle'
  | 'alternating';

export function convertCaseExtended(text: string, type: CaseType): string {
  if (!text) return '';

  switch (type) {
    case 'camel':
      return toCamelCase(text);
    case 'pascal':
      return toPascalCase(text);
    case 'snake':
      return toSnakeCase(text);
    case 'kebab':
      return toKebabCase(text);
    case 'constant':
      return toConstantCase(text);
    case 'title':
      return toTitleCase(text);
    case 'sentence':
      return toSentenceCase(text);
    case 'toggle':
      return toToggleCase(text);
    case 'alternating':
      return toAlternatingCase(text);
    default:
      return text;
  }
}

function toCamelCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

function toPascalCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, c => c.toUpperCase());
}

function toSnakeCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toLowerCase()
    .replace(/^_+|_+$/g, '');
}

function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

function toConstantCase(text: string): string {
  return toSnakeCase(text).toUpperCase();
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function toSentenceCase(text: string): string {
  const sentences = text.split(/([.!?]\s*)/);
  return sentences
    .map((part) => {
      // Check if it is a sentence boundary marker
      if (/^[.!?]\s*$/.test(part)) return part;
      const trimmed = part.trim();
      if (!trimmed) return part;
      return part.replace(trimmed, trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase());
    })
    .join('');
}

function toToggleCase(text: string): string {
  return text
    .split('')
    .map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())
    .join('');
}

function toAlternatingCase(text: string): string {
  return text
    .split('')
    .map((c, idx) => idx % 2 === 0 ? c.toLowerCase() : c.toUpperCase())
    .join('');
}
