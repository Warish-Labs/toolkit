// Color Conversion & Analysis Logic

export interface Rgb { r: number; g: number; b: number }
export interface Hsl { h: number; s: number; l: number }
export interface Cmyk { c: number; m: number; y: number; k: number }

// ── Color Conversions ────────────────────────────────────────────────
export function hexToRgb(hex: string): Rgb {
  const clean = hex.trim().replace('#', '');
  const num = parseInt(clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (c: number) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function rgbToCmyk({ r, g, b }: Rgb): Cmyk {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);

  return { c, m, y, k: Math.round(k * 100) };
}

// ── WCAG Contrast & Luminance ────────────────────────────────────────
function getLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * getLuminance(r) + 0.7152 * getLuminance(g) + 0.0722 * getLuminance(b);
}

export function getContrastRatio(rgb1: Rgb, rgb2: Rgb): number {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

// ── Color Blindness Simulator ────────────────────────────────────────
export function simulateColorBlindness({ r, g, b }: Rgb, type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'): Rgb {
  // Simple matrix translations for color deficiency simulations
  if (type === 'protanopia') {
    return {
      r: Math.round(0.567 * r + 0.433 * g),
      g: Math.round(0.558 * r + 0.442 * g),
      b: Math.round(0.242 * g + 0.758 * b)
    };
  }
  if (type === 'deuteranopia') {
    return {
      r: Math.round(0.625 * r + 0.375 * g),
      g: Math.round(0.700 * r + 0.300 * g),
      b: Math.round(0.300 * g + 0.700 * b)
    };
  }
  if (type === 'tritanopia') {
    return {
      r: Math.round(0.95 * r + 0.05 * g),
      g: Math.round(0.433 * g + 0.567 * b),
      b: Math.round(0.475 * g + 0.525 * b)
    };
  }
  // Achromatopsia (Monochrome)
  const grey = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  return { r: grey, g: grey, b: grey };
}
