export interface BreakEvenInputs {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
}

export function calculateBreakEven({
  fixedCosts,
  variableCostPerUnit,
  sellingPricePerUnit,
}: BreakEvenInputs): BreakEvenResult {
  if (fixedCosts < 0 || variableCostPerUnit < 0 || sellingPricePerUnit < 0) {
    throw new Error('All inputs must be positive values.');
  }

  const marginPerUnit = sellingPricePerUnit - variableCostPerUnit;
  if (marginPerUnit <= 0) {
    throw new Error('Selling price per unit must be greater than variable cost per unit to break even.');
  }

  const breakEvenUnits = fixedCosts / marginPerUnit;
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;

  return {
    breakEvenUnits: Math.ceil(breakEvenUnits), // round up units as you can't sell a fraction of a unit to break even
    breakEvenRevenue: Math.round(breakEvenRevenue * 100) / 100,
  };
}
