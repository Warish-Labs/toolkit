// Encoding & Decoding Core Algorithms

// ── Base32 Encoder / Decoder ──────────────────────────────────────────
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function stringToBase32(str: string): string {
  const enc = new TextEncoder();
  const bytes = enc.encode(str);
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += B32_ALPHABET[(value << (5 - bits)) & 31];
  }

  while (output.length % 8 !== 0) {
    output += '=';
  }

  return output;
}

export function base32ToString(b32: string): string {
  const clean = b32.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = B32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) throw new Error('Invalid Base32 character');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ── Hex Encoder / Decoder ─────────────────────────────────────────────
export function stringToHex(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToString(hex: string): string {
  const clean = hex.trim().replace(/[^a-fA-F0-9]/g, '');
  if (clean.length % 2 !== 0) throw new Error('Hex string must have an even length');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

// ── Binary Encoder / Decoder ──────────────────────────────────────────
export function stringToBinary(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
}

export function binaryToHtml(bin: string): string {
  const clean = bin.trim().replace(/[^01\s]/g, '');
  const parts = clean.split(/\s+/).filter(p => p);
  const bytes = new Uint8Array(parts.map(p => {
    if (p.length > 8) throw new Error('Binary segment exceeds 8 bits');
    return parseInt(p, 2);
  }));
  return new TextDecoder().decode(bytes);
}
