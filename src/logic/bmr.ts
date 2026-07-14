export type Gender = 'male' | 'female';
export type BmrFormula = 'mifflin' | 'harris';
export type UnitSystem = 'metric' | 'imperial';

export interface BmrInputs {
  gender: Gender;
  age: number;
  weight: number; // kg or lbs
  height: number; // cm or inches
  unit: UnitSystem;
  formula: BmrFormula;
}

export function calculateBmr({
  gender,
  age,
  weight,
  height,
  unit,
  formula,
}: BmrInputs): number {
  if (age <= 0 || weight <= 0 || height <= 0) {
    throw new Error('Age, weight, and height must be positive numbers.');
  }

  // Convert to metric if imperial
  let wKg = weight;
  let hCm = height;

  if (unit === 'imperial') {
    wKg = weight * 0.45359237; // lbs to kg
    hCm = height * 2.54;       // inches to cm
  }

  let bmr = 0;

  if (formula === 'mifflin') {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      bmr = 10 * wKg + 6.25 * hCm - 5 * age + 5;
    } else {
      bmr = 10 * wKg + 6.25 * hCm - 5 * age - 161;
    }
  } else {
    // Revised Harris-Benedict Equation
    if (gender === 'male') {
      bmr = 13.397 * wKg + 4.799 * hCm - 5.677 * age + 88.362;
    } else {
      bmr = 9.247 * wKg + 3.098 * hCm - 4.33 * age + 447.593;
    }
  }

  return Math.round(bmr);
}
