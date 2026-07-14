export type TaxAction = 'add' | 'remove';

export interface TaxInputs {
  amount: number;
  rate: number; // Tax percentage
  action: TaxAction;
}

export interface TaxResult {
  originalAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export function calculateTax({
  amount,
  rate,
  action,
}: TaxInputs): TaxResult {
  if (amount < 0 || rate < 0) {
    throw new Error('Amount and rate must be positive numbers.');
  }

  let originalAmount = 0;
  let taxAmount = 0;
  let totalAmount = 0;

  if (action === 'add') {
    originalAmount = amount;
    taxAmount = amount * (rate / 100);
    totalAmount = amount + taxAmount;
  } else {
    totalAmount = amount;
    originalAmount = amount / (1 + rate / 100);
    taxAmount = amount - originalAmount;
  }

  return {
    originalAmount: Math.round(originalAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
