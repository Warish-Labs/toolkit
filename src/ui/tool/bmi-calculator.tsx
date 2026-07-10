"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateBmi, type BmiResult, type UnitSystem } from "@/src/logic/bmi";

export function BmiCalculatorTool() {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h)) { setError("Enter valid numbers."); return; }
    try {
      setResult(calculateBmi(w, h, unit));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const bmiBarWidth = result ? Math.min((result.bmi / 40) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["metric", "imperial"] as const).map((u) => (
          <button key={u} onClick={() => { setUnit(u); setResult(null); }} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${unit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/in)"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input id="weight" type="number" min="0" step="0.1" placeholder={unit === "metric" ? "70" : "154"} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "inches"})</Label>
          <Input id="height" type="number" min="0" step="0.1" placeholder={unit === "metric" ? "175" : "69"} value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
      </div>
      <button onClick={calculate} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring">
        Calculate BMI
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="space-y-4">
          <div className="text-center rounded-lg border border-border/60 bg-muted/30 p-6">
            <p className="text-4xl font-bold">{result.bmi}</p>
            <p className={`text-sm font-medium mt-1 ${result.color}`}>{result.label}</p>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 transition-all duration-500" style={{ width: `${bmiBarWidth}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Healthy weight range: {result.healthyRange.min} – {result.healthyRange.max} {unit === "metric" ? "kg" : "lbs"}
          </p>
        </div>
      )}
    </div>
  );
}
