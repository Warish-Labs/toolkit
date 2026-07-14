export interface SipInputs {
  monthlyInvestment: number;
  returnRate: number; // expected annual return %
  years: number;
}

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
}

export function calculateSip({
  monthlyInvestment,
  returnRate,
  years,
}: SipInputs): SipResult {
  if (monthlyInvestment <= 0 || returnRate < 0 || years <= 0) {
    throw new Error('Monthly investment, expected return rate, and years must be positive.');
  }

  const months = years * 12;
  const i = returnRate / 12 / 100; // monthly rate

  let totalValue = 0;
  if (i > 0) {
    // SIP Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    totalValue = monthlyInvestment * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  } else {
    totalValue = monthlyInvestment * months;
  }

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = totalValue - investedAmount;

  return {
    investedAmount: Math.round(investedAmount * 100) / 100,
    estimatedReturns: Math.round(estimatedReturns * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
  };
}
