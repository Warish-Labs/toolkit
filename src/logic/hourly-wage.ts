export interface HourlyWageInputs {
  hourlyRate: number;
  hoursPerWeek: number;
  overtimeHours?: number;
  overtimeMultiplier?: number; // e.g. 1.5
  unpaidWeeksOff?: number;      // e.g. 2
}

export interface HourlyWageResult {
  standardWeeklyPay: number;
  overtimeWeeklyPay: number;
  totalWeeklyPay: number;
  monthlyPay: number;
  annualPay: number;
}

export function calculateHourlyWage({
  hourlyRate,
  hoursPerWeek,
  overtimeHours = 0,
  overtimeMultiplier = 1.5,
  unpaidWeeksOff = 0,
}: HourlyWageInputs): HourlyWageResult {
  if (hourlyRate < 0 || hoursPerWeek < 0 || overtimeHours < 0 || overtimeMultiplier < 0 || unpaidWeeksOff < 0) {
    throw new Error('All inputs must be non-negative.');
  }

  const standardWeeklyPay = hourlyRate * hoursPerWeek;
  const overtimeWeeklyPay = hourlyRate * overtimeMultiplier * overtimeHours;
  const totalWeeklyPay = standardWeeklyPay + overtimeWeeklyPay;

  const paidWeeks = Math.max(0, 52 - unpaidWeeksOff);
  const annualPay = totalWeeklyPay * paidWeeks;
  const monthlyPay = annualPay / 12;

  return {
    standardWeeklyPay: Math.round(standardWeeklyPay * 100) / 100,
    overtimeWeeklyPay: Math.round(overtimeWeeklyPay * 100) / 100,
    totalWeeklyPay: Math.round(totalWeeklyPay * 100) / 100,
    monthlyPay: Math.round(monthlyPay * 100) / 100,
    annualPay: Math.round(annualPay * 100) / 100,
  };
}
