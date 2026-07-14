export interface CagrInputs {
  beginningValue: number;
  endingValue: number;
  years: number;
}

export function calculateCagr({
  beginningValue,
  endingValue,
  years,
}: CagrInputs): number {
  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) {
    throw new Error('Beginning value, ending value, and years must be positive values.');
  }

  // CAGR = (endingValue / beginningValue)^(1/years) - 1
  const cagr = Math.pow(endingValue / beginningValue, 1 / years) - 1;
  return Math.round(cagr * 10000) / 100; // Return percentage rounded to 2 decimals
}
