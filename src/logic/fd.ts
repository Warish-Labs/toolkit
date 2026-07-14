export interface FdInputs {
  principal: number;
  interestRate: number; // annual rate %
  tenure: number;       // tenure value
  tenureType: 'years' | 'months';
}

export interface FdResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculateFd({
  principal,
  interestRate,
  tenure,
  tenureType,
}: FdInputs): FdResult {
  if (principal <= 0 || interestRate < 0 || tenure <= 0) {
    throw new Error('Principal, interest rate, and tenure must be positive.');
  }

  const years = tenureType === 'years' ? tenure : tenure / 12;
  const r = interestRate / 100;
  const compoundFrequency = 4; // Quarterly compounding is standard for FDs

  // Formula: A = P * (1 + r/n)^(n*t)
  const maturityAmount = principal * Math.pow(1 + r / compoundFrequency, compoundFrequency * years);
  const interestEarned = maturityAmount - principal;

  return {
    investedAmount: Math.round(principal * 100) / 100,
    interestEarned: Math.round(interestEarned * 100) / 100,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
  };
}
