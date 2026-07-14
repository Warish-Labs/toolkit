"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateSimpleInterest, type SimpleInterestResult } from "@/src/logic/simple-interest";

export function SimpleInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [timeUnit, setTimeUnit] = useState<"years" | "months" | "days">("years");
  const [result, setResult] = useState<SimpleInterestResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      setError("Please enter valid positive values.");
      return;
    }

    try {
      const res = calculateSimpleInterest({
        principal: p,
        rate: r,
        time: t,
        timeUnit,
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
          <Label htmlFor="principal">Principal Amount ($)</Label>
          <Input
            id="principal"
            type="number"
            min="0"
            placeholder="e.g., 5000"
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
            placeholder="e.g., 5.5"
            value={rate}
            onChange={(e) => { setRate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time">Time Period</Label>
          <Input
            id="time"
            type="number"
            min="1"
            placeholder={timeUnit === "years" ? "e.g., 3" : timeUnit === "months" ? "e.g., 36" : "e.g., 1095"}
            value={time}
            onChange={(e) => { setTime(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-unit">Time Unit</Label>
          <Select value={timeUnit} onValueChange={(val) => { setTimeUnit(val as "years" | "months" | "days"); setResult(null); }}>
            <SelectTrigger id="time-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="years">Years</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Simple Interest
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Value (Principal + Interest)</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.totalValue}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Original Principal</span>
              <p className="text-lg font-bold mt-0.5">${principal}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Accumulated Simple Interest</span>
              <p className="text-lg font-bold mt-0.5 text-emerald-500">${result.interest}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
