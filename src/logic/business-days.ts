export interface BusinessDaysInputs {
  startDate: Date;
  daysToAdjust?: number;  // If provided, we add/subtract business days
  endDate?: Date;         // If provided, we compute business days between start and end
  weekendDays?: number[]; // default [0, 6] (Saturday & Sunday)
  holidays?: string[];    // list of ISO dates "YYYY-MM-DD"
}

export interface BusinessDaysResult {
  calculatedDate?: Date;    // For add/subtract mode
  businessDaysCount?: number; // For diff mode
  weekendDaysCount?: number;
  holidaysCount?: number;
  totalDaysCount?: number;
}

export function adjustBusinessDays({
  startDate,
  daysToAdjust = 0,
  weekendDays = [0, 6],
  holidays = [],
}: {
  startDate: Date;
  daysToAdjust: number;
  weekendDays?: number[];
  holidays?: string[];
}): Date {
  const result = new Date(startDate);
  result.setHours(0, 0, 0, 0);

  const holidayTimes = new Set(
    holidays.map((h) => {
      const d = new Date(h);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let remainingDays = Math.abs(daysToAdjust);
  const direction = daysToAdjust >= 0 ? 1 : -1;

  while (remainingDays > 0) {
    result.setDate(result.getDate() + direction);
    const dayOfWeek = result.getDay();
    const isWeekend = weekendDays.includes(dayOfWeek);
    const isHoliday = holidayTimes.has(result.getTime());

    if (!isWeekend && !isHoliday) {
      remainingDays--;
    }
  }

  return result;
}

export function calculateBusinessDaysDiff({
  startDate,
  endDate,
  weekendDays = [0, 6],
  holidays = [],
}: {
  startDate: Date;
  endDate: Date;
  weekendDays?: number[];
  holidays?: string[];
}): BusinessDaysResult {
  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start.getTime() > end.getTime()) {
    const temp = start;
    start = end;
    end = temp;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const holidayTimes = new Set(
    holidays.map((h) => {
      const d = new Date(h);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let businessDaysCount = 0;
  let weekendDaysCount = 0;
  let holidaysCount = 0;
  let totalDaysCount = 0;

  let current = new Date(start);
  while (current.getTime() <= end.getTime()) {
    totalDaysCount++;
    const dayOfWeek = current.getDay();
    const isWeekend = weekendDays.includes(dayOfWeek);
    const isHoliday = holidayTimes.has(current.getTime());

    if (isWeekend) {
      weekendDaysCount++;
    } else if (isHoliday) {
      holidaysCount++;
    } else {
      businessDaysCount++;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    businessDaysCount,
    weekendDaysCount,
    holidaysCount,
    totalDaysCount,
  };
}
