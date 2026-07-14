import { calculateEmi, type EmiInputs } from './emi';

export interface AmortizationEntry {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  schedule: AmortizationEntry[];
}

export function calculateLoan(inputs: EmiInputs): LoanResult {
  const emiResult = calculateEmi(inputs);
  const months = inputs.tenureType === 'years' ? inputs.tenure * 12 : inputs.tenure;
  const monthlyRate = inputs.interestRate / 12 / 100;
  
  const schedule: AmortizationEntry[] = [];
  let balance = inputs.principal;

  for (let m = 1; m <= months; m++) {
    const interestPaid = balance * monthlyRate;
    let principalPaid = emiResult.monthlyPayment - interestPaid;
    
    if (m === months) {
      // Adjustment for last month rounding errors
      principalPaid = balance;
    }
    
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month: m,
      payment: Math.round((principalPaid + interestPaid) * 100) / 100,
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return {
    monthlyPayment: emiResult.monthlyPayment,
    totalInterest: emiResult.totalInterest,
    totalPayment: emiResult.totalPayment,
    schedule,
  };
}
