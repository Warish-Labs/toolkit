"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculatePercentage, type PercentageMode } from "@/src/logic/percentage";

const modes: { value: PercentageMode; label: string; desc: string }[] = [
  { value: "whatIsXPercentOfY", label: "What is X% of Y?", desc: "Find a percentage of a number" },
  { value: "xIsWhatPercentOfY", label: "X is what % of Y?", desc: "Find what percent X is of Y" },
  { value: "percentageChange", label: "% Change", desc: "Calculate percentage change" },
];

export function PercentageCalculatorTool() {
  const [mode, setMode] = useState<PercentageMode>("whatIsXPercentOfY");
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [result, setResult] = useState<{ result: number; formula: string } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const v1 = parseFloat(val1), v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2)) { setError("Enter valid numbers."); return; }
    try { setResult(calculatePercentage(mode, v1, v2)); }
    catch (e) { setError(e instanceof Error ? e.message : "Error"); }
  };

  const labels = mode === "whatIsXPercentOfY" ? ["Percentage (%)", "Number"] : mode === "xIsWhatPercentOfY" ? ["Value", "Total"] : ["Original Value", "New Value"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button key={m.value} onClick={() => { setMode(m.value); setResult(null); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === m.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="val1">{labels[0]}</Label>
          <Input id="val1" type="number" step="any" value={val1} onChange={(e) => setVal1(e.target.value)} placeholder="Enter value" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="val2">{labels[1]}</Label>
          <Input id="val2" type="number" step="any" value={val2} onChange={(e) => setVal2(e.target.value)} placeholder="Enter value" />
        </div>
      </div>
      <button onClick={calculate} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring">Calculate</button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-6 text-center">
          <p className="text-3xl font-bold">{result.result}{mode !== "whatIsXPercentOfY" ? "%" : ""}</p>
          <p className="mt-2 text-sm text-muted-foreground">{result.formula}</p>
        </div>
      )}
    </div>
  );
}
