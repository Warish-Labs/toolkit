export interface TimeZoneOption {
  code: string;
  name: string;
  offset: number; // in hours, e.g. IST is 5.5, EST is -5
}

export const TIME_ZONES: TimeZoneOption[] = [
  { code: 'UTC', name: 'Coordinated Universal Time (UTC+0)', offset: 0 },
  { code: 'GMT', name: 'Greenwich Mean Time (UTC+0)', offset: 0 },
  { code: 'EST', name: 'Eastern Standard Time (UTC-5)', offset: -5 },
  { code: 'EDT', name: 'Eastern Daylight Time (UTC-4)', offset: -4 },
  { code: 'CST', name: 'Central Standard Time (UTC-6)', offset: -6 },
  { code: 'CDT', name: 'Central Daylight Time (UTC-5)', offset: -5 },
  { code: 'MST', name: 'Mountain Standard Time (UTC-7)', offset: -7 },
  { code: 'MDT', name: 'Mountain Daylight Time (UTC-6)', offset: -6 },
  { code: 'PST', name: 'Pacific Standard Time (UTC-8)', offset: -8 },
  { code: 'PDT', name: 'Pacific Daylight Time (UTC-7)', offset: -7 },
  { code: 'CET', name: 'Central European Time (UTC+1)', offset: 1 },
  { code: 'CEST', name: 'Central European Summer Time (UTC+2)', offset: 2 },
  { code: 'IST', name: 'Indian Standard Time (UTC+5:30)', offset: 5.5 },
  { code: 'JST', name: 'Japan Standard Time (UTC+9)', offset: 9 },
  { code: 'AEST', name: 'Australian Eastern Standard Time (UTC+10)', offset: 10 },
  { code: 'AEDT', name: 'Australian Eastern Daylight Time (UTC+11)', offset: 11 },
  { code: 'NZST', name: 'New Zealand Standard Time (UTC+12)', offset: 12 },
];

export interface TimeZoneConvertInputs {
  dateStr: string;      // YYYY-MM-DD
  timeStr: string;      // HH:MM
  sourceZoneCode: string;
  targetZoneCode: string;
}

export function convertTimeZone({
  dateStr,
  timeStr,
  sourceZoneCode,
  targetZoneCode,
}: TimeZoneConvertInputs): Date {
  const sourceZone = TIME_ZONES.find((z) => z.code === sourceZoneCode);
  const targetZone = TIME_ZONES.find((z) => z.code === targetZoneCode);

  if (!sourceZone || !targetZone) {
    throw new Error('Invalid source or target timezone selected.');
  }

  // Parse source local date time
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create Date object in local system time representing the source values
  // We will convert this local time to UTC by subtracting source offset
  const localDate = new Date(year, month - 1, day, hours, minutes);

  // UTC epoch time of the source date-time
  // getTime() gives epoch milliseconds. 
  // We adjust by local system offset first, but wait!
  // To keep it simple:
  // Local time (hours) - sourceZone.offset = UTC time (hours)
  // UTC time (hours) + targetZone.offset = Target local time (hours)
  
  // Let's find UTC epoch ms:
  // Date.UTC(y, m, d, h, min) gives UTC epoch ms of that face time.
  // Then we subtract the sourceOffset * 60 * 60 * 1000
  const utcEpochMs = Date.UTC(year, month - 1, day, hours, minutes) - (sourceZone.offset * 60 * 60 * 1000);
  
  // Target epoch ms is:
  const targetEpochMs = utcEpochMs + (targetZone.offset * 60 * 60 * 1000);

  // Return a Date object representing the target time in UTC timezone face value
  return new Date(targetEpochMs);
}
