export interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export function buildCronExpression(parts: CronParts): string {
  return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

export function describeCronExpression(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return 'Invalid cron expression. Must have exactly 5 parts.';
  }

  const [min, hr, dom, mon, dow] = parts;

  try {
    const minDesc = describePart(min, 'minute', 'every minute', 'minute');
    const hrDesc = describePart(hr, 'hour', 'every hour', 'hour');
    const domDesc = describePart(dom, 'day of month', 'every day of the month', 'day');
    const monDesc = describePart(mon, 'month', 'every month', 'month', getMonthName);
    const dowDesc = describePart(dow, 'day of week', 'every day of the week', 'day', getDayOfWeekName);

    return `Runs ${minDesc} of ${hrDesc}, on ${domDesc}, on ${monDesc}, ${dowDesc}.`;
  } catch (e) {
    return 'Error parsing cron format.';
  }
}

function describePart(
  value: string,
  name: string,
  allDesc: string,
  unit: string,
  resolver?: (val: string) => string
): string {
  if (value === '*') return allDesc;

  // Step values (e.g. */5)
  if (value.startsWith('*/')) {
    const step = value.substring(2);
    return `every ${step} ${unit}s`;
  }

  // Ranges (e.g. 1-5)
  if (value.includes('-')) {
    const [start, end] = value.split('-');
    const resolvedStart = resolver ? resolver(start) : start;
    const resolvedEnd = resolver ? resolver(end) : end;
    return `from ${resolvedStart} through ${resolvedEnd}`;
  }

  // Lists (e.g. 1,2,5)
  if (value.includes(',')) {
    const items = value.split(',').map(item => resolver ? resolver(item) : item);
    return `at ${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  return `at ${resolver ? resolver(value) : `${name} ${value}`}`;
}

function getMonthName(val: string): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const idx = parseInt(val, 10);
  if (!isNaN(idx) && idx >= 1 && idx <= 12) {
    return months[idx - 1];
  }
  return val;
}

function getDayOfWeekName(val: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const idx = parseInt(val, 10);
  if (!isNaN(idx) && idx >= 0 && idx <= 6) {
    return days[idx];
  }
  return val;
}
