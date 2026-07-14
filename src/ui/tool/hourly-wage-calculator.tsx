"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateHourlyWage, type HourlyWageResult } from "@/src/logic/hourly-wage";

export function HourlyWageCalculatorTool() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [overtimeMultiplier, setOvertimeMultiplier] = useState("1.5");
  const [unpaidWeeksOff, setUnpaidWeeksOff] = useState("0");
  const [result, setResult] = useState<HourlyWageResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const rate = parseFloat(hourlyRate);
    const hpw = parseFloat(hoursPerWeek);
    const oth = parseFloat(overtimeHours || "0");
    const otm = parseFloat(overtimeMultiplier || "1.5");
    const uwo = parseFloat(unpaidWeeksOff || "0");

    if (isNaN(rate) || isNaN(hpw)) {
      setError("Please enter valid positive numbers for Hourly Rate and Hours Worked.");
      return;
    }

    try {
      const res = calculateHourlyWage({
        hourlyRate: rate,
        hoursPerWeek: hpw,
        overtimeHours: oth,
        overtimeMultiplier: otm,
        unpaidWeeksOff: uwo,
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
          <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
          <Input
            id="hourly-rate"
            type="number"
            min="0"
            placeholder="e.g., 25"
            value={hourlyRate}
            onChange={(e) => { setHourlyRate(e.target.value); setResult(null); }}
          />
        </div>

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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ot-hours">Overtime Hours per Week</Label>
          <Input
            id="ot-hours"
            type="number"
            min="0"
            placeholder="e.g., 5"
            value={overtimeHours}
            onChange={(e) => { setOvertimeHours(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ot-rate">Overtime Multiplier</Label>
          <Input
            id="ot-rate"
            type="number"
            step="0.1"
            min="0"
            placeholder="1.5"
            value={overtimeMultiplier}
            onChange={(e) => { setOvertimeMultiplier(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unpaid-time-off">Unpaid Weeks Off per Year</Label>
          <Input
            id="unpaid-time-off"
            type="number"
            min="0"
            max="52"
            placeholder="0"
            value={unpaidWeeksOff}
            onChange={(e) => { setUnpaidWeeksOff(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Gross Pay
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projected Gross Annual Pay</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.annualPay}</p>
            <p className="text-xs text-muted-foreground mt-1">Based on {52 - parseInt(unpaidWeeksOff || "0")} paid weeks/year</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Weekly Standard Pay</span>
              <p className="text-lg font-bold mt-0.5">${result.standardWeeklyPay}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 text-amber-500">
              <span className="text-xs text-muted-foreground">Weekly Overtime Pay</span>
              <p className="text-lg font-bold mt-0.5">${result.overtimeWeeklyPay}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Estimated Monthly Pay</span>
              <p className="text-lg font-bold mt-0.5">${result.monthlyPay}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
