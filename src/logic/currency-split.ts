export interface Expense {
  id: string;
  description: string;
  paidBy: string;
  amount: number;
  currency: string;
  splitBetween: string[];
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface CurrencySplitInputs {
  baseCurrency: string;
  exchangeRates: Record<string, number>; // Rate to convert 1 foreign unit into base currency
  expenses: Expense[];
}

export interface CurrencySplitResult {
  totalSpentInBase: number;
  individualTotals: Record<string, number>; // Total paid by each person in base currency
  individualShares: Record<string, number>; // Total share of cost for each person in base currency
  balances: Record<string, number>;          // Net balance (positive = owed, negative = owes)
  settlements: Settlement[];
}

export function calculateCurrencySplit({
  baseCurrency,
  exchangeRates,
  expenses,
}: CurrencySplitInputs): CurrencySplitResult {
  const individualTotals: Record<string, number> = {};
  const individualShares: Record<string, number> = {};
  const balances: Record<string, number> = {};
  let totalSpentInBase = 0;

  // Extract all unique people from the expenses
  const peopleSet = new Set<string>();
  expenses.forEach((exp) => {
    peopleSet.add(exp.paidBy);
    exp.splitBetween.forEach((p) => peopleSet.add(p));
  });

  const people = Array.from(peopleSet);
  people.forEach((p) => {
    individualTotals[p] = 0;
    individualShares[p] = 0;
    balances[p] = 0;
  });

  // Calculate totals and shares in base currency
  expenses.forEach((exp) => {
    const rate = exp.currency === baseCurrency ? 1 : (exchangeRates[exp.currency] || 1);
    const amountInBase = exp.amount * rate;
    totalSpentInBase += amountInBase;

    // Credit the payer
    individualTotals[exp.paidBy] = (individualTotals[exp.paidBy] || 0) + amountInBase;

    // Debit the split recipients
    if (exp.splitBetween.length > 0) {
      const share = amountInBase / exp.splitBetween.length;
      exp.splitBetween.forEach((p) => {
        individualShares[p] = (individualShares[p] || 0) + share;
      });
    }
  });

  // Calculate net balances (paid - share)
  people.forEach((p) => {
    balances[p] = (individualTotals[p] || 0) - (individualShares[p] || 0);
  });

  // Greedy settlement algorithm to minimize transactions
  const settlements: Settlement[] = [];
  const balanceList = people.map((p) => ({
    name: p,
    bal: balances[p],
  }));

  // Separate creditors and debtors
  let creditors = balanceList.filter((x) => x.bal > 0.01).sort((a, b) => b.bal - a.bal);
  let debtors = balanceList.filter((x) => x.bal < -0.01).sort((a, b) => a.bal - b.bal); // largest debt (most negative) first

  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const amountToSettle = Math.min(creditor.bal, Math.abs(debtor.bal));

    if (amountToSettle > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amountToSettle * 100) / 100,
      });
    }

    creditor.bal -= amountToSettle;
    debtor.bal += amountToSettle;

    if (creditor.bal <= 0.01) cIdx++;
    if (Math.abs(debtor.bal) <= 0.01) dIdx++;
  }

  // Round values for output readability
  const roundedTotals: Record<string, number> = {};
  const roundedShares: Record<string, number> = {};
  const roundedBalances: Record<string, number> = {};

  people.forEach((p) => {
    roundedTotals[p] = Math.round(individualTotals[p] * 100) / 100;
    roundedShares[p] = Math.round(individualShares[p] * 100) / 100;
    roundedBalances[p] = Math.round(balances[p] * 100) / 100;
  });

  return {
    totalSpentInBase: Math.round(totalSpentInBase * 100) / 100,
    individualTotals: roundedTotals,
    individualShares: roundedShares,
    balances: roundedBalances,
    settlements,
  };
}
