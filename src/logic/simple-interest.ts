export interface SimpleInterestInputs {
  principal: number;
  rate: number;         // Annual rate %
  time: number;         // Tenure
  timeUnit: 'years' | 'months' | 'days';
}

export interface SimpleInterestResult {
  interest: number;
  totalValue: number;
}

export function calculateSimpleInterest({
  principal,
  rate,
  time,
  timeUnit,
}: SimpleInterestInputs): SimpleInterestResult {
  if (principal < 0 || rate < 0 || time <= 0) {
    throw new Error('Principal, rate, and time must be positive numbers.');
  }

  let tYears = time;
  if (timeUnit === 'months') {
    tYears = time / 12;
  } else if (timeUnit === 'days') {
    tYears = time / 365;
  }

  const interest = principal * (rate / 100) * tYears;
  const totalValue = principal + interest;

  return {
    interest: Math.round(interest * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
  };
}
