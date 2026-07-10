export interface JsonResult {
  formatted: string;
  isValid: boolean;
  error?: string;
  stats?: {
    keys: number;
    depth: number;
    size: number;
  };
}

export function formatJson(input: string, indent: number = 2): JsonResult {
  if (!input.trim()) {
    return { formatted: '', isValid: false, error: 'Input is empty' };
  }
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    const stats = getJsonStats(parsed);
    return { formatted, isValid: true, stats };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON';
    return { formatted: input, isValid: false, error };
  }
}

export function minifyJson(input: string): JsonResult {
  if (!input.trim()) {
    return { formatted: '', isValid: false, error: 'Input is empty' };
  }
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed);
    return { formatted, isValid: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON';
    return { formatted: input, isValid: false, error };
  }
}

function getJsonStats(obj: unknown, depth: number = 0): { keys: number; depth: number; size: number } {
  if (typeof obj !== 'object' || obj === null) {
    return { keys: 0, depth, size: JSON.stringify(obj).length };
  }
  const entries = Array.isArray(obj) ? obj : Object.values(obj);
  let maxDepth = depth;
  let totalKeys = Array.isArray(obj) ? 0 : Object.keys(obj).length;

  for (const val of entries) {
    const sub = getJsonStats(val, depth + 1);
    maxDepth = Math.max(maxDepth, sub.depth);
    totalKeys += sub.keys;
  }

  return { keys: totalKeys, depth: maxDepth, size: JSON.stringify(obj).length };
}
