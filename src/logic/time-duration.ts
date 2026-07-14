export interface TimeDurationInputs {
  startTime: string; // "HH:MM"
  startPeriod: 'AM' | 'PM';
  endTime: string;   // "HH:MM"
  endPeriod: 'AM' | 'PM';
  crossesMidnight?: boolean;
}

export interface TimeDurationResult {
  hours: number;
  minutes: number;
  totalHoursDecimal: number;
  totalMinutes: number;
  totalSeconds: number;
}

export function calculateTimeDuration({
  startTime,
  startPeriod,
  endTime,
  endPeriod,
  crossesMidnight = false,
}: TimeDurationInputs): TimeDurationResult {
  // Parse hours and minutes
  const [startHStr, startMStr] = startTime.split(':');
  const [endHStr, endMStr] = endTime.split(':');

  let startHours = parseInt(startHStr, 10);
  const startMinutes = parseInt(startMStr, 10);
  let endHours = parseInt(endHStr, 10);
  const endMinutes = parseInt(endMStr, 10);

  if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
    throw new Error('Please select valid start and end times.');
  }

  // Convert to 24-hour scale
  if (startPeriod === 'PM' && startHours !== 12) startHours += 12;
  if (startPeriod === 'AM' && startHours === 12) startHours = 0;

  if (endPeriod === 'PM' && endHours !== 12) endHours += 12;
  if (endPeriod === 'AM' && endHours === 12) endHours = 0;

  let startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  if (endTotalMinutes < startTotalMinutes) {
    if (crossesMidnight) {
      endTotalMinutes += 24 * 60; // add 24 hours
    } else {
      // If end is before start and crossesMidnight is false, assume start is actually before end (e.g. diff is absolute)
      const temp = startTotalMinutes;
      startTotalMinutes = endTotalMinutes;
      endTotalMinutes = temp;
    }
  }

  const diffMinutes = endTotalMinutes - startTotalMinutes;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return {
    hours,
    minutes,
    totalHoursDecimal: Math.round((diffMinutes / 60) * 100) / 100,
    totalMinutes: diffMinutes,
    totalSeconds: diffMinutes * 60,
  };
}
