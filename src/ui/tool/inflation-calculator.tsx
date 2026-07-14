"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateInflation, type InflationMode, type InflationResult } from "@/src/logic/inflation";

export function InflationCalculatorTool() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("3"); // average standard inflation %
  const [years, setYears] = useState("");
  const [mode, setMode] = useState<InflationMode>("future");
  const [result, setResult] = useState<InflationResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);

    if (isNaN(a) || isNaN(r) || isNaN(y)) {
      setError("Please enter valid positive numbers.");
      return;
    }

    try {
      const res = calculateInflation({ amount: a, rate: r, years: y, mode });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Starting Sum ($)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            placeholder="e.g., 1000"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">Calculation Direction</Label>
          <Select value={mode} onValueChange={(val) => { setMode(val as InflationMode); setResult(null); }}>
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="future">Forward into Future (Project Cost growth)</SelectItem>
              <SelectItem value="past">Backward into Past (Buying power adjustment)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rate">Average Inflation Rate (%)</Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 3.2"
            value={rate}
            onChange={(e) => { setRate(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Number of Years</Label>
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
        Calculate Inflation Impact
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {mode === "future" ? "Future Equivalent Worth" : "Past Equivalent Buying Power"}
            </span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.adjustedAmount}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Cumulative Price Increase</span>
              <p className="text-lg font-bold mt-0.5">{result.cumulativeInflation}%</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-destructive">
              <span className="text-xs text-muted-foreground">Purchasing Power Reduction</span>
              <p className="text-lg font-bold mt-0.5">{result.purchasingPowerLoss}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
