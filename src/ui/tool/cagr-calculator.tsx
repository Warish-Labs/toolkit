"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateCagr } from "@/src/logic/cagr";

export function CagrCalculatorTool() {
  const [beginningValue, setBeginningValue] = useState("");
  const [endingValue, setEndingValue] = useState("");
  const [years, setYears] = useState("");
  const [cagr, setCagr] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const bv = parseFloat(beginningValue);
    const ev = parseFloat(endingValue);
    const y = parseFloat(years);

    if (isNaN(bv) || isNaN(ev) || isNaN(y)) {
      setError("Please enter valid positive numbers for all fields.");
      return;
    }

    try {
      const res = calculateCagr({ beginningValue: bv, endingValue: ev, years: y });
      setCagr(res);
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
            onChange={(e) => { setBeginningValue(e.target.value); setCagr(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ending-value">Ending Value ($)</Label>
          <Input
            id="ending-value"
            type="number"
            min="0"
            placeholder="e.g., 10000"
            value={endingValue}
            onChange={(e) => { setEndingValue(e.target.value); setCagr(null); }}
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
            onChange={(e) => { setYears(e.target.value); setCagr(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate CAGR
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {cagr !== null && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Compound Annual Growth Rate (CAGR)</span>
            <p className="text-4xl font-extrabold mt-1 text-emerald-500">{cagr}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              The rate of return that would be required for an investment to grow from its beginning balance to its ending balance, assuming the profits were compounded annually.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
