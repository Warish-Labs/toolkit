"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateInvestment, type ContributionFrequency, type InvestmentResult } from "@/src/logic/investment";

export function InvestmentCalculatorTool() {
  const [startingAmount, setStartingAmount] = useState("");
  const [contribution, setContribution] = useState("");
  const [frequency, setFrequency] = useState<ContributionFrequency>("monthly");
  const [returnRate, setReturnRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const sa = parseFloat(startingAmount || "0");
    const c = parseFloat(contribution || "0");
    const rr = parseFloat(returnRate);
    const y = parseInt(years, 10);

    if (isNaN(sa) || isNaN(rr) || isNaN(y)) {
      setError("Please enter valid positive values for Starting Amount, Return Rate, and Years.");
      return;
    }

    try {
      const res = calculateInvestment({
        startingAmount: sa,
        contribution: c,
        frequency,
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="starting-amount">Starting Amount ($)</Label>
          <Input
            id="starting-amount"
            type="number"
            min="0"
            placeholder="e.g., 5000"
            value={startingAmount}
            onChange={(e) => { setStartingAmount(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return-rate">Annual Return Rate (%)</Label>
          <Input
            id="return-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 8.0"
            value={returnRate}
            onChange={(e) => { setReturnRate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="contribution">Contribution Amount ($)</Label>
          <Input
            id="contribution"
            type="number"
            min="0"
            placeholder="e.g., 200"
            value={contribution}
            onChange={(e) => { setContribution(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Contribution Frequency</Label>
          <Select value={frequency} onValueChange={(val) => { setFrequency(val as ContributionFrequency); setResult(null); }}>
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Investment Term (Years)</Label>
          <Input
            id="years"
            type="number"
            min="1"
            placeholder="e.g., 15"
            value={years}
            onChange={(e) => { setYears(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Growth
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projected Investment End Value</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.endBalance}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Capital Contributions</span>
              <p className="text-xl font-bold mt-1">${result.totalContributions}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-emerald-500">
              <span className="text-xs text-muted-foreground">Total Return Interest</span>
              <p className="text-xl font-bold mt-1">${result.totalInterest}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
            >
              {showBreakdown ? "Hide" : "Show"} Annual Growth Schedule Table
            </button>

            {showBreakdown && (
              <div className="overflow-x-auto border border-border/40 rounded-lg max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-border/30 text-xs text-left">
                  <thead className="bg-muted/80 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Year</th>
                      <th className="px-4 py-2 font-semibold">Deposited Capital</th>
                      <th className="px-4 py-2 font-semibold">Accumulated Returns</th>
                      <th className="px-4 py-2 font-semibold">Maturity Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 bg-background/20">
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-muted/20">
                        <td className="px-4 py-2 font-mono">Year {row.year}</td>
                        <td className="px-4 py-2 font-mono">${row.contributions}</td>
                        <td className="px-4 py-2 font-mono text-emerald-500">${row.interest}</td>
                        <td className="px-4 py-2 font-mono font-semibold">${row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
