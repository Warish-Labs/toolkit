"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { checkLeapYear, type LeapYearResult } from "@/src/logic/leap-year";

export function LeapYearCheckerTool() {
  const [year, setYear] = useState("");
  const [result, setResult] = useState<LeapYearResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = () => {
    setError("");
    const y = parseInt(year, 10);
    if (isNaN(y) || y < 0) {
      setError("Please enter a valid positive year.");
      return;
    }

    try {
      setResult(checkLeapYear(y));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checking error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="year">Enter Year</Label>
        <Input
          id="year"
          type="number"
          min="0"
          placeholder="e.g., 2024"
          value={year}
          onChange={(e) => { setYear(e.target.value); setResult(null); }}
        />
      </div>

      <button
        onClick={handleCheck}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Check Year
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-3">
          <div className="text-center py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</span>
            <p className={`text-3xl font-extrabold mt-1 ${result.isLeap ? "text-emerald-500" : "text-destructive"}`}>
              {result.isLeap ? "Leap Year" : "Common Year"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{result.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
