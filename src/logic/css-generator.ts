// CSS Generator Calculations

// ── Clamp Calculator ─────────────────────────────────────────────────
export interface ClampResult {
  clampExpression: string;
  explanation: string;
}

export function calculateClamp(
  minSizePx: number,
  maxSizePx: number,
  minWidthPx: number,
  maxWidthPx: number
): ClampResult {
  if (minWidthPx === maxWidthPx) {
    return {
      clampExpression: `clamp(${minSizePx}px, 1rem, ${maxSizePx}px)`,
      explanation: 'Min and max viewport widths cannot be equal.'
    };
  }

  // Convert pixels to rem (assuming 16px base)
  const minSizeRem = minSizePx / 16;
  const maxSizeRem = maxSizePx / 16;
  const minWidthRem = minWidthPx / 16;
  const maxWidthRem = maxWidthPx / 16;

  // Calculate slope and intersection
  const slope = (maxSizeRem - minSizeRem) / (maxWidthRem - minWidthRem);
  const intersection = minSizeRem - slope * minWidthRem;

  const preferredVal = `${intersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
  const clampExpression = `clamp(${minSizeRem}rem, ${preferredVal}, ${maxSizeRem}rem)`;
  
  const explanation = `At viewports below ${minWidthPx}px, the size is fixed at ${minSizePx}px (${minSizeRem}rem). Between ${minWidthPx}px and ${maxWidthPx}px, it scales dynamically. At viewports above ${maxWidthPx}px, it stops scaling at ${maxSizePx}px (${maxSizeRem}rem).`;

  return {
    clampExpression,
    explanation
  };
}

// ── Neumorphism Generator Helpers ────────────────────────────────────
export interface NeumorphismResult {
  boxShadow: string;
  background: string;
}

export function generateNeumorphicStyles(
  hexColor: string,
  distance: number,
  intensity: number, // 0.01 to 0.3
  blur: number,
  shape: 'flat' | 'concave' | 'convex' | 'pressed'
): NeumorphismResult {
  // Convert HEX color to RGB to calculate light/dark shades
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return { boxShadow: '', background: hexColor };
  }

  const { r, g, b } = rgb;

  // Derive light and dark shadows
  const darkR = Math.max(0, Math.round(r - (r * intensity)));
  const darkG = Math.max(0, Math.round(g - (g * intensity)));
  const darkB = Math.max(0, Math.round(b - (b * intensity)));

  const lightR = Math.min(255, Math.round(r + ((255 - r) * intensity)));
  const lightG = Math.min(255, Math.round(g + ((255 - g) * intensity)));
  const lightB = Math.min(255, Math.round(b + ((255 - b) * intensity)));

  const darkColor = `rgb(${darkR}, ${darkG}, ${darkB})`;
  const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;

  let boxShadow = '';
  let background = hexColor;

  if (shape === 'pressed') {
    boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else {
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  }

  if (shape === 'concave') {
    background = `linear-gradient(135deg, ${darkColor}, ${lightColor})`;
  } else if (shape === 'convex') {
    background = `linear-gradient(135deg, ${lightColor}, ${darkColor})`;
  }

  return { boxShadow, background };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return null;

  const hexVal = clean.length === 3 
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2] 
    : clean;

  const num = parseInt(hexVal, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}
