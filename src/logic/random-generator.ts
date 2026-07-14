export interface PasswordGenerationParams {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  avoidAmbiguous: boolean;
}

export interface NumberGenerationParams {
  min: number;
  max: number;
  count: number;
  unique: boolean;
}

export function generateRandomPassword(params: PasswordGenerationParams): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const ambiguous = 'iIl1oO0';

  let charSet = '';
  let requiredChars: string[] = [];

  const addChars = (source: string, flag: boolean) => {
    if (flag) {
      let filtered = source;
      if (params.avoidAmbiguous) {
        filtered = source.split('').filter(c => !ambiguous.includes(c)).join('');
      }
      charSet += filtered;
      // Add at least one character of this type to guarantee strength
      if (filtered.length > 0) {
        requiredChars.push(filtered.charAt(Math.floor(Math.random() * filtered.length)));
      }
    }
  };

  addChars(lowercase, params.useLowercase);
  addChars(uppercase, params.useUppercase);
  addChars(numbers, params.useNumbers);
  addChars(symbols, params.useSymbols);

  if (!charSet) {
    throw new Error('Please select at least one character set');
  }

  let result = [...requiredChars];
  const remainingCount = params.length - result.length;

  for (let i = 0; i < remainingCount; i++) {
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }

  // Shuffle the guaranteed list to distribute initial types randomly
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}

export function generateRandomNumbers(params: NumberGenerationParams): number[] {
  const { min, max, count, unique } = params;
  
  if (min > max) {
    throw new Error('Minimum value cannot be greater than maximum value');
  }

  const range = max - min + 1;
  if (unique && count > range) {
    throw new Error('Requested count of unique numbers exceeds the range bounds');
  }

  const results: number[] = [];

  if (unique) {
    const set = new Set<number>();
    while (set.size < count) {
      const num = Math.floor(Math.random() * range) + min;
      set.add(num);
    }
    results.push(...set);
  } else {
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * range) + min);
    }
  }

  return results;
}
