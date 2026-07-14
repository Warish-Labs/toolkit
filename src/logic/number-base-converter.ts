export interface BaseConversionResult {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
  custom?: string;
  isValid: boolean;
  error?: string;
}

export function convertNumberBase(
  value: string,
  fromBase: number,
  toBase?: number
): BaseConversionResult {
  const cleanValue = value.trim();
  if (!cleanValue) {
    return { binary: '', octal: '', decimal: '', hexadecimal: '', isValid: false, error: 'Input is empty' };
  }

  try {
    // Parse value to base 10 integer
    const parsedInt = parseInt(cleanValue, fromBase);
    if (isNaN(parsedInt)) {
      throw new Error(`Invalid characters for base ${fromBase}`);
    }

    // Double check that every character belongs to the base alphabet
    const maxCharVal = fromBase - 1;
    const baseAlphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (const char of cleanValue.toLowerCase()) {
      const idx = baseAlphabet.indexOf(char);
      if (idx === -1 || idx > maxCharVal) {
        throw new Error(`Character "${char}" is not valid in base ${fromBase}`);
      }
    }

    const binary = parsedInt.toString(2);
    const octal = parsedInt.toString(8);
    const decimal = parsedInt.toString(10);
    const hexadecimal = parsedInt.toString(16).toUpperCase();

    let custom;
    if (toBase !== undefined && toBase >= 2 && toBase <= 36) {
      custom = parsedInt.toString(toBase).toUpperCase();
    }

    return {
      binary,
      octal,
      decimal,
      hexadecimal,
      custom,
      isValid: true
    };
  } catch (e) {
    return {
      binary: '',
      octal: '',
      decimal: '',
      hexadecimal: '',
      isValid: false,
      error: e instanceof Error ? e.message : 'Invalid input for selected base'
    };
  }
}
