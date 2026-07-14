"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateSalesTax } from "@/src/logic/sales-tax";
import type { TaxResult } from "@/src/logic/gst";

export function SalesTaxCalculatorTool() {
  const [price, setPrice] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const p = parseFloat(price);
    const r = parseFloat(taxRate);

    if (isNaN(p) || isNaN(r)) {
      setError("Please enter valid positive numbers for Price and Tax Rate.");
      return;
    }

    try {
      const res = calculateSalesTax({ price: p, taxRate: r });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Net Price (Before Tax) ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            placeholder="e.g., 150"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax-rate">Sales Tax Rate (%)</Label>
          <Input
            id="tax-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 8.25"
            value={taxRate}
            onChange={(e) => { setTaxRate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Sales Tax
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Gross Price (After Tax)</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.totalAmount}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Original Net Price</span>
              <p className="text-lg font-bold mt-0.5">${result.originalAmount}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Sales Tax Amount ({taxRate}%)</span>
              <p className="text-lg font-bold mt-0.5 text-blue-500">${result.taxAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
