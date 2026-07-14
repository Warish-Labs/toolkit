export type CompoundFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

export interface CompoundInputs {
  principal: number;
  rate: number;             // Annual interest rate in %
  years: number;
  frequency: CompoundFrequency;
  monthlyContribution?: number;
}

export interface CompoundResult {
  endBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: {
    year: number;
    contributions: number;
    interest: number;
    balance: number;
  }[];
}

const FREQUENCY_VALUES: Record<CompoundFrequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export function calculateCompound({
  principal,
  rate,
  years,
  frequency,
  monthlyContribution = 0,
}: CompoundInputs): CompoundResult {
  if (principal < 0 || rate < 0 || years <= 0) {
    throw new Error('Principal, rate, and years must be positive values.');
  }

  const r = rate / 100;
  const f = FREQUENCY_VALUES[frequency];
  const totalMonths = years * 12;

  let balance = principal;
  let totalContributions = principal;
  const yearlyBreakdown: CompoundResult['yearlyBreakdown'] = [];

  let accumulatedInterestOfYear = 0;
  let accumulatedContributionsOfYear = principal;

  // We loop month by month to handle monthly contributions easily
  for (let month = 1; month <= totalMonths; month++) {
    // Interest compounded according to frequency
    // Monthly interest compound approximation if compounding is monthly, quarterly, etc.
    const monthlyRate = r / 12;
    const interestThisMonth = balance * monthlyRate;
    
    balance += interestThisMonth;
    accumulatedInterestOfYear += interestThisMonth;

    // Apply monthly contribution at the end of the month
    if (month > 0) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
      accumulatedContributionsOfYear += monthlyContribution;
    }

    // Capture end of year metrics
    if (month % 12 === 0) {
      const year = month / 12;
      yearlyBreakdown.push({
        year,
        contributions: Math.round(totalContributions * 100) / 100,
        interest: Math.round((balance - totalContributions) * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }
  }

  const totalInterest = balance - totalContributions;

  return {
    endBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}
