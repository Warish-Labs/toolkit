export interface DiscountInputs {
  originalPrice: number;
  discountPercent: number;
  additionalDiscountPercent?: number;
}

export interface DiscountResult {
  savings: number;
  finalPrice: number;
  additionalSavings?: number;
}

export function calculateDiscount({
  originalPrice,
  discountPercent,
  additionalDiscountPercent = 0,
}: DiscountInputs): DiscountResult {
  if (originalPrice < 0 || discountPercent < 0 || additionalDiscountPercent < 0) {
    throw new Error('Prices and discount percentages must be positive numbers.');
  }

  const primaryDiscount = originalPrice * (discountPercent / 100);
  const priceAfterPrimary = originalPrice - primaryDiscount;

  const secondaryDiscount = priceAfterPrimary * (additionalDiscountPercent / 100);
  const finalPrice = priceAfterPrimary - secondaryDiscount;

  const totalSavings = primaryDiscount + secondaryDiscount;

  return {
    savings: Math.round(totalSavings * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    additionalSavings: additionalDiscountPercent > 0 ? Math.round(secondaryDiscount * 100) / 100 : undefined,
  };
}
