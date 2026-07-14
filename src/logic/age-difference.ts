import { calculateDateDifference, type DateDiffResult } from './date-difference';

export interface AgeDifferenceResult {
  person1Age: DateDiffResult;
  person2Age: DateDiffResult;
  difference: DateDiffResult;
  olderPerson: 'Person 1' | 'Person 2' | 'None';
  olderPersonLabel: string;
}

export function calculateAgeDifference(dob1: Date, dob2: Date): AgeDifferenceResult {
  const today = new Date();
  
  const person1Age = calculateDateDifference(dob1, today);
  const person2Age = calculateDateDifference(dob2, today);
  
  const diff = calculateDateDifference(dob1, dob2);

  const t1 = dob1.getTime();
  const t2 = dob2.getTime();

  let olderPerson: AgeDifferenceResult['olderPerson'] = 'None';
  let olderPersonLabel = 'Both are the exact same age.';

  if (t1 < t2) {
    olderPerson = 'Person 1';
    olderPersonLabel = `Person 1 is older than Person 2 by ${diff.years} years, ${diff.months} months, and ${diff.days} days.`;
  } else if (t2 < t1) {
    olderPerson = 'Person 2';
    olderPersonLabel = `Person 2 is older than Person 1 by ${diff.years} years, ${diff.months} months, and ${diff.days} days.`;
  }

  return {
    person1Age,
    person2Age,
    difference: diff,
    olderPerson,
    olderPersonLabel,
  };
}
