export interface MortgageInputs {
  homePrice: number;
  downPayment: number;       // Can be raw currency or percent
  downPaymentType: 'percent' | 'amount';
  interestRate: number;      // Annual rate %
  termYears: number;
  propertyTax: number;       // Annual dollar amount
  homeInsurance: number;     // Annual dollar amount
  hoa: number;               // Monthly dollar amount
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyPmi: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
}

export function calculateMortgage({
  homePrice,
  downPayment,
  downPaymentType,
  interestRate,
  termYears,
  propertyTax,
  homeInsurance,
  hoa,
}: MortgageInputs): MortgageResult {
  if (homePrice <= 0 || interestRate < 0 || termYears <= 0) {
    throw new Error('Home price, interest rate, and term must be positive numbers.');
  }

  let downPaymentAmount = downPayment;
  if (downPaymentType === 'percent') {
    downPaymentAmount = homePrice * (downPayment / 100);
  }

  if (downPaymentAmount >= homePrice) {
    throw new Error('Down payment cannot be greater than or equal to the home price.');
  }

  const loanAmount = homePrice - downPaymentAmount;
  const months = termYears * 12;

  // Monthly Principal & Interest (P&I)
  let monthlyPrincipalInterest = 0;
  if (interestRate > 0) {
    const r = interestRate / 12 / 100;
    monthlyPrincipalInterest = (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  } else {
    monthlyPrincipalInterest = loanAmount / months;
  }

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyHomeInsurance = homeInsurance / 12;
  const monthlyHoa = hoa;

  // PMI: If down payment is less than 20% of home price, calculate PMI (assumed ~0.75% of loan amount annually)
  const isPmiRequired = (downPaymentAmount / homePrice) < 0.20;
  const monthlyPmi = isPmiRequired ? (loanAmount * 0.0075) / 12 : 0;

  const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPmi + monthlyHoa;

  return {
    loanAmount: Math.round(loanAmount * 100) / 100,
    downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
    monthlyPrincipalInterest: Math.round(monthlyPrincipalInterest * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyHomeInsurance: Math.round(monthlyHomeInsurance * 100) / 100,
    monthlyPmi: Math.round(monthlyPmi * 100) / 100,
    monthlyHoa: Math.round(monthlyHoa * 100) / 100,
    totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
  };
}
