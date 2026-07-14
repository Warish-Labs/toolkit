export interface RegexMatchInfo {
  match: string;
  index: number;
  groups: (string | undefined)[];
}

export interface RegexTestResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatchInfo[];
  replacedText?: string;
}

export function testRegex(
  pattern: string,
  flags: string,
  testText: string,
  replacement?: string
): RegexTestResult {
  if (!pattern) {
    return { isValid: false, error: 'Pattern is empty', matches: [] };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatchInfo[] = [];

    if (flags.includes('g')) {
      let match;
      // Prevent infinite loop if regex is empty/matches empty strings
      let lastIndex = -1;
      while ((match = regex.exec(testText)) !== null) {
        if (regex.lastIndex === lastIndex) {
          break;
        }
        lastIndex = regex.lastIndex;
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    } else {
      const match = regex.exec(testText);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    let replacedText;
    if (replacement !== undefined) {
      replacedText = testText.replace(regex, replacement);
    }

    return {
      isValid: true,
      matches,
      replacedText,
    };
  } catch (e) {
    return {
      isValid: false,
      error: e instanceof Error ? e.message : 'Invalid Regular Expression',
      matches: [],
    };
  }
}
