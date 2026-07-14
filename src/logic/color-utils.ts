export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
}

export function parseHex(hex: string): ColorFormats {
  let clean = hex.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }

  if (clean.length !== 6) {
    throw new Error('Invalid HEX color length');
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid HEX color characters');
  }

  return formatAll(r, g, b);
}

export function parseRgb(rgbStr: string): ColorFormats {
  const match = rgbStr.match(/\d+/g);
  if (!match || match.length < 3) {
    throw new Error('Invalid RGB format. Use rgb(r, g, b)');
  }

  const r = Math.max(0, Math.min(255, parseInt(match[0], 10)));
  const g = Math.max(0, Math.min(255, parseInt(match[1], 10)));
  const b = Math.max(0, Math.min(255, parseInt(match[2], 10)));

  return formatAll(r, g, b);
}

export function parseHsl(hslStr: string): ColorFormats {
  const match = hslStr.match(/\d+/g);
  if (!match || match.length < 3) {
    throw new Error('Invalid HSL format. Use hsl(h, s%, l%)');
  }

  const h = Math.max(0, Math.min(360, parseInt(match[0], 10)));
  const s = Math.max(0, Math.min(100, parseInt(match[1], 10))) / 100;
  const l = Math.max(0, Math.min(100, parseInt(match[2], 10))) / 100;

  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rVal = 0, gVal = 0, bVal = 0;
  if (h >= 0 && h < 60) { rVal = c; gVal = x; }
  else if (h >= 60 && h < 120) { rVal = x; gVal = c; }
  else if (h >= 120 && h < 180) { gVal = c; bVal = x; }
  else if (h >= 180 && h < 240) { gVal = x; bVal = c; }
  else if (h >= 240 && h < 300) { rVal = x; bVal = c; }
  else if (h >= 300 && h <= 360) { rVal = c; bVal = x; }

  const r = Math.round((rVal + m) * 255);
  const g = Math.round((gVal + m) * 255);
  const b = Math.round((bVal + m) * 255);

  return formatAll(r, g, b);
}

export function generatePalette(hex: string, mode: 'analogous' | 'monochromatic' | 'triad' | 'complementary'): string[] {
  const base = parseHex(hex);
  const hslMatch = base.hsl.match(/\d+/g);
  if (!hslMatch) return [hex];

  const h = parseInt(hslMatch[0], 10);
  const s = parseInt(hslMatch[1], 10);
  const l = parseInt(hslMatch[2], 10);

  const colors: string[] = [];

  switch (mode) {
    case 'complementary':
      colors.push(base.hex);
      colors.push(hslToHex((h + 180) % 360, s, l));
      colors.push(hslToHex(h, s, Math.max(10, l - 20)));
      colors.push(hslToHex((h + 180) % 360, s, Math.max(10, l - 20)));
      colors.push(hslToHex(h, s, Math.min(90, l + 20)));
      break;

    case 'analogous':
      colors.push(hslToHex((h + 330) % 360, s, l));
      colors.push(hslToHex((h + 345) % 360, s, l));
      colors.push(base.hex);
      colors.push(hslToHex((h + 15) % 360, s, l));
      colors.push(hslToHex((h + 30) % 360, s, l));
      break;

    case 'triad':
      colors.push(base.hex);
      colors.push(hslToHex((h + 120) % 360, s, l));
      colors.push(hslToHex((h + 240) % 360, s, l));
      colors.push(hslToHex(h, s, Math.max(10, l - 15)));
      colors.push(hslToHex((h + 120) % 360, s, Math.max(10, l - 15)));
      break;

    case 'monochromatic':
      colors.push(hslToHex(h, s, Math.max(10, l - 30)));
      colors.push(hslToHex(h, s, Math.max(10, l - 15)));
      colors.push(base.hex);
      colors.push(hslToHex(h, s, Math.min(90, l + 15)));
      colors.push(hslToHex(h, s, Math.min(90, l + 30)));
      break;
  }

  return colors;
}

function formatAll(r: number, g: number, b: number): ColorFormats {
  const hexVal = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  const rgbVal = `rgb(${r}, ${g}, ${b})`;
  
  // RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  const hslVal = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  return { hex: hexVal, rgb: rgbVal, hsl: hslVal };
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rVal = 0, gVal = 0, bVal = 0;
  if (h >= 0 && h < 60) { rVal = c; gVal = x; }
  else if (h >= 60 && h < 120) { rVal = x; gVal = c; }
  else if (h >= 120 && h < 180) { gVal = c; bVal = x; }
  else if (h >= 180 && h < 240) { gVal = x; bVal = c; }
  else if (h >= 240 && h < 300) { rVal = x; bVal = c; }
  else if (h >= 300 && h <= 360) { rVal = c; bVal = x; }

  const r = Math.round((rVal + m) * 255);
  const g = Math.round((gVal + m) * 255);
  const b = Math.round((bVal + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
