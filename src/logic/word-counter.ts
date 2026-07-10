export interface WordCountResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
}

export function countText(text: string): WordCountResult {
  if (!text || !text.trim()) {
    return { characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, readingTime: '0 sec' };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  const minutes = words / 200;
  let readingTime: string;
  if (minutes < 1) {
    readingTime = `${Math.ceil(minutes * 60)} sec`;
  } else {
    readingTime = `${Math.ceil(minutes)} min`;
  }

  return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTime };
}
