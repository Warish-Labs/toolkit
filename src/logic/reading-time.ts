export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  wordCount: number;
  displayTime: string;
}

export function calculateReadingTime(text: string, wpm: number = 200): ReadingTimeResult {
  if (!text || !text.trim()) {
    return { minutes: 0, seconds: 0, wordCount: 0, displayTime: '0 sec' };
  }

  const wordCount = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const totalSeconds = Math.ceil((wordCount / wpm) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let displayTime = '';
  if (minutes > 0 && seconds > 0) {
    displayTime = `${minutes} min ${seconds} sec`;
  } else if (minutes > 0) {
    displayTime = `${minutes} min`;
  } else {
    displayTime = `${seconds} sec`;
  }

  return { minutes, seconds, wordCount, displayTime };
}
