export interface WorkingDaysInputs {
  startDate: Date;
  endDate: Date;
  weekendDays?: number[]; // Day indexes (0 = Sunday, 6 = Saturday)
  holidays?: string[];    // Array of ISO date strings "YYYY-MM-DD"
}

export interface WorkingDaysResult {
  totalDays: number;
  workingDays: number;
  weekendDays: number;
  holidaysCount: number;
}

export function calculateWorkingDays({
  startDate,
  endDate,
  weekendDays = [0, 6], // Saturday & Sunday default
  holidays = [],
}: WorkingDaysInputs): WorkingDaysResult {
  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start.getTime() > end.getTime()) {
    const temp = start;
    start = end;
    end = temp;
  }

  // Set times to midnight to avoid hour differences affecting days count
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const holidayTimes = new Set(
    holidays.map((h) => {
      const d = new Date(h);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let workingDays = 0;
  let weekendDaysCount = 0;
  let holidaysCount = 0;
  let totalDays = 0;

  let current = new Date(start);
  while (current.getTime() <= end.getTime()) {
    totalDays++;
    const dayOfWeek = current.getDay();
    const isWeekend = weekendDays.includes(dayOfWeek);
    const isHoliday = holidayTimes.has(current.getTime());

    if (isWeekend) {
      weekendDaysCount++;
    } else if (isHoliday) {
      holidaysCount++;
    } else {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    totalDays,
    workingDays,
    weekendDays: weekendDaysCount,
    holidaysCount,
  };
}
