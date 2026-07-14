const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
  'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
  'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
  'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

const REVERSE_MORSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

export function textToMorse(text: string): string {
  const clean = text.toUpperCase().trim();
  if (!clean) return '';

  return clean
    .split('')
    .map(char => MORSE_MAP[char] || '?')
    .join(' ');
}

export function morseToText(morse: string): string {
  const clean = morse.trim();
  if (!clean) return '';

  const words = clean.split(/\s+\/\s+|\s{3,}/); // split by slash or 3+ spaces
  return words
    .map(word => {
      const chars = word.split(/\s+/);
      return chars
        .map(char => REVERSE_MORSE_MAP[char] || '?')
        .join('');
    })
    .join(' ');
}
