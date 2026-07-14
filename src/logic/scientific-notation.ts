export interface ScientificNotationResult {
  scientific: string; // 1.25 × 10^5
  eNotation: string;  // 1.25e+5
  decimal: string;    // 125000
  isValid: boolean;
  error?: string;
}

export function toScientificNotation(decimalValue: string): ScientificNotationResult {
  const clean = decimalValue.trim();
  if (!clean) {
    return { scientific: '', eNotation: '', decimal: '', isValid: false, error: 'Input is empty' };
  }

  const num = Number(clean);
  if (isNaN(num)) {
    return { scientific: '', eNotation: '', decimal: '', isValid: false, error: 'Invalid decimal number' };
  }

  try {
    const eNotation = num.toExponential();
    const [coefficient, exponent] = eNotation.split('e');
    const expNum = parseInt(exponent, 10);
    
    // Format scientific string nicely
    const scientific = `${coefficient} × 10^${expNum}`;

    return {
      scientific,
      eNotation,
      decimal: num.toString(),
      isValid: true
    };
  } catch (e) {
    return { scientific: '', eNotation: '', decimal: '', isValid: false, error: 'Failed to convert' };
  }
}

export function fromScientificNotation(scientificStr: string): ScientificNotationResult {
  const clean = scientificStr.trim().toLowerCase();
  if (!clean) {
    return { scientific: '', eNotation: '', decimal: '', isValid: false, error: 'Input is empty' };
  }

  try {
    let parsedNum = 0;

    // Handle E-notation format (e.g. 1.25e5)
    if (clean.includes('e')) {
      parsedNum = Number(clean);
    } else if (clean.includes('10^') || clean.includes('10**')) {
      // Handle scientific multiplication syntax: e.g. "1.25 * 10^5" or "1.25 x 10^5" or "1.25 × 10^5"
      const match = clean.match(/([0-9.-]+)\s*(?:x|\*|×)\s*10\s*(?:\^|\*\*)\s*([0-9-]+)/);
      if (!match) {
        throw new Error('Could not parse scientific format. Use: 1.25 x 10^5');
      }
      const coefficient = parseFloat(match[1]);
      const exponent = parseInt(match[2], 10);
      parsedNum = coefficient * Math.pow(10, exponent);
    } else {
      // Try parsing direct coefficient (e.g. "1.25")
      parsedNum = parseFloat(clean);
    }

    if (isNaN(parsedNum)) {
      throw new Error('Invalid number result');
    }

    const eNotation = parsedNum.toExponential();
    const [coefficient, exponent] = eNotation.split('e');
    const expNum = parseInt(exponent, 10);
    const scientific = `${coefficient} × 10^${expNum}`;

    return {
      scientific,
      eNotation,
      decimal: parsedNum.toString(),
      isValid: true
    };
  } catch (e) {
    return {
      scientific: '',
      eNotation: '',
      decimal: '',
      isValid: false,
      error: e instanceof Error ? e.message : 'Invalid scientific notation format'
    };
  }
}
