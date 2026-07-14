"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateAgeDifference, type AgeDifferenceResult } from "@/src/logic/age-difference";

export function AgeDifferenceTool() {
  const [dob1, setDob1] = useState("");
  const [dob2, setDob2] = useState("");
  const [result, setResult] = useState<AgeDifferenceResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!dob1 || !dob2) {
      setError("Please select both birth dates.");
      return;
    }

    try {
      const res = calculateAgeDifference(new Date(dob1), new Date(dob2));
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dob1">Birth Date of Person 1</Label>
          <Input
            id="dob1"
            type="date"
            value={dob1}
            onChange={(e) => { setDob1(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob2">Birth Date of Person 2</Label>
          <Input
            id="dob2"
            type="date"
            value={dob2}
            onChange={(e) => { setDob2(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Compare Ages
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Age Comparison</span>
            <p className="text-lg font-bold mt-1 text-foreground">{result.olderPersonLabel}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Person 1 Current Age</span>
              <p className="text-base font-bold">
                {result.person1Age.years}y {result.person1Age.months}m {result.person1Age.days}d
              </p>
              <p className="text-[10px] text-muted-foreground">Total: {result.person1Age.totalDays} days old</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Person 2 Current Age</span>
              <p className="text-base font-bold">
                {result.person2Age.years}y {result.person2Age.months}m {result.person2Age.days}d
              </p>
              <p className="text-[10px] text-muted-foreground">Total: {result.person2Age.totalDays} days old</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
