export type ContributionFrequency = 'weekly' | 'monthly' | 'annually';

export interface InvestmentInputs {
  startingAmount: number;
  contribution: number;
  frequency: ContributionFrequency;
  returnRate: number;      // Annual percentage rate %
  years: number;
}

export interface InvestmentResult {
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

export function calculateInvestment({
  startingAmount,
  contribution,
  frequency,
  returnRate,
  years,
}: InvestmentInputs): InvestmentResult {
  if (startingAmount < 0 || contribution < 0 || returnRate < 0 || years <= 0) {
    throw new Error('All input values must be positive, and years must be at least 1.');
  }

  const r = returnRate / 100;
  let balance = startingAmount;
  let totalContributions = startingAmount;
  const yearlyBreakdown: InvestmentResult['yearlyBreakdown'] = [];

  let periodsPerYear = 12; // default monthly
  let contributionPerPeriod = contribution;

  if (frequency === 'weekly') {
    periodsPerYear = 52;
  } else if (frequency === 'annually') {
    periodsPerYear = 1;
  }

  const totalPeriods = years * periodsPerYear;
  const ratePerPeriod = r / periodsPerYear;

  for (let period = 1; period <= totalPeriods; period++) {
    // Apply interest first
    const interest = balance * ratePerPeriod;
    balance += interest;
    
    // Add contribution
    balance += contributionPerPeriod;
    totalContributions += contributionPerPeriod;

    // Year end check
    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
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
