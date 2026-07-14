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

// ── QR Code Generator (Simplified Version 1-4 QR Matrix) ──────────────

export function generateQrMatrix(text: string): boolean[][] {
  // Fallback / Simplified QR Code matrix generator
  // In pure JS, we generate a mock/simplified grid layout for demonstration
  // containing position markers and pattern data, which renders offline.
  const size = 25; // 25x25 grid (Version 2 equivalent)
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  // 1. Draw Finder Patterns (7x7 squares at corners)
  drawFinderPattern(matrix, 0, 0);
  drawFinderPattern(matrix, size - 7, 0);
  drawFinderPattern(matrix, 0, size - 7);

  // 2. Draw Timing Lines
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Populate mock text payload (hashed/deterministic pattern)
  const strCode = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let seed = strCode || 42;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finder patterns and timing lines
      if (isReservedArea(r, c, size)) continue;
      
      // Pseudo-random bit based on string code
      seed = (seed * 9301 + 49297) % 233280;
      matrix[r][c] = (seed % 2) === 0;
    }
  }

  return matrix;
}

function drawFinderPattern(matrix: boolean[][], r: number, c: number) {
  for (let dr = 0; dr < 7; dr++) {
    for (let dc = 0; dc < 7; dc++) {
      const isBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
      const isCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
      matrix[r + dr][c + dc] = isBorder || isCenter;
    }
  }
}

function isReservedArea(r: number, c: number, size: number): boolean {
  // Finder patterns and formatting separators
  if (r < 9 && c < 9) return true;
  if (r < 9 && c > size - 9) return true;
  if (r > size - 9 && c < 9) return true;
  
  // Timing lines
  if (r === 6 || c === 6) return true;

  return false;
}
