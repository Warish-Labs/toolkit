"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateCagrReverse, type CagrReverseResult } from "@/src/logic/cagr-reverse";

export function CagrReverseCalculatorTool() {
  const [beginningValue, setBeginningValue] = useState("");
  const [cagr, setCagr] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<CagrReverseResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const bv = parseFloat(beginningValue);
    const c = parseFloat(cagr);
    const y = parseFloat(years);

    if (isNaN(bv) || isNaN(c) || isNaN(y)) {
      setError("Please enter valid positive numbers for all fields.");
      return;
    }

    try {
      const res = calculateCagrReverse({ beginningValue: bv, cagr: c, years: y });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="beginning-value">Beginning Value ($)</Label>
          <Input
            id="beginning-value"
            type="number"
            min="0"
            placeholder="e.g., 5000"
            value={beginningValue}
            onChange={(e) => { setBeginningValue(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cagr">Target CAGR (%)</Label>
          <Input
            id="cagr"
            type="number"
            step="0.01"
            placeholder="e.g., 10"
            value={cagr}
            onChange={(e) => { setCagr(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Number of Years</Label>
          <Input
            id="years"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g., 5"
            value={years}
            onChange={(e) => { setYears(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Projected Growth
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projected Future Value</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.endingValue}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Original Investment</span>
              <p className="text-lg font-bold mt-0.5">${beginningValue}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-emerald-500">
              <span className="text-xs text-muted-foreground">Projected Total Gain</span>
              <p className="text-lg font-bold mt-0.5">${result.totalGain}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
