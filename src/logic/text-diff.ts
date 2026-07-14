export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
}

export function computeTextDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split(/\r?\n/);
  const modLines = modified.split(/\r?\n/);

  const n = origLines.length;
  const m = modLines.length;

  // Build DP table for LCS
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff alignment
  const diffs: DiffLine[] = [];
  let i = n, j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      diffs.unshift({
        type: 'unchanged',
        content: origLines[i - 1],
        originalLineNum: i,
        modifiedLineNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffs.unshift({
        type: 'added',
        content: modLines[j - 1],
        modifiedLineNum: j,
      });
      j--;
    } else {
      diffs.unshift({
        type: 'removed',
        content: origLines[i - 1],
        originalLineNum: i,
      });
      i--;
    }
  }

  return diffs;
}
