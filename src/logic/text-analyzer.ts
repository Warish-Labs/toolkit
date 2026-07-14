export interface TextAnalysisResult {
  words: number;
  sentences: number;
  paragraphs: number;
  characters: number;
  charactersNoSpaces: number;
  uniqueWords: number;
  averageWordLength: number;
  longestWord: string;
  mostFrequentWords: Array<{ word: string; count: number }>;
}

export function analyzeText(text: string): TextAnalysisResult {
  if (!text || !text.trim()) {
    return {
      words: 0,
      sentences: 0,
      paragraphs: 0,
      characters: 0,
      charactersNoSpaces: 0,
      uniqueWords: 0,
      averageWordLength: 0,
      longestWord: '',
      mostFrequentWords: [],
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const wordList = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const words = wordList.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs =
    text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  const cleanedWords = wordList.map((w) => w.toLowerCase().replace(/[^a-z0-9']/g, ''));
  const uniqueWords = new Set(cleanedWords.filter((w) => w.length > 0)).size;

  const totalWordLength = cleanedWords.reduce((sum, w) => sum + w.length, 0);
  const averageWordLength = words > 0 ? parseFloat((totalWordLength / words).toFixed(1)) : 0;

  const longestWord = wordList.reduce(
    (longest, w) => (w.length > longest.length ? w : longest),
    ''
  );

  const frequencyMap: Record<string, number> = {};
  for (const w of cleanedWords) {
    if (w.length > 0) {
      frequencyMap[w] = (frequencyMap[w] || 0) + 1;
    }
  }
  const mostFrequentWords = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    words,
    sentences,
    paragraphs,
    characters,
    charactersNoSpaces,
    uniqueWords,
    averageWordLength,
    longestWord,
    mostFrequentWords,
  };
}
