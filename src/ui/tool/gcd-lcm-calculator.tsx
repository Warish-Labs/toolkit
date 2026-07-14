"use client";

import { useState } from "react";
import { calculateGcdLcm, type GcdLcmResult } from "@/src/logic/gcd-lcm-calculator";

export function GcdLcmCalculatorTool() {
  const [numbersInput, setNumbersInput] = useState("12, 18, 30");
  const [result, setResult] = useState<GcdLcmResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    try {
      const parts = numbersInput
        .split(',')
        .map(p => parseFloat(p.trim()))
        .filter(p => !isNaN(p));
      
      if (parts.length < 2) {
        throw new Error("Please enter at least two numbers separated by commas.");
      }

      const res = calculateGcdLcm(parts);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation failed.");
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="gcd-numbers-input" className="text-sm font-medium">Numbers (comma separated)</label>
        <input
          id="gcd-numbers-input"
          type="text"
          value={numbersInput}
          onChange={(e) => setNumbersInput(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          placeholder="e.g. 12, 18, 30"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate GCD & LCM
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {result && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Greatest Common Divisor (GCD)</span>
              <span className="text-2xl font-mono font-extrabold text-primary select-all">{result.gcd}</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Least Common Multiple (LCM)</span>
              <span className="text-2xl font-mono font-extrabold text-primary select-all">{result.lcm}</span>
            </div>
          </div>

          {result.steps.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Euclidean Division Steps</span>
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5 font-mono text-xs max-h-[250px] overflow-y-auto">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-border/20 last:border-0 hover:bg-muted/40 px-2 rounded">
                    <span className="text-muted-foreground">Step {idx + 1}:</span>
                    <span className="font-semibold">{step.equation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
