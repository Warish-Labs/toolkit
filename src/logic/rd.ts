export interface RdInputs {
  monthlyDeposit: number;
  interestRate: number; // annual rate %
  tenure: number;       // tenure value
  tenureType: 'years' | 'months';
}

export interface RdResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculateRd({
  monthlyDeposit,
  interestRate,
  tenure,
  tenureType,
}: RdInputs): RdResult {
  if (monthlyDeposit <= 0 || interestRate < 0 || tenure <= 0) {
    throw new Error('Monthly deposit, interest rate, and tenure must be positive values.');
  }

  const months = tenureType === 'years' ? tenure * 12 : tenure;
  const r = interestRate / 100;
  const monthlyRate = r / 12;

  let balance = 0;
  let totalInvested = 0;
  let accumulatedInterest = 0;

  for (let m = 1; m <= months; m++) {
    balance += monthlyDeposit;
    totalInvested += monthlyDeposit;

    // Standard interest calculation for this month
    const interestThisMonth = balance * monthlyRate;
    accumulatedInterest += interestThisMonth;

    // Compound quarterly: Add accumulated interest to principal balance every 3 months
    if (m % 3 === 0 || m === months) {
      balance += accumulatedInterest;
      accumulatedInterest = 0;
    }
  }

  return {
    investedAmount: Math.round(totalInvested * 100) / 100,
    interestEarned: Math.round((balance - totalInvested) * 100) / 100,
    maturityAmount: Math.round(balance * 100) / 100,
  };
}
