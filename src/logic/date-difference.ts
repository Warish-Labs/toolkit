export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
}

export function calculateDateDifference(
  startDate: Date,
  endDate: Date,
  includeEndDate = false
): DateDiffResult {
  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start.getTime() > end.getTime()) {
    // Swap if start is after end
    const temp = start;
    start = end;
    end = temp;
  }

  // Adjust for including the end date
  if (includeEndDate) {
    end.setDate(end.getDate() + 1);
  }

  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();

  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  const endDay = end.getDate();

  let years = endYear - startYear;
  let months = endMonth - startMonth;
  let days = endDay - startDay;

  if (days < 0) {
    months--;
    // Get days in the previous month of end date
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Total absolute differences
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  // Total months calculation
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
  };
}
