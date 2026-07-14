export interface RomanConversionResult {
  roman: string;
  decimal: number;
  isValid: boolean;
  error?: string;
}

const ROMAN_MAP: { val: number; char: string }[] = [
  { val: 1000, char: 'M' },
  { val: 900, char: 'CM' },
  { val: 500, char: 'D' },
  { val: 400, char: 'CD' },
  { val: 100, char: 'C' },
  { val: 90, char: 'XC' },
  { val: 50, char: 'L' },
  { val: 40, char: 'XL' },
  { val: 10, char: 'X' },
  { val: 9, char: 'IX' },
  { val: 5, char: 'V' },
  { val: 4, char: 'IV' },
  { val: 1, char: 'I' }
];

export function decimalToRoman(num: number): RomanConversionResult {
  if (isNaN(num) || num <= 0 || num > 3999 || !Number.isInteger(num)) {
    return {
      roman: '',
      decimal: 0,
      isValid: false,
      error: 'Roman numerals only support integers from 1 to 3999.'
    };
  }

  let temp = num;
  let roman = '';

  for (const item of ROMAN_MAP) {
    while (temp >= item.val) {
      roman += item.char;
      temp -= item.val;
    }
  }

  return {
    roman,
    decimal: num,
    isValid: true
  };
}

export function romanToDecimal(romanStr: string): RomanConversionResult {
  const clean = romanStr.trim().toUpperCase();
  if (!clean) {
    return { roman: '', decimal: 0, isValid: false, error: 'Input is empty' };
  }

  const values: Record<string, number> = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
  };

  let decimal = 0;
  
  for (let i = 0; i < clean.length; i++) {
    const current = values[clean[i]];
    const next = values[clean[i + 1]];

    if (current === undefined) {
      return {
        roman: '',
        decimal: 0,
        isValid: false,
        error: `Invalid Roman numeral character: "${clean[i]}"`
      };
    }

    if (next !== undefined && current < next) {
      decimal += (next - current);
      i++; // skip next char
    } else {
      decimal += current;
    }
  }

  // Validate that converting this decimal back produces the exact same Roman numeral (validates structure/order)
  const validation = decimalToRoman(decimal);
  if (!validation.isValid || validation.roman !== clean) {
    return {
      roman: '',
      decimal: 0,
      isValid: false,
      error: 'Invalid Roman numeral structure.'
    };
  }

  return {
    roman: clean,
    decimal,
    isValid: true
  };
}
