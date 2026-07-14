export interface RoiInputs {
  amountInvested: number;
  amountReturned: number;
  years?: number;
}

export interface RoiResult {
  gain: number;
  roi: number; // percentage
  annualizedRoi?: number; // percentage
}

export function calculateRoi({
  amountInvested,
  amountReturned,
  years,
}: RoiInputs): RoiResult {
  if (amountInvested <= 0) {
    throw new Error('Amount invested must be a positive number.');
  }

  const gain = amountReturned - amountInvested;
  const roi = (gain / amountInvested) * 100;

  let annualizedRoi: number | undefined = undefined;
  if (years && years > 0) {
    // Annualized ROI = ((Returned / Invested) ^ (1 / years) - 1) * 100
    annualizedRoi = (Math.pow(amountReturned / amountInvested, 1 / years) - 1) * 100;
  }

  return {
    gain: Math.round(gain * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    annualizedRoi: annualizedRoi !== undefined ? Math.round(annualizedRoi * 100) / 100 : undefined,
  };
}
