export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'time' | 'storage';

export interface Unit {
  value: string;
  label: string;
  factor: number; // Factor relative to base unit, except temperature which uses functions
}

export const UNIT_CATEGORIES: Record<UnitCategory, { label: string; baseUnit: string; units: Unit[] }> = {
  length: {
    label: 'Length',
    baseUnit: 'm',
    units: [
      { value: 'm', label: 'Meters (m)', factor: 1 },
      { value: 'km', label: 'Kilometers (km)', factor: 1000 },
      { value: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
      { value: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
      { value: 'mi', label: 'Miles (mi)', factor: 1609.34 },
      { value: 'yd', label: 'Yards (yd)', factor: 0.9144 },
      { value: 'ft', label: 'Feet (ft)', factor: 0.3048 },
      { value: 'in', label: 'Inches (in)', factor: 0.0254 }
    ]
  },
  weight: {
    label: 'Weight & Mass',
    baseUnit: 'kg',
    units: [
      { value: 'kg', label: 'Kilograms (kg)', factor: 1 },
      { value: 'g', label: 'Grams (g)', factor: 0.001 },
      { value: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
      { value: 'lb', label: 'Pounds (lb)', factor: 0.45359237 },
      { value: 'oz', label: 'Ounces (oz)', factor: 0.028349523 }
    ]
  },
  temperature: {
    label: 'Temperature',
    baseUnit: 'C',
    units: [
      { value: 'C', label: 'Celsius (°C)', factor: 1 },
      { value: 'F', label: 'Fahrenheit (°F)', factor: 1 },
      { value: 'K', label: 'Kelvin (K)', factor: 1 }
    ]
  },
  area: {
    label: 'Area',
    baseUnit: 'm2',
    units: [
      { value: 'm2', label: 'Square Meters (m²)', factor: 1 },
      { value: 'km2', label: 'Square Kilometers (km²)', factor: 1000000 },
      { value: 'mi2', label: 'Square Miles (mi²)', factor: 2589988.11 },
      { value: 'ac', label: 'Acres (ac)', factor: 4046.85642 },
      { value: 'ha', label: 'Hectares (ha)', factor: 10000 }
    ]
  },
  volume: {
    label: 'Volume',
    baseUnit: 'L',
    units: [
      { value: 'L', label: 'Liters (L)', factor: 1 },
      { value: 'ml', label: 'Milliliters (ml)', factor: 0.001 },
      { value: 'gal', label: 'Gallons (US gal)', factor: 3.78541 },
      { value: 'qt', label: 'Quarts (qt)', factor: 0.946353 },
      { value: 'cup', label: 'Cups (cup)', factor: 0.236588 }
    ]
  },
  time: {
    label: 'Time',
    baseUnit: 's',
    units: [
      { value: 's', label: 'Seconds (s)', factor: 1 },
      { value: 'm', label: 'Minutes (min)', factor: 60 },
      { value: 'h', label: 'Hours (h)', factor: 3600 },
      { value: 'd', label: 'Days (d)', factor: 86400 },
      { value: 'w', label: 'Weeks (w)', factor: 604800 }
    ]
  },
  storage: {
    label: 'Data Storage',
    baseUnit: 'B',
    units: [
      { value: 'B', label: 'Bytes (B)', factor: 1 },
      { value: 'KB', label: 'Kilobytes (KB)', factor: 1024 },
      { value: 'MB', label: 'Megabytes (MB)', factor: 1024 * 1024 },
      { value: 'GB', label: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      { value: 'TB', label: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 }
    ]
  }
};

export function convertUnits(
  value: number,
  category: UnitCategory,
  fromUnit: string,
  toUnit: string
): number {
  if (isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;

  // Temperature special case
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }

  const categoryInfo = UNIT_CATEGORIES[category];
  const from = categoryInfo.units.find(u => u.value === fromUnit);
  const to = categoryInfo.units.find(u => u.value === toUnit);

  if (!from || !to) {
    throw new Error('Invalid units selected');
  }

  // Convert to base unit then to target unit
  const valueInBase = value * from.factor;
  return valueInBase / to.factor;
}

function convertTemperature(value: number, from: string, to: string): number {
  let celsius = value;

  // Convert to Celsius
  if (from === 'F') {
    celsius = ((value - 32) * 5) / 9;
  } else if (from === 'K') {
    celsius = value - 273.15;
  }

  // Convert from Celsius to Target
  if (to === 'C') {
    return celsius;
  } else if (to === 'F') {
    return (celsius * 9) / 5 + 32;
  } else if (to === 'K') {
    return celsius + 273.15;
  }

  return value;
}
