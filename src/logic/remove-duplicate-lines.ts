export interface RemoveDuplicatesOptions {
  caseInsensitive: boolean;
  trimLines: boolean;
}

export interface RemoveDuplicatesResult {
  output: string;
  originalCount: number;
  uniqueCount: number;
  removedCount: number;
}

export function removeDuplicateLines(
  text: string,
  options: RemoveDuplicatesOptions
): RemoveDuplicatesResult {
  if (!text) {
    return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
  }

  const lines = text.split('\n');
  const originalCount = lines.length;
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const processed = options.trimLines ? line.trim() : line;
    const key = options.caseInsensitive ? processed.toLowerCase() : processed;

    if (!seen.has(key)) {
      seen.add(key);
      result.push(options.trimLines ? processed : line);
    }
  }

  const uniqueCount = result.length;
  return {
    output: result.join('\n'),
    originalCount,
    uniqueCount,
    removedCount: originalCount - uniqueCount,
  };
}
