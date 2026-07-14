export interface AsciiRow {
  dec: number;
  hex: string;
  oct: string;
  char: string;
  desc: string;
}

export function getAsciiTable(): AsciiRow[] {
  const table: AsciiRow[] = [];
  
  // Control Characters (0-31)
  const controlDescriptions: Record<number, string> = {
    0: 'NUL (Null character)', 1: 'SOH (Start of Header)', 2: 'STX (Start of Text)',
    3: 'ETX (End of Text)', 4: 'EOT (End of Transmission)', 5: 'ENQ (Enquiry)',
    6: 'ACK (Acknowledgment)', 7: 'BEL (Bell)', 8: 'BS (Backspace)',
    9: 'HT (Horizontal Tab)', 10: 'LF (Line Feed / New Line)', 11: 'VT (Vertical Tab)',
    12: 'FF (Form Feed / New Page)', 13: 'CR (Carriage Return)', 14: 'SO (Shift Out)',
    15: 'SI (Shift In)', 16: 'DLE (Data Link Escape)', 17: 'DC1 (Device Control 1)',
    18: 'DC2 (Device Control 2)', 19: 'DC3 (Device Control 3)', 20: 'DC4 (Device Control 4)',
    21: 'NAK (Negative Acknowledgment)', 22: 'SYN (Synchronous Idle)',
    23: 'ETB (End of Trans. Block)', 24: 'CAN (Cancel)', 25: 'EM (End of Medium)',
    26: 'SUB (Substitute)', 27: 'ESC (Escape)', 28: 'FS (File Separator)',
    29: 'GS (Group Separator)', 30: 'RS (Record Separator)', 31: 'US (Unit Separator)'
  };

  for (let i = 0; i <= 127; i++) {
    let charDesc = String.fromCharCode(i);
    let name = charDesc;

    if (i < 32) {
      name = 'CTRL';
      charDesc = controlDescriptions[i] || 'Control';
    } else if (i === 32) {
      name = '[Space]';
      charDesc = 'Space';
    } else if (i === 127) {
      name = 'DEL';
      charDesc = 'DEL (Delete)';
    }

    table.push({
      dec: i,
      hex: i.toString(16).toUpperCase().padStart(2, '0'),
      oct: i.toString(8).padStart(3, '0'),
      char: name,
      desc: charDesc
    });
  }

  return table;
}

// ── ASCII Art Generator (Simple block banner font) ──────────────────
const BLOCK_FONT: Record<string, string[]> = {
  'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
  'B': ['█████ ', '██  ██', '█████ ', '██  ██', '█████ '],
  'C': [' ████ ', '██    ', '██    ', '██    ', ' ████ '],
  'D': ['████  ', '██  ██', '██  ██', '██  ██', '████  '],
  'E': ['██████', '██    ', '████  ', '██    ', '██████'],
  'F': ['██████', '██    ', '████  ', '██    ', '██    '],
  'G': [' ████ ', '██    ', '██ ███', '██  ██', ' ████ '],
  'H': ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
  'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '██████'],
  'J': ['██████', '    ██', '    ██', '██  ██', ' ████ '],
  'K': ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██'],
  'L': ['██    ', '██    ', '██    ', '██    ', '██████'],
  'M': ['██  ██', '██████', '██████', '██  ██', '██  ██'],
  'N': ['██  ██', '████ ██', '██ ████', '██  ███', '██  ██'],
  'O': [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
  'P': ['█████ ', '██  ██', '█████ ', '██    ', '██    '],
  'Q': [' ████ ', '██  ██', '██  ██', '██ ██ ', ' █████'],
  'R': ['█████ ', '██  ██', '█████ ', '██ ██ ', '██  ██'],
  'S': [' ████ ', '██    ', ' ████ ', '    ██', '█████ '],
  'T': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
  'U': ['██  ██', '██  ██', '██  ██', '██  ██', ' ████ '],
  'V': ['██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
  'W': ['██  ██', '██  ██', '██████', '██████', '██  ██'],
  'X': ['██  ██', ' ████ ', '  ██  ', ' ████ ', '██  ██'],
  'Y': ['██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  '],
  'Z': ['██████', '   ██ ', '  ██  ', ' ██   ', '██████'],
  ' ': ['      ', '      ', '      ', '      ', '      '],
  '0': [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
  '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '██████'],
  '2': [' ████ ', '██  ██', '  ███ ', ' ██   ', '██████'],
  '3': ['██████', '   ██ ', ' ████ ', '   ██ ', '██████'],
  '4': ['██  ██', '██  ██', '██████', '    ██', '    ██'],
  '5': ['██████', '██    ', '█████ ', '    ██', '██████'],
  '6': [' ████ ', '██    ', '█████ ', '██  ██', ' ████ '],
  '7': ['██████', '   ██ ', '  ██  ', ' ██   ', '██    '],
  '8': [' ████ ', '██  ██', ' ████ ', '██  ██', ' ████ '],
  '9': [' ████ ', '██  ██', ' █████', '    ██', ' ████ '],
  '!': ['  ██  ', '  ██  ', '  ██  ', '      ', '  ██  '],
  '?': [' ████ ', '    ██', '  ███ ', '      ', '  ██  '],
  '-': ['      ', '      ', '██████', '      ', '      '],
  '+': ['  ██  ', '  ██  ', '██████', '  ██  ', '  ██  ']
};

export function generateAsciiArt(text: string): string {
  const clean = text.toUpperCase();
  if (!clean) return '';

  const lines = ['', '', '', '', ''];

  for (const char of clean) {
    const glyph = BLOCK_FONT[char] || BLOCK_FONT[' '];
    for (let r = 0; r < 5; r++) {
      lines[r] += glyph[r] + '  '; // Append character with spacing
    }
  }

  return lines.join('\n');
}
