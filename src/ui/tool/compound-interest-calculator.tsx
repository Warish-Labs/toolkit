"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateCompound, type CompoundFrequency, type CompoundResult } from "@/src/logic/compound-interest";

export function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [frequency, setFrequency] = useState<CompoundFrequency>("annually");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [result, setResult] = useState<CompoundResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);
    const mc = parseFloat(monthlyContribution || "0");

    if (isNaN(p) || isNaN(r) || isNaN(y)) {
      setError("Please enter valid positive values for Principal, Rate, and Years.");
      return;
    }

    try {
      const res = calculateCompound({
        principal: p,
        rate: r,
        years: y,
        frequency,
        monthlyContribution: mc,
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
          <Label htmlFor="principal">Initial Investment Principal ($)</Label>
          <Input
            id="principal"
            type="number"
            min="0"
            placeholder="e.g., 10000"
            value={principal}
            onChange={(e) => { setPrincipal(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">Annual Interest Rate (%)</Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 7.2"
            value={rate}
            onChange={(e) => { setRate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="years">Length of Time (Years)</Label>
          <Input
            id="years"
            type="number"
            min="1"
            placeholder="e.g., 10"
            value={years}
            onChange={(e) => { setYears(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Compounding Interval</Label>
          <Select value={frequency} onValueChange={(val) => { setFrequency(val as CompoundFrequency); setResult(null); }}>
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annually">Annually</SelectItem>
              <SelectItem value="semi-annually">Semi-Annually</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly-contribution">Monthly Addition ($)</Label>
          <Input
            id="monthly-contribution"
            type="number"
            min="0"
            placeholder="e.g., 100"
            value={monthlyContribution}
            onChange={(e) => { setMonthlyContribution(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Compound Growth
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projected Future Balance</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.endBalance}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Principal Deposited</span>
              <p className="text-xl font-bold mt-1">${result.totalContributions}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Interest Earned</span>
              <p className="text-xl font-bold mt-1 text-emerald-500">${result.totalInterest}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
            >
              {showBreakdown ? "Hide" : "Show"} Yearly Balance Breakdown Table
            </button>

            {showBreakdown && (
              <div className="overflow-x-auto border border-border/40 rounded-lg max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-border/30 text-xs text-left">
                  <thead className="bg-muted/80 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Year</th>
                      <th className="px-4 py-2 font-semibold">Total Deposits</th>
                      <th className="px-4 py-2 font-semibold">Accrued Interest</th>
                      <th className="px-4 py-2 font-semibold">End Balance</th>
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
