export interface WeekNumberResult {
  weekNumber: number;
  year: number;
  dayOfYear: number;
  dayOfWeekName: string;
}

export function calculateWeekNumber(date: Date): WeekNumberResult {
  const target = new Date(date.valueOf());

  // ISO week date week number:
  // 1. Set to Thursday of the current week
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);

  // 2. Get first Thursday of the year
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }

  // 3. Count weeks between first Thursday and current Thursday
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

  // Day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekName = daysOfWeek[date.getDay()];

  return {
    weekNumber,
    year: new Date(firstThursday).getFullYear(),
    dayOfYear,
    dayOfWeekName,
  };
}
