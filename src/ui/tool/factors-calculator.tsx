"use client";

import { useState } from "react";
import { calculateFactors, type FactorizationResult } from "@/src/logic/factors-calculator";

export function FactorsCalculatorTool() {
  const [inputVal, setInputVal] = useState("100");
  const [result, setResult] = useState<FactorizationResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    try {
      const val = parseInt(inputVal, 10);
      if (isNaN(val) || val < 1) {
        throw new Error("Please enter a positive integer.");
      }
      const res = calculateFactors(val);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation failed.");
      setResult(null);
    }
  };

  const handleCopyFactors = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.factors.join(', '));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="factors-num-input" className="text-sm font-medium">Positive Integer</label>
        <input
          id="factors-num-input"
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Factors
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {result && (
        <div className="space-y-4">
          {/* Factorization equations */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center pb-3 border-b border-border/40">
              <span className="font-sans font-bold text-muted-foreground uppercase tracking-wider">Prime Factorization:</span>
              <span className="text-sm font-extrabold text-primary select-all">{result.primeFactorizationString}</span>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3 font-sans text-center">
              <div className="bg-card p-3 border rounded-lg">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Number of Factors</span>
                <span className="text-base font-extrabold">{result.numberOfFactors}</span>
              </div>
              <div className="bg-card p-3 border rounded-lg">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sum of Factors</span>
                <span className="text-base font-extrabold">{result.sumOfFactors}</span>
              </div>
              <div className="bg-card p-3 border rounded-lg">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Product of Factors</span>
                <span className="text-base font-extrabold truncate max-w-full block" title={result.productOfFactors.toString()}>
                  {result.productOfFactors === Infinity ? 'Infinity' : result.productOfFactors}
                </span>
              </div>
            </div>
          </div>

          {/* Factor List */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Divisors / Factors list</span>
              <button
                onClick={handleCopyFactors}
                className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
              >
                Copy List
              </button>
            </div>
            <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 font-mono text-xs max-h-[200px] overflow-y-auto">
              {result.factors.map((f) => (
                <span key={f} className="px-2 py-0.5 bg-card border rounded shadow-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
