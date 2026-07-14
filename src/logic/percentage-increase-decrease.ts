export type PercentOp = 'increase' | 'decrease' | 'difference';

export interface PercentChangeResult {
  result: number;
  explanation: string;
}

export function calculatePercentChange(
  op: PercentOp,
  val1: number,
  val2: number
): PercentChangeResult {
  if (isNaN(val1) || isNaN(val2)) {
    throw new Error('Please enter valid numeric inputs.');
  }

  let result = 0;
  let explanation = '';

  switch (op) {
    case 'increase':
      // val1 is percentage, val2 is base value
      // base + (base * (percent/100))
      result = val2 + (val2 * (val1 / 100));
      explanation = `${val2} increased by ${val1}% is: ${val2} + (${val2} × ${val1} / 100) = ${result.toFixed(2)}`;
      break;

    case 'decrease':
      // val1 is percentage, val2 is base value
      // base - (base * (percent/100))
      result = val2 - (val2 * (val1 / 100));
      explanation = `${val2} decreased by ${val1}% is: ${val2} - (${val2} × ${val1} / 100) = ${result.toFixed(2)}`;
      break;

    case 'difference':
      // percent difference/change from val1 to val2
      // ((val2 - val1) / val1) * 100
      if (val1 === 0) {
        throw new Error('Starting value cannot be zero when calculating percentage difference.');
      }
      const diff = val2 - val1;
      result = (diff / Math.abs(val1)) * 100;
      const type = result >= 0 ? 'increase' : 'decrease';
      explanation = `Percentage change from ${val1} to ${val2} is: ((${val2} - ${val1}) / |${val1}|) × 100 = ${result.toFixed(2)}% (${type})`;
      break;
  }

  return {
    result: Math.round(result * 100) / 100,
    explanation,
  };
}
