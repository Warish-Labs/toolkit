"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateTip, type TipResult } from "@/src/logic/tip";

export function TipCalculatorTool() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [peopleCount, setPeopleCount] = useState("1");
  const [result, setResult] = useState<TipResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercent);
    const people = parseInt(peopleCount, 10);

    if (isNaN(bill) || isNaN(tip) || isNaN(people)) {
      setError("Please enter valid positive numbers.");
      return;
    }

    try {
      const res = calculateTip({
        billAmount: bill,
        tipPercent: tip,
        peopleCount: people,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const commonTips = ["10", "15", "18", "20"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bill">Bill Amount ($)</Label>
          <Input
            id="bill"
            type="number"
            min="0"
            placeholder="e.g., 85.50"
            value={billAmount}
            onChange={(e) => { setBillAmount(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="people">Number of People</Label>
          <Input
            id="people"
            type="number"
            min="1"
            placeholder="e.g., 4"
            value={peopleCount}
            onChange={(e) => { setPeopleCount(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tip Percentage (%)</Label>
        <div className="flex flex-wrap gap-2">
          {commonTips.map((t) => (
            <button
              key={t}
              onClick={() => { setTipPercent(t); setResult(null); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tipPercent === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {t}%
            </button>
          ))}
          <div className="w-28">
            <Input
              type="number"
              placeholder="Custom %"
              value={commonTips.includes(tipPercent) ? "" : tipPercent}
              onChange={(e) => { setTipPercent(e.target.value); setResult(null); }}
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Tip
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 text-center py-2 border-b border-border/40 pb-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total per Person</span>
              <p className="text-3xl font-extrabold mt-1 text-foreground">${result.totalPerPerson}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tip per Person</span>
              <p className="text-3xl font-extrabold mt-1 text-emerald-500">${result.tipPerPerson}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Tip Amount</span>
              <p className="text-lg font-bold mt-0.5">${result.tipAmount}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Bill (with Tip)</span>
              <p className="text-lg font-bold mt-0.5">${result.totalAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
