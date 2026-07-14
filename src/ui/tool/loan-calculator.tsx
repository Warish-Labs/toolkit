"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateLoan, type LoanResult } from "@/src/logic/loan";

export function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
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
      const res = calculateLoan({
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
            placeholder="e.g., 25000"
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
            placeholder="e.g., 5.0"
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
            placeholder={tenureType === "years" ? "e.g., 3" : "e.g., 36"}
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
        Calculate Loan
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Monthly Payment</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.monthlyPayment}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Interest Payable</span>
              <p className="text-xl font-bold mt-1">${result.totalInterest}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Amount Payable (Principal + Interest)</span>
              <p className="text-xl font-bold mt-1">${result.totalPayment}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
            >
              {showSchedule ? "Hide" : "Show"} Amortization Schedule Table
            </button>

            {showSchedule && (
              <div className="overflow-x-auto border border-border/40 rounded-lg max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-border/30 text-xs text-left">
                  <thead className="bg-muted/80 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Month</th>
                      <th className="px-4 py-2 font-semibold">Payment</th>
                      <th className="px-4 py-2 font-semibold">Principal Paid</th>
                      <th className="px-4 py-2 font-semibold">Interest Paid</th>
                      <th className="px-4 py-2 font-semibold">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 bg-background/20">
                    {result.schedule.map((entry) => (
                      <tr key={entry.month} className="hover:bg-muted/20">
                        <td className="px-4 py-2 font-mono">{entry.month}</td>
                        <td className="px-4 py-2 font-mono">${entry.payment}</td>
                        <td className="px-4 py-2 font-mono">${entry.principalPaid}</td>
                        <td className="px-4 py-2 font-mono">${entry.interestPaid}</td>
                        <td className="px-4 py-2 font-mono">${entry.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
