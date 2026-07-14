"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateSalary, type PayPeriod, type SalaryBreakdown } from "@/src/logic/salary";

export function SalaryCalculatorTool() {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<PayPeriod>("annually");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const a = parseFloat(amount);
    const hpw = parseFloat(hoursPerWeek || "40");
    const dpw = parseFloat(daysPerWeek || "5");

    if (isNaN(a) || isNaN(hpw) || isNaN(dpw)) {
      setError("Please enter valid numbers in all fields.");
      return;
    }

    try {
      const res = calculateSalary({
        amount: a,
        period,
        hoursPerWeek: hpw,
        daysPerWeek: dpw,
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
          <Label htmlFor="amount">Salary Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            placeholder="e.g., 60000"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Pay Period / Frequency</Label>
          <Select value={period} onValueChange={(val) => { setPeriod(val as PayPeriod); setResult(null); }}>
            <SelectTrigger id="period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-Weekly (Every 2 weeks)</SelectItem>
              <SelectItem value="semi-monthly">Semi-Monthly (Twice a month)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hours-per-week">Hours Worked per Week</Label>
          <Input
            id="hours-per-week"
            type="number"
            min="1"
            placeholder="40"
            value={hoursPerWeek}
            onChange={(e) => { setHoursPerWeek(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="days-per-week">Days Worked per Week</Label>
          <Input
            id="days-per-week"
            type="number"
            min="1"
            placeholder="5"
            value={daysPerWeek}
            onChange={(e) => { setDaysPerWeek(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Salary Conversion
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <h4 className="text-sm font-bold tracking-tight text-foreground border-b border-border/40 pb-2">Equivalent Wage Breakdown:</h4>
          
          <div className="grid gap-2 text-xs">
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
              <span>Hourly Rate</span>
              <span className="font-semibold">${result.hourly} / hr</span>
            </div>
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
              <span>Daily Earnings</span>
              <span className="font-semibold">${result.daily} / day</span>
            </div>
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
              <span>Weekly Earnings</span>
              <span className="font-semibold">${result.weekly} / week</span>
            </div>
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
              <span>Bi-Weekly Earnings</span>
              <span className="font-semibold">${result.biweekly} / 2 weeks</span>
            </div>
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
              <span>Semi-Monthly Earnings</span>
              <span className="font-semibold">${result.semimonthly} / half-month</span>
            </div>
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
              <span>Monthly Salary</span>
              <span className="font-semibold">${result.monthly} / month</span>
            </div>
            <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors border-t border-border/20 pt-2 font-medium">
              <span>Annual Salary</span>
              <span className="font-bold text-foreground text-sm">${result.annually} / year</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
