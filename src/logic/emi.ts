export interface EmiInputs {
  principal: number;
  interestRate: number; // Annual rate in %
  tenure: number;       // In months or years
  tenureType: 'years' | 'months';
}

export interface EmiResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  principalPercent: number;
  interestPercent: number;
}

export function calculateEmi({
  principal,
  interestRate,
  tenure,
  tenureType,
}: EmiInputs): EmiResult {
  if (principal <= 0 || interestRate < 0 || tenure <= 0) {
    throw new Error('Principal, interest rate, and tenure must be positive numbers.');
  }

  const months = tenureType === 'years' ? tenure * 12 : tenure;
  
  if (interestRate === 0) {
    const monthlyPayment = principal / months;
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: 0,
      totalPayment: principal,
      principalPercent: 100,
      interestPercent: 0,
    };
  }

  const r = interestRate / 12 / 100; // monthly rate
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  const principalPercent = (principal / totalPayment) * 100;
  const interestPercent = (totalInterest / totalPayment) * 100;

  return {
    monthlyPayment: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    principalPercent: Math.round(principalPercent * 10) / 10,
    interestPercent: Math.round(interestPercent * 10) / 10,
  };
}
