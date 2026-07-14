"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateDiscount, type DiscountResult } from "@/src/logic/discount";

export function DiscountCalculatorTool() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [additionalDiscountPercent, setAdditionalDiscountPercent] = useState("");
  const [result, setResult] = useState<DiscountResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const price = parseFloat(originalPrice);
    const primary = parseFloat(discountPercent);
    const secondary = parseFloat(additionalDiscountPercent || "0");

    if (isNaN(price) || isNaN(primary)) {
      setError("Please enter valid positive numbers for price and primary discount.");
      return;
    }

    try {
      const res = calculateDiscount({
        originalPrice: price,
        discountPercent: primary,
        additionalDiscountPercent: secondary,
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
          <Label htmlFor="price">Original Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            placeholder="e.g., 120"
            value={originalPrice}
            onChange={(e) => { setOriginalPrice(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 20"
            value={discountPercent}
            onChange={(e) => { setDiscountPercent(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-discount">Additional Discount (%, optional)</Label>
          <Input
            id="additional-discount"
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 10"
            value={additionalDiscountPercent}
            onChange={(e) => { setAdditionalDiscountPercent(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Discount
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Final Price After Discount</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.finalPrice}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">You Save</span>
              <p className="text-lg font-bold mt-0.5 text-emerald-500">${result.savings}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Original Price</span>
              <p className="text-lg font-bold mt-0.5">${originalPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
