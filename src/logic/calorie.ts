import { calculateBmr, type BmrInputs } from './bmr';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

export interface CalorieInputs extends BmrInputs {
  activity: ActivityLevel;
}

export interface CalorieResult {
  bmr: number;
  maintenance: number;
  goals: {
    mildLoss: number;   // 0.25 kg/week loss (~250 kcal deficit)
    weightLoss: number; // 0.5 kg/week loss (~500 kcal deficit)
    extremeLoss: number; // 1 kg/week loss (~1000 kcal deficit)
    mildGain: number;   // 0.25 kg/week gain (~250 kcal surplus)
    weightGain: number; // 0.5 kg/week gain (~500 kcal surplus)
    extremeGain: number; // 1 kg/week gain (~1000 kcal surplus)
  };
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, { title: string; desc: string }> = {
  sedentary: { title: 'Sedentary', desc: 'Little or no exercise, desk job' },
  light: { title: 'Light', desc: 'Light exercise or sports 1-3 days/week' },
  moderate: { title: 'Moderate', desc: 'Moderate exercise or sports 3-5 days/week' },
  active: { title: 'Active', desc: 'Hard exercise or sports 6-7 days/week' },
  extreme: { title: 'Extreme', desc: 'Very hard exercise, physical job or training twice a day' },
};

export function calculateCalories(inputs: CalorieInputs): CalorieResult {
  const bmr = calculateBmr(inputs);
  const multiplier = ACTIVITY_MULTIPLIERS[inputs.activity];
  const maintenance = Math.round(bmr * multiplier);

  return {
    bmr,
    maintenance,
    goals: {
      mildLoss: Math.max(1200, maintenance - 250),
      weightLoss: Math.max(1200, maintenance - 500),
      extremeLoss: Math.max(1000, maintenance - 1000),
      mildGain: maintenance + 250,
      weightGain: maintenance + 500,
      extremeGain: maintenance + 1000,
    },
  };
}
