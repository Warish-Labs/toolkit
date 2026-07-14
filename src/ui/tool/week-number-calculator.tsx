"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateWeekNumber, type WeekNumberResult } from "@/src/logic/week-number";

export function WeekNumberCalculatorTool() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState<WeekNumberResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!date) {
      setError("Please select a date.");
      return;
    }

    try {
      const res = calculateWeekNumber(new Date(date));
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Select Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setResult(null); }}
        />
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Week Details
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ISO-8601 Week Number</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">Week {result.weekNumber}</p>
            <p className="text-xs text-muted-foreground mt-1.5">For year {result.year}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm text-center">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Day of the Week</span>
              <p className="text-lg font-bold mt-1 text-primary">{result.dayOfWeekName}</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Day of the Year</span>
              <p className="text-lg font-bold mt-1">{result.dayOfYear} / 365</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
