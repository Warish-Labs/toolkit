"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateBmr, type Gender, type BmrFormula, type UnitSystem } from "@/src/logic/bmr";

export function BmrCalculatorTool() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [formula, setFormula] = useState<BmrFormula>("mifflin");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmr, setBmr] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const a = parseInt(age, 10);
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(a) || isNaN(w) || isNaN(h)) {
      setError("Please enter valid numbers for age, weight, and height.");
      return;
    }

    try {
      const result = calculateBmr({
        gender,
        age: a,
        weight: w,
        height: h,
        unit,
        formula,
      });
      setBmr(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={(val) => { setGender(val as Gender); setBmr(null); }}>
            <SelectTrigger id="gender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit System</Label>
          <Select value={unit} onValueChange={(val) => { setUnit(val as UnitSystem); setBmr(null); }}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg / cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs / inches)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formula">Formula Model</Label>
          <Select value={formula} onValueChange={(val) => { setFormula(val as BmrFormula); setBmr(null); }}>
            <SelectTrigger id="formula">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mifflin">Mifflin-St Jeor (Modern)</SelectItem>
              <SelectItem value="harris">Harris-Benedict (Revised)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            type="number"
            min="1"
            placeholder="e.g., 28"
            value={age}
            onChange={(e) => { setAge(e.target.value); setBmr(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input
            id="weight"
            type="number"
            min="1"
            placeholder={unit === "metric" ? "70" : "154"}
            value={weight}
            onChange={(e) => { setWeight(e.target.value); setBmr(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            id="height"
            type="number"
            min="1"
            placeholder={unit === "metric" ? "175" : "69"}
            value={height}
            onChange={(e) => { setHeight(e.target.value); setBmr(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate BMR
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {bmr !== null && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Basal Metabolic Rate (BMR)</span>
            <p className="text-4xl font-extrabold mt-2 text-foreground">{bmr} kcal/day</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
              This is the energy (in calories) your body needs to maintain basic life-sustaining functions while at complete rest.
            </p>
          </div>

          <div className="border-t border-border/40 pt-4 space-y-2">
            <h4 className="text-sm font-semibold">Rough Daily Estimate by Activity Level:</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span>Sedentary (no exercise)</span>
                <span className="font-semibold">{Math.round(bmr * 1.2)} kcal/day</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span>Light Activity (1-3 days/wk)</span>
                <span className="font-semibold">{Math.round(bmr * 1.375)} kcal/day</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span>Moderate Activity (3-5 days/wk)</span>
                <span className="font-semibold">{Math.round(bmr * 1.55)} kcal/day</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span>High Activity (6-7 days/wk)</span>
                <span className="font-semibold">{Math.round(bmr * 1.725)} kcal/day</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
