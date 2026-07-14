export interface LeapYearResult {
  isLeap: boolean;
  reason: string;
}

export function checkLeapYear(year: number): LeapYearResult {
  if (isNaN(year) || year < 0) {
    throw new Error('Please enter a valid positive year.');
  }

  // A year is a leap year if it is divisible by 4,
  // except for years that are divisible by 100,
  // unless they are also divisible by 400.
  const divBy4 = year % 4 === 0;
  const divBy100 = year % 100 === 0;
  const divBy400 = year % 400 === 0;

  let isLeap = false;
  let reason = '';

  if (divBy4) {
    if (divBy100) {
      if (divBy400) {
        isLeap = true;
        reason = `${year} is divisible by 400, so it is a leap year.`;
      } else {
        isLeap = false;
        reason = `${year} is divisible by 4 and 100 but not 400, so it is NOT a leap year.`;
      }
    } else {
      isLeap = true;
      reason = `${year} is divisible by 4 but not by 100, so it is a leap year.`;
    }
  } else {
    isLeap = false;
    reason = `${year} is not divisible by 4, so it is NOT a leap year.`;
  }

  return { isLeap, reason };
}
