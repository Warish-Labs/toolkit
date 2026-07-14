"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateDateDifference, type DateDiffResult } from "@/src/logic/date-difference";

export function DateDifferenceCalculatorTool() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [result, setResult] = useState<DateDiffResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      const res = calculateDateDifference(
        new Date(startDate),
        new Date(endDate),
        includeEndDate
      );
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="include-end-date"
          type="checkbox"
          checked={includeEndDate}
          onChange={(e) => { setIncludeEndDate(e.target.checked); setResult(null); }}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="include-end-date" className="cursor-pointer text-sm">
          Include end date in calculation (adds 1 day)
        </Label>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Date Difference
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exact Difference</span>
            <p className="text-2xl font-extrabold mt-1 text-foreground">
              {result.years} years, {result.months} months, and {result.days} days
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm text-center">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Days</span>
              <p className="text-xl font-bold mt-1 text-primary">{result.totalDays} days</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Weeks</span>
              <p className="text-xl font-bold mt-1">{result.totalWeeks} weeks</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Months</span>
              <p className="text-xl font-bold mt-1">{result.totalMonths} months</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
