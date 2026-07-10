export type PercentageMode = 'whatIsXPercentOfY' | 'xIsWhatPercentOfY' | 'percentageChange';

export interface PercentageResult {
  result: number;
  formula: string;
}

export function calculatePercentage(mode: PercentageMode, value1: number, value2: number): PercentageResult {
  switch (mode) {
    case 'whatIsXPercentOfY': {
      const result = (value1 / 100) * value2;
      return { result: Math.round(result * 100) / 100, formula: `${value1}% of ${value2} = ${Math.round(result * 100) / 100}` };
    }
    case 'xIsWhatPercentOfY': {
      if (value2 === 0) throw new Error('Cannot divide by zero');
      const result = (value1 / value2) * 100;
      return { result: Math.round(result * 100) / 100, formula: `${value1} is ${Math.round(result * 100) / 100}% of ${value2}` };
    }
    case 'percentageChange': {
      if (value1 === 0) throw new Error('Original value cannot be zero');
      const result = ((value2 - value1) / value1) * 100;
      return { result: Math.round(result * 100) / 100, formula: `Change from ${value1} to ${value2} = ${Math.round(result * 100) / 100}%` };
    }
  }
}
