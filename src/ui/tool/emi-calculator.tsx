"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateEmi, type EmiResult } from "@/src/logic/emi";

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [result, setResult] = useState<EmiResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const t = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      setError("Please enter valid positive numbers in all input fields.");
      return;
    }

    try {
      const res = calculateEmi({
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
          <Label htmlFor="principal">Loan Principal Amount ($)</Label>
          <Input
            id="principal"
            type="number"
            min="0"
            placeholder="e.g., 50000"
            value={principal}
            onChange={(e) => { setPrincipal(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest">Annual Interest Rate (%)</Label>
          <Input
            id="interest"
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
        Calculate EMI
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly Loan EMI Payment</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.monthlyPayment}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Interest Payable</span>
              <p className="text-xl font-bold mt-1">${result.totalInterest}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{result.interestPercent}% of total payment</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Amount Payable</span>
              <p className="text-xl font-bold mt-1">${result.totalPayment}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{result.principalPercent}% principal loan amount</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${result.principalPercent}%` }}
                title={`Principal: ${result.principalPercent}%`}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${result.interestPercent}%` }}
                title={`Interest: ${result.interestPercent}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Principal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Interest</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
