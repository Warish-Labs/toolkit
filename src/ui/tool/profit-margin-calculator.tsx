"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateMargin, type MarginResult } from "@/src/logic/profit-margin";

export function ProfitMarginCalculatorTool() {
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<MarginResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const c = parseFloat(cost);
    const p = parseFloat(price);

    if (isNaN(c) || isNaN(p)) {
      setError("Please enter valid positive numbers for Cost and Price.");
      return;
    }

    try {
      const res = calculateMargin({ cost: c, price: p });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cost">Cost of Item ($)</Label>
          <Input
            id="cost"
            type="number"
            min="0"
            placeholder="e.g., 50"
            value={cost}
            onChange={(e) => { setCost(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Selling Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            placeholder="e.g., 80"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Margin
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross Profit</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.profit}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Gross Profit Margin</span>
              <p className="text-xl font-bold mt-1 text-emerald-500">{result.margin}%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Percentage of selling price that is profit</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Markup</span>
              <p className="text-xl font-bold mt-1">{result.markup}%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Percentage cost is increased to determine selling price</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
