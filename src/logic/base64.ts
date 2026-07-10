export type Base64Mode = 'encode' | 'decode';

export interface Base64Result {
  output: string;
  isValid: boolean;
  error?: string;
}

export function encodeBase64(input: string): Base64Result {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return { output: encoded, isValid: true };
  } catch (e) {
    return { output: '', isValid: false, error: e instanceof Error ? e.message : 'Encoding failed' };
  }
}

export function decodeBase64(input: string): Base64Result {
  try {
    const decoded = decodeURIComponent(escape(atob(input.trim())));
    return { output: decoded, isValid: true };
  } catch {
    return { output: '', isValid: false, error: 'Invalid Base64 string' };
  }
}
