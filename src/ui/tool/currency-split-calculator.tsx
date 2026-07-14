"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateCurrencySplit, type Expense, type CurrencySplitResult } from "@/src/logic/currency-split";

export function CurrencySplitCalculatorTool() {
  const [people, setPeople] = useState<string[]>(["Alice", "Bob", "Charlie"]);
  const [newPersonName, setNewPersonName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    EUR: 1.10,
    GBP: 1.30,
    INR: 0.012,
  });
  const [newCurrencyCode, setNewCurrencyCode] = useState("");
  const [newCurrencyRate, setNewCurrencyRate] = useState("");

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Hotel booking",
      paidBy: "Alice",
      amount: 150,
      currency: "EUR",
      splitBetween: ["Alice", "Bob", "Charlie"],
    },
    {
      id: "2",
      description: "Dinner",
      paidBy: "Bob",
      amount: 80,
      currency: "USD",
      splitBetween: ["Alice", "Bob"],
    },
  ]);

  // Form states for new expense
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCurrency, setExpCurrency] = useState("USD");
  const [expPayer, setExpPayer] = useState("Alice");
  const [expSplitPeople, setExpSplitPeople] = useState<string[]>(["Alice", "Bob", "Charlie"]);

  const [error, setError] = useState("");

  const handleAddPerson = () => {
    const trimmed = newPersonName.trim();
    if (!trimmed) return;
    if (people.includes(trimmed)) {
      setError("This person already exists.");
      return;
    }
    setPeople([...people, trimmed]);
    setExpSplitPeople([...expSplitPeople, trimmed]);
    setNewPersonName("");
    setError("");
  };

  const handleAddCurrency = () => {
    const code = newCurrencyCode.trim().toUpperCase();
    const rate = parseFloat(newCurrencyRate);
    if (!code || isNaN(rate) || rate <= 0) {
      setError("Please enter a valid currency code and conversion rate.");
      return;
    }
    setExchangeRates({ ...exchangeRates, [code]: rate });
    setNewCurrencyCode("");
    setNewCurrencyRate("");
    setError("");
  };

  const handleAddExpense = () => {
    setError("");
    const amount = parseFloat(expAmount);
    if (!expDesc.trim()) {
      setError("Please enter an expense description.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid expense amount.");
      return;
    }
    if (expSplitPeople.length === 0) {
      setError("Please select at least one person to split the expense with.");
      return;
    }

    const newExpense: Expense = {
      id: Math.random().toString(),
      description: expDesc.trim(),
      paidBy: expPayer,
      amount,
      currency: expCurrency,
      splitBetween: [...expSplitPeople],
    };

    setExpenses([...expenses, newExpense]);
    setExpDesc("");
    setExpAmount("");
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter((x) => x.id !== id));
  };

  const toggleSplitPerson = (person: string) => {
    if (expSplitPeople.includes(person)) {
      setExpSplitPeople(expSplitPeople.filter((p) => p !== person));
    } else {
      setExpSplitPeople([...expSplitPeople, person]);
    }
  };

  // Run calculation
  let result: CurrencySplitResult | null = null;
  try {
    result = calculateCurrencySplit({
      baseCurrency,
      exchangeRates,
      expenses,
    });
  } catch (e) {
    console.error(e);
  }

  const currencies = [baseCurrency, ...Object.keys(exchangeRates)];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Config */}
        <div className="space-y-4 md:border-r md:border-border/40 md:pr-6">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Configuration</h3>

          {/* Base Currency */}
          <div className="space-y-2">
            <Label htmlFor="base-currency">Base Currency</Label>
            <Input
              id="base-currency"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value.toUpperCase())}
              placeholder="USD"
              maxLength={4}
            />
          </div>

          {/* People list */}
          <div className="space-y-2">
            <Label>Group Members</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Name"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
              />
              <button
                onClick={handleAddPerson}
                className="bg-secondary hover:bg-secondary/80 px-3 py-1 rounded text-sm transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {people.map((p) => (
                <span key={p} className="text-xs bg-muted border border-border/40 rounded px-2 py-0.5 font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="space-y-2 pt-2">
            <Label>Conversion Rates (to 1 {baseCurrency})</Label>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto border border-border/40 rounded p-2 bg-background/50">
              {Object.entries(exchangeRates).map(([code, rate]) => (
                <div key={code} className="flex justify-between text-xs font-mono">
                  <span>1 {code} =</span>
                  <span>{rate} {baseCurrency}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="EUR"
                value={newCurrencyCode}
                onChange={(e) => setNewCurrencyCode(e.target.value)}
                className="w-16 h-8 text-xs font-mono"
              />
              <Input
                placeholder="Rate"
                type="number"
                step="0.0001"
                value={newCurrencyRate}
                onChange={(e) => setNewCurrencyRate(e.target.value)}
                className="h-8 text-xs font-mono"
              />
              <button
                onClick={handleAddCurrency}
                className="bg-secondary hover:bg-secondary/80 px-3 py-0.5 rounded text-xs transition-colors"
              >
                Add Rate
              </button>
            </div>
          </div>
        </div>

        {/* Center column: Add & List Expenses */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Expenses Ledger</h3>

          {/* Add Expense Form */}
          <div className="border border-border/60 rounded-xl p-4 bg-muted/20 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="exp-desc">Description</Label>
                <Input
                  id="exp-desc"
                  placeholder="e.g., Grocery run"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid gap-2 grid-cols-3 items-end">
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="exp-amount">Amount</Label>
                  <Input
                    id="exp-amount"
                    type="number"
                    placeholder="100"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="exp-currency">Currency</Label>
                  <Select value={expCurrency} onValueChange={(val) => { if (val) setExpCurrency(val); }}>
                    <SelectTrigger id="exp-currency" className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="exp-payer">Paid By</Label>
                <Select value={expPayer} onValueChange={(val) => { if (val) setExpPayer(val); }}>
                  <SelectTrigger id="exp-payer" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Split Between</Label>
                <div className="flex flex-wrap gap-1.5">
                  {people.map((p) => (
                    <button
                      key={p}
                      onClick={() => toggleSplitPerson(p)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${expSplitPeople.includes(p) ? "bg-primary/10 border-primary text-primary font-medium" : "bg-background border-border text-muted-foreground"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddExpense}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded transition-colors w-full sm:w-auto"
            >
              Add Expense
            </button>
          </div>

          {/* List of expenses */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">No expenses added yet.</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center text-xs p-3 border border-border/40 rounded-lg bg-background/50 hover:bg-background transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{exp.description}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Paid by <span className="font-medium text-foreground">{exp.paidBy}</span>: {exp.amount} {exp.currency} (Split: {exp.splitBetween.join(", ")})
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveExpense(exp.id)}
                    className="text-[10px] text-destructive hover:underline ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Settlements Section */}
      {result && result.totalSpentInBase > 0 && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6 border-t-2 border-t-primary">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Group Total Spent</span>
            <p className="text-3xl font-extrabold mt-1 text-foreground">
              {result.totalSpentInBase} {baseCurrency}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Member Standings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold tracking-tight text-foreground uppercase">Member Balances:</h4>
              <div className="space-y-1.5 text-xs">
                {Object.keys(result.balances).map((p) => {
                  const bal = result!.balances[p];
                  const owes = bal < 0;
                  return (
                    <div key={p} className="flex justify-between p-2 rounded bg-background/50">
                      <span>{p}</span>
                      <span className={`font-semibold ${owes ? "text-destructive" : "text-emerald-500"}`}>
                        {owes ? `owes ${Math.abs(bal)}` : `owed ${bal}`} {baseCurrency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlements to do */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold tracking-tight text-foreground uppercase">How to Settle Debts:</h4>
              <div className="space-y-1.5 text-xs">
                {result.settlements.length === 0 ? (
                  <p className="text-muted-foreground italic p-2 bg-background/30 rounded">Everyone is fully settled up!</p>
                ) : (
                  result.settlements.map((s, idx) => (
                    <div key={idx} className="p-2.5 border border-border/60 rounded bg-background/80 flex items-center justify-between font-medium">
                      <span>{s.from}</span>
                      <span className="text-muted-foreground text-[10px]">pays</span>
                      <span>{s.to}</span>
                      <span className="text-primary font-bold text-sm ml-2">
                        {s.amount} {baseCurrency}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
