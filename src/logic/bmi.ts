export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';
export type UnitSystem = 'metric' | 'imperial';

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  label: string;
  color: string;
  healthyRange: { min: number; max: number };
}

export function calculateBmi(
  weight: number,
  height: number,
  unit: UnitSystem = 'metric'
): BmiResult {
  if (weight <= 0 || height <= 0) {
    throw new Error('Weight and height must be positive numbers');
  }

  let bmi: number;
  if (unit === 'metric') {
    // height in cm, weight in kg
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    // height in inches, weight in lbs
    bmi = (weight / (height * height)) * 703;
  }

  bmi = Math.round(bmi * 10) / 10;

  const { category, label, color } = getBmiCategory(bmi);

  // Calculate healthy weight range
  let healthyRange: { min: number; max: number };
  if (unit === 'metric') {
    const heightM = height / 100;
    healthyRange = {
      min: Math.round(18.5 * heightM * heightM * 10) / 10,
      max: Math.round(24.9 * heightM * heightM * 10) / 10,
    };
  } else {
    healthyRange = {
      min: Math.round(((18.5 * height * height) / 703) * 10) / 10,
      max: Math.round(((24.9 * height * height) / 703) * 10) / 10,
    };
  }

  return { bmi, category, label, color, healthyRange };
}

function getBmiCategory(bmi: number): { category: BmiCategory; label: string; color: string } {
  if (bmi < 18.5) return { category: 'underweight', label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { category: 'normal', label: 'Normal weight', color: 'text-green-500' };
  if (bmi < 30) return { category: 'overweight', label: 'Overweight', color: 'text-yellow-500' };
  return { category: 'obese', label: 'Obese', color: 'text-red-500' };
}
