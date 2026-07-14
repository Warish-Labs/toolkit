export type DateUnit = 'days' | 'weeks' | 'months' | 'years';
export type DateDirection = 'add' | 'subtract';

export interface DateCalcInputs {
  startDate: Date;
  value: number;
  unit: DateUnit;
  direction: DateDirection;
}

export function calculateDateAdjustment({
  startDate,
  value,
  unit,
  direction,
}: DateCalcInputs): Date {
  const result = new Date(startDate);
  const factor = direction === 'add' ? 1 : -1;
  const delta = value * factor;

  switch (unit) {
    case 'days':
      result.setDate(result.getDate() + delta);
      break;
    case 'weeks':
      result.setDate(result.getDate() + delta * 7);
      break;
    case 'months':
      // We adjust month safely
      const targetMonth = result.getMonth() + delta;
      result.setMonth(targetMonth);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + delta);
      break;
  }

  return result;
}
