// Light-weight QR Code and Barcode Generators

// ── Barcode Generator (Code 39) ──────────────────────────────────────
const CODE39_MAP: Record<string, string> = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101',
  '$': '100100100101', '/': '100100101001', '+': '100101001001', '%': '101001001001'
};

export interface BarcodeResult {
  pattern: string; // String of 1s and 0s representing black/white bars
  valid: boolean;
  error?: string;
}

export function generateBarcode39(text: string): BarcodeResult {
  const cleanText = text.toUpperCase();
  if (!cleanText) {
    return { pattern: '', valid: false, error: 'Input text is empty' };
  }

  // Validate characters
  for (const char of cleanText) {
    if (!CODE39_MAP[char]) {
      return {
        pattern: '',
        valid: false,
        error: `Unsupported character: "${char}". Code 39 supports uppercase A-Z, numbers 0-9, and symbols: - . $ / + % [space]`,
      };
    }
  }

  // Code 39 requires start/stop character '*'
  const fullText = `*${cleanText}*`;
  let pattern = '';

  for (let i = 0; i < fullText.length; i++) {
    pattern += CODE39_MAP[fullText[i]];
    if (i < fullText.length - 1) {
      pattern += '0'; // Inter-character gap
    }
  }

  return { pattern, valid: true };
}

// Barcode Generator (Code 39) remains unchanged

