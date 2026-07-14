export interface LoremGenerationParams {
  type: 'paragraphs' | 'sentences' | 'words';
  count: number;
  startWithLorem: boolean;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum'
];

export function generateLoremIpsum(params: LoremGenerationParams): string {
  const { type, count, startWithLorem } = params;

  if (type === 'words') {
    return generateWords(count, startWithLorem);
  }

  if (type === 'sentences') {
    return generateSentences(count, startWithLorem);
  }

  return generateParagraphs(count, startWithLorem);
}

function generateWords(count: number, startWithLorem: boolean): string {
  const words: string[] = [];
  if (startWithLorem && count > 0) {
    words.push('lorem', 'ipsum', 'dolor', 'sit', 'amet');
  }

  while (words.length < count) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }

  // Slice in case count was smaller than 5 but startWithLorem was true
  return words.slice(0, count).join(' ');
}

function generateSentences(count: number, startWithLorem: boolean): string {
  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0 && startWithLorem;
    const len = 8 + Math.floor(Math.random() * 10); // 8-18 words
    let sentence = generateWords(len, isFirst);
    
    // Capitalize first letter and append period
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    sentences.push(sentence);
  }

  return sentences.join(' ');
}

function generateParagraphs(count: number, startWithLorem: boolean): string {
  const paragraphs: string[] = [];

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0 && startWithLorem;
    const len = 3 + Math.floor(Math.random() * 4); // 3-6 sentences per paragraph
    const paragraph = generateSentences(len, isFirst);
    paragraphs.push(paragraph);
  }

  return paragraphs.join('\n\n');
}
