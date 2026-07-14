"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateFd, type FdResult } from "@/src/logic/fd";

export function FdCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [result, setResult] = useState<FdResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const t = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      setError("Please enter valid positive numbers.");
      return;
    }

    try {
      const res = calculateFd({
        principal: p,
        interestRate: r,
        tenure: t,
        tenureType,
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
          <Label htmlFor="principal">Invested Amount ($)</Label>
          <Input
            id="principal"
            type="number"
            min="0"
            placeholder="e.g., 10000"
            value={principal}
            onChange={(e) => { setPrincipal(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">Annual Rate of Interest (%)</Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 6.5"
            value={interestRate}
            onChange={(e) => { setInterestRate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tenure">Tenure</Label>
          <Input
            id="tenure"
            type="number"
            min="1"
            placeholder={tenureType === "years" ? "e.g., 5" : "e.g., 60"}
            value={tenure}
            onChange={(e) => { setTenure(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenure-type">Tenure Unit</Label>
          <Select value={tenureType} onValueChange={(val) => { setTenureType(val as "years" | "months"); setResult(null); }}>
            <SelectTrigger id="tenure-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="years">Years</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate FD Maturity
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Value at Maturity</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.maturityAmount}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Invested Capital</span>
              <p className="text-lg font-bold mt-0.5">${result.investedAmount}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-emerald-500">
              <span className="text-xs text-muted-foreground">Compounded Interest Earned</span>
              <p className="text-lg font-bold mt-0.5">${result.interestEarned}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
