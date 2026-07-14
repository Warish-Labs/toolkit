export interface TipInputs {
  billAmount: number;
  tipPercent: number;
  peopleCount: number;
}

export interface TipResult {
  tipAmount: number;
  totalAmount: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export function calculateTip({
  billAmount,
  tipPercent,
  peopleCount,
}: TipInputs): TipResult {
  if (billAmount < 0 || tipPercent < 0 || peopleCount <= 0) {
    throw new Error('Bill amount and tip percentage must be positive, and people count must be at least 1.');
  }

  const tipAmount = billAmount * (tipPercent / 100);
  const totalAmount = billAmount + tipAmount;
  
  const tipPerPerson = tipAmount / peopleCount;
  const totalPerPerson = totalAmount / peopleCount;

  return {
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    tipPerPerson: Math.round(tipPerPerson * 100) / 100,
    totalPerPerson: Math.round(totalPerPerson * 100) / 100,
  };
}
