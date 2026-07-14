export interface TextBinaryResult {
  output: string;
  isValid: boolean;
  error?: string;
}

export function textToBinary(text: string): TextBinaryResult {
  if (!text) return { output: '', isValid: true };

  try {
    const binary = text
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
    return { output: binary, isValid: true };
  } catch {
    return { output: '', isValid: false, error: 'Failed to convert text to binary.' };
  }
}

export function binaryToText(binary: string): TextBinaryResult {
  if (!binary || !binary.trim()) return { output: '', isValid: true };

  try {
    const parts = binary.trim().split(/\s+/);
    const invalid = parts.find((p) => !/^[01]{8}$/.test(p));
    if (invalid) {
      return {
        output: '',
        isValid: false,
        error: `Invalid binary chunk: "${invalid}". Each group must be exactly 8 bits (0s and 1s).`,
      };
    }
    const text = parts.map((b) => String.fromCharCode(parseInt(b, 2))).join('');
    return { output: text, isValid: true };
  } catch {
    return { output: '', isValid: false, error: 'Failed to convert binary to text.' };
  }
}
