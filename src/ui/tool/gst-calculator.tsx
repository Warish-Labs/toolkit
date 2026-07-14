"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateTax, type TaxAction, type TaxResult } from "@/src/logic/gst";

export function GstCalculatorTool() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18"); // standard GST rate defaults
  const [action, setAction] = useState<TaxAction>("add");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const a = parseFloat(amount);
    const r = parseFloat(rate);

    if (isNaN(a) || isNaN(r)) {
      setError("Please enter valid positive numbers for Amount and GST Rate.");
      return;
    }

    try {
      const res = calculateTax({ amount: a, rate: r, action });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const gstRates = ["5", "12", "18", "28"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Base Amount ($)</Label>
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
          <Label htmlFor="action">Action</Label>
          <Select value={action} onValueChange={(val) => { setAction(val as TaxAction); setResult(null); }}>
            <SelectTrigger id="action">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add GST (Inclusive total)</SelectItem>
              <SelectItem value="remove">Remove GST (Exclusive base)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>GST Rate (%)</Label>
        <div className="flex flex-wrap gap-2">
          {gstRates.map((r) => (
            <button
              key={r}
              onClick={() => { setRate(r); setResult(null); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${rate === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {r}%
            </button>
          ))}
          <div className="w-28">
            <Input
              type="number"
              placeholder="Custom %"
              value={gstRates.includes(rate) ? "" : rate}
              onChange={(e) => { setRate(e.target.value); setResult(null); }}
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate GST
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {action === "add" ? "Total Price (GST Inclusive)" : "Original Price (GST Exclusive)"}
            </span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">
              ${action === "add" ? result.totalAmount : result.originalAmount}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Base Net Amount</span>
              <p className="text-lg font-bold mt-0.5">${result.originalAmount}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">GST Amount ({rate}%)</span>
              <p className="text-lg font-bold mt-0.5 text-blue-500">${result.taxAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
