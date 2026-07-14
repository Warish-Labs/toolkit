"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateBreakEven, type BreakEvenResult } from "@/src/logic/break-even";

export function BreakEvenCalculatorTool() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [result, setResult] = useState<BreakEvenResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);

    if (isNaN(fc) || isNaN(vc) || isNaN(sp)) {
      setError("Please enter valid positive numbers for all fields.");
      return;
    }

    try {
      const res = calculateBreakEven({
        fixedCosts: fc,
        variableCostPerUnit: vc,
        sellingPricePerUnit: sp,
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
          <Label htmlFor="fixed-costs">Total Fixed Costs ($)</Label>
          <Input
            id="fixed-costs"
            type="number"
            min="0"
            placeholder="e.g., 10000"
            value={fixedCosts}
            onChange={(e) => { setFixedCosts(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variable-cost">Variable Cost per Unit ($)</Label>
          <Input
            id="variable-cost"
            type="number"
            min="0"
            placeholder="e.g., 15"
            value={variableCost}
            onChange={(e) => { setVariableCost(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="selling-price">Selling Price per Unit ($)</Label>
          <Input
            id="selling-price"
            type="number"
            min="0"
            placeholder="e.g., 25"
            value={sellingPrice}
            onChange={(e) => { setSellingPrice(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Break-Even Point
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Break-Even Units Required</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">{result.breakEvenUnits} units</p>
            <p className="text-xs text-muted-foreground mt-1">You must sell at least this many units to cover all your costs.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Break-Even Sales Revenue</span>
              <p className="text-lg font-bold mt-0.5">${result.breakEvenRevenue}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Unit Contribution Margin</span>
              <p className="text-lg font-bold mt-0.5 text-emerald-500">
                ${(parseFloat(sellingPrice) - parseFloat(variableCost)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
