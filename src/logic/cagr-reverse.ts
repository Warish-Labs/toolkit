export interface CagrReverseInputs {
  beginningValue: number;
  cagr: number; // percentage
  years: number;
}

export interface CagrReverseResult {
  endingValue: number;
  totalGain: number;
}

export function calculateCagrReverse({
  beginningValue,
  cagr,
  years,
}: CagrReverseInputs): CagrReverseResult {
  if (beginningValue <= 0 || years <= 0) {
    throw new Error('Beginning value and years must be positive values.');
  }

  const r = cagr / 100;
  // FV = PV * (1 + r)^t
  const endingValue = beginningValue * Math.pow(1 + r, years);
  const totalGain = endingValue - beginningValue;

  return {
    endingValue: Math.round(endingValue * 100) / 100,
    totalGain: Math.round(totalGain * 100) / 100,
  };
}
