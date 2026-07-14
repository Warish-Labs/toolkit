export interface TimestampAnalysis {
  seconds: number;
  milliseconds: number;
  localString: string;
  utcString: string;
  relativeTime: string;
}

export function parseUnixTimestamp(value: number, isMs = false): TimestampAnalysis {
  const ms = isMs ? value : value * 1000;
  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    localString: date.toString(),
    utcString: date.toUTCString(),
    relativeTime: getRelativeTimeDesc(ms),
  };
}

export function parseDateStringToTimestamp(dateStr: string): TimestampAnalysis {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const ms = date.getTime();
  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    localString: date.toString(),
    utcString: date.toUTCString(),
    relativeTime: getRelativeTimeDesc(ms),
  };
}

function getRelativeTimeDesc(ms: number): string {
  const now = Date.now();
  const diff = ms - now;
  const absDiff = Math.abs(diff);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const prefix = diff < 0 ? '' : 'in ';
  const suffix = diff < 0 ? ' ago' : '';

  if (seconds < 60) return `${prefix}${seconds} second${seconds !== 1 ? 's' : ''}${suffix}`;
  if (minutes < 60) return `${prefix}${minutes} minute${minutes !== 1 ? 's' : ''}${suffix}`;
  if (hours < 24) return `${prefix}${hours} hour${hours !== 1 ? 's' : ''}${suffix}`;
  return `${prefix}${days} day${days !== 1 ? 's' : ''}${suffix}`;
}
