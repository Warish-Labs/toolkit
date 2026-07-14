"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateSip, type SipResult } from "@/src/logic/sip";

export function SipCalculatorTool() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<SipResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const mi = parseFloat(monthlyInvestment);
    const rr = parseFloat(returnRate);
    const y = parseInt(years, 10);

    if (isNaN(mi) || isNaN(rr) || isNaN(y)) {
      setError("Please enter valid positive numbers.");
      return;
    }

    try {
      const res = calculateSip({
        monthlyInvestment: mi,
        returnRate: rr,
        years: y,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="monthly-investment">Monthly SIP Amount ($)</Label>
          <Input
            id="monthly-investment"
            type="number"
            min="0"
            placeholder="e.g., 500"
            value={monthlyInvestment}
            onChange={(e) => { setMonthlyInvestment(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">Expected Return Rate (Annual %)</Label>
          <Input
            id="rate"
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 12.0"
            value={returnRate}
            onChange={(e) => { setReturnRate(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Tenure (Years)</Label>
          <Input
            id="years"
            type="number"
            min="1"
            placeholder="e.g., 10"
            value={years}
            onChange={(e) => { setYears(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate SIP Growth
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Maturity Value</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.totalValue}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Invested Amount</span>
              <p className="text-lg font-bold mt-0.5">${result.investedAmount}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-emerald-500">
              <span className="text-xs text-muted-foreground">Estimated Returns Earned</span>
              <p className="text-lg font-bold mt-0.5">${result.estimatedReturns}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
