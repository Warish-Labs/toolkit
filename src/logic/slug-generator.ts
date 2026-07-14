export interface SlugOptions {
  separator?: '-' | '_';
  lowercase?: boolean;
  removeStopWords?: boolean;
  maxLength?: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in',
  'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the',
  'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'
]);

export function generateSlug(text: string, options: SlugOptions = {}): string {
  const {
    separator = '-',
    lowercase = true,
    removeStopWords = false,
    maxLength = 0
  } = options;

  let cleanText = text;
  
  if (lowercase) {
    cleanText = cleanText.toLowerCase();
  }

  // Remove diacritics / normalize unicode accents
  cleanText = cleanText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let words = cleanText.split(/[^a-zA-Z0-9]+/);

  if (removeStopWords) {
    words = words.filter(word => !STOP_WORDS.has(word.toLowerCase()));
  }

  words = words.filter(word => word !== '');

  let slug = words.join(separator);

  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Trim hanging separator
    if (slug.endsWith(separator)) {
      slug = slug.substring(0, slug.length - 1);
    }
  }

  return slug;
}
