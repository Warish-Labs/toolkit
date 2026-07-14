export type InflationMode = 'past' | 'future';

export interface InflationInputs {
  amount: number;
  rate: number; // average annual inflation rate %
  years: number;
  mode: InflationMode;
}

export interface InflationResult {
  adjustedAmount: number;
  cumulativeInflation: number;
  purchasingPowerLoss: number; // in %
}

export function calculateInflation({
  amount,
  rate,
  years,
  mode,
}: InflationInputs): InflationResult {
  if (amount < 0 || rate < 0 || years <= 0) {
    throw new Error('Amount, rate, and years must be positive values.');
  }

  const r = rate / 100;
  let adjustedAmount = 0;
  
  if (mode === 'future') {
    // FV = PV * (1 + r)^t
    adjustedAmount = amount * Math.pow(1 + r, years);
  } else {
    // PV = FV / (1 + r)^t
    adjustedAmount = amount / Math.pow(1 + r, years);
  }

  const cumulativeMultiplier = Math.pow(1 + r, years);
  const cumulativeInflation = (cumulativeMultiplier - 1) * 100;

  // Purchasing power of 1 unit decreases by: 1 - 1 / (1 + r)^t
  const purchasingPowerLoss = (1 - (1 / cumulativeMultiplier)) * 100;

  return {
    adjustedAmount: Math.round(adjustedAmount * 100) / 100,
    cumulativeInflation: Math.round(cumulativeInflation * 100) / 100,
    purchasingPowerLoss: Math.round(purchasingPowerLoss * 100) / 100,
  };
}
