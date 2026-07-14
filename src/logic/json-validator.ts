export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export function validateJson(jsonStr: string): JsonValidationResult {
  if (!jsonStr.trim()) {
    return { isValid: false, error: 'Input is empty' };
  }

  try {
    JSON.parse(jsonStr);
    return { isValid: true };
  } catch (e) {
    const error = e as Error;
    let line: number | undefined;
    let column: number | undefined;

    // Attempt to extract line and column from the standard V8 syntax error message
    // e.g. "Unexpected token } in JSON at position 42" or "Expected double-quoted property name in JSON at position 12"
    const posMatch = error.message.match(/at position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = jsonStr.substring(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      isValid: false,
      error: error.message,
      line,
      column,
    };
  }
}
