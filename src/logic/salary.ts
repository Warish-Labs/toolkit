export type PayPeriod = 'hourly' | 'daily' | 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' | 'annually';

export interface SalaryInputs {
  amount: number;
  period: PayPeriod;
  hoursPerWeek?: number;
  daysPerWeek?: number;
}

export interface SalaryBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  semimonthly: number;
  monthly: number;
  annually: number;
}

export function calculateSalary({
  amount,
  period,
  hoursPerWeek = 40,
  daysPerWeek = 5,
}: SalaryInputs): SalaryBreakdown {
  if (amount < 0 || hoursPerWeek <= 0 || daysPerWeek <= 0) {
    throw new Error('All input values must be positive.');
  }

  // Convert everything to annual salary first
  let annual = 0;
  const weeksPerYear = 52;
  const hoursPerYear = hoursPerWeek * weeksPerYear;
  const daysPerYear = daysPerWeek * weeksPerYear;

  switch (period) {
    case 'hourly':
      annual = amount * hoursPerYear;
      break;
    case 'daily':
      annual = amount * daysPerYear;
      break;
    case 'weekly':
      annual = amount * weeksPerYear;
      break;
    case 'bi-weekly':
      annual = amount * 26;
      break;
    case 'semi-monthly':
      annual = amount * 24;
      break;
    case 'monthly':
      annual = amount * 12;
      break;
    case 'annually':
      annual = amount;
      break;
  }

  return {
    hourly: Math.round((annual / hoursPerYear) * 100) / 100,
    daily: Math.round((annual / daysPerYear) * 100) / 100,
    weekly: Math.round((annual / weeksPerYear) * 100) / 100,
    biweekly: Math.round((annual / 26) * 100) / 100,
    semimonthly: Math.round((annual / 24) * 100) / 100,
    monthly: Math.round((annual / 12) * 100) / 100,
    annually: Math.round(annual * 100) / 100,
  };
}
