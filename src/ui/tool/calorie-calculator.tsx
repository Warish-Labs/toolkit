"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateCalories, type ActivityLevel, ACTIVITY_LABELS, type CalorieResult } from "@/src/logic/calorie";
import type { Gender, BmrFormula, UnitSystem } from "@/src/logic/bmr";

export function CalorieCalculatorTool() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [formula, setFormula] = useState<BmrFormula>("mifflin");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<CalorieResult | null>(null);
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
      const calorieResult = calculateCalories({
        gender,
        age: a,
        weight: w,
        height: h,
        unit,
        formula,
        activity,
      });
      setResult(calorieResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={(val) => { setGender(val as Gender); setResult(null); }}>
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
          <Select value={unit} onValueChange={(val) => { setUnit(val as UnitSystem); setResult(null); }}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg/cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs/in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formula">BMR Formula</Label>
          <Select value={formula} onValueChange={(val) => { setFormula(val as BmrFormula); setResult(null); }}>
            <SelectTrigger id="formula">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mifflin">Mifflin-St Jeor</SelectItem>
              <SelectItem value="harris">Harris-Benedict</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity">Activity Level</Label>
          <Select value={activity} onValueChange={(val) => { setActivity(val as ActivityLevel); setResult(null); }}>
            <SelectTrigger id="activity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_LABELS).map(([key, item]) => (
                <SelectItem key={key} value={key}>
                  {item.title}
                </SelectItem>
              ))}
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
            onChange={(e) => { setAge(e.target.value); setResult(null); }}
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
            onChange={(e) => { setWeight(e.target.value); setResult(null); }}
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
            onChange={(e) => { setHeight(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Caloric Needs
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Maintenance Calories</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">{result.maintenance} kcal/day</p>
            <p className="text-xs text-muted-foreground mt-2">
              BMR ({result.bmr} kcal) × activity multiplier ({ACTIVITY_LABELS[activity].title} - {ACTIVITY_LABELS[activity].desc})
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-tight text-foreground">Target Calories by Goal:</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 border border-border/60 rounded-lg space-y-1 bg-background/50 hover:bg-background/80 transition-colors">
                <span className="text-xs font-medium text-blue-500 uppercase">Weight Loss Goals</span>
                <div className="flex justify-between text-xs py-1 border-b border-border/20">
                  <span>Mild Loss (0.25 kg/wk)</span>
                  <span className="font-semibold">{result.goals.mildLoss} kcal</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-border/20">
                  <span>Normal Loss (0.5 kg/wk)</span>
                  <span className="font-semibold">{result.goals.weightLoss} kcal</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span>Extreme Loss (1 kg/wk)</span>
                  <span className="font-semibold text-destructive">{result.goals.extremeLoss} kcal</span>
                </div>
              </div>

              <div className="p-3 border border-border/60 rounded-lg space-y-1 bg-background/50 hover:bg-background/80 transition-colors">
                <span className="text-xs font-medium text-emerald-500 uppercase">Weight Gain Goals</span>
                <div className="flex justify-between text-xs py-1 border-b border-border/20">
                  <span>Mild Gain (0.25 kg/wk)</span>
                  <span className="font-semibold">{result.goals.mildGain} kcal</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-border/20">
                  <span>Normal Gain (0.5 kg/wk)</span>
                  <span className="font-semibold">{result.goals.weightGain} kcal</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span>Extreme Gain (1 kg/wk)</span>
                  <span className="font-semibold">{result.goals.extremeGain} kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
