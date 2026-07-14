"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateRoi, type RoiResult } from "@/src/logic/roi";

export function RoiCalculatorTool() {
  const [amountInvested, setAmountInvested] = useState("");
  const [amountReturned, setAmountReturned] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<RoiResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const invested = parseFloat(amountInvested);
    const returned = parseFloat(amountReturned);
    const y = years ? parseFloat(years) : undefined;

    if (isNaN(invested) || isNaN(returned)) {
      setError("Please enter valid positive numbers for invested and returned amounts.");
      return;
    }

    try {
      const res = calculateRoi({
        amountInvested: invested,
        amountReturned: returned,
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
          <Label htmlFor="invested">Amount Invested ($)</Label>
          <Input
            id="invested"
            type="number"
            min="0"
            placeholder="e.g., 10000"
            value={amountInvested}
            onChange={(e) => { setAmountInvested(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="returned">Amount Returned ($)</Label>
          <Input
            id="returned"
            type="number"
            min="0"
            placeholder="e.g., 15000"
            value={amountReturned}
            onChange={(e) => { setAmountReturned(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Term (Years, optional)</Label>
          <Input
            id="years"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g., 3"
            value={years}
            onChange={(e) => { setYears(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate ROI
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Return on Investment (ROI)</span>
            <p className="text-4xl font-extrabold mt-1 text-emerald-500">{result.roi}%</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Profit / Gain</span>
              <p className={`text-lg font-bold mt-0.5 ${result.gain >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                ${result.gain}
              </p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Annualized ROI</span>
              <p className="text-lg font-bold mt-0.5">
                {result.annualizedRoi !== undefined ? `${result.annualizedRoi}%` : "N/A (Provide term)"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
