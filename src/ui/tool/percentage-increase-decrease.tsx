"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculatePercentChange, type PercentOp, type PercentChangeResult } from "@/src/logic/percentage-increase-decrease";

export function PercentageIncreaseDecreaseTool() {
  const [op, setOp] = useState<PercentOp>("increase");
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [result, setResult] = useState<PercentChangeResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);

    if (isNaN(v1) || isNaN(v2)) {
      setError("Please enter valid numbers in both fields.");
      return;
    }

    try {
      setResult(calculatePercentChange(op, v1, v2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const getVal1Label = () => {
    if (op === "increase" || op === "decrease") return "Percentage (%)";
    return "Starting Value";
  };

  const getVal2Label = () => {
    if (op === "increase" || op === "decrease") return "Base Value";
    return "Final Value";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="operation-type">What do you want to calculate?</Label>
        <Select
          value={op}
          onValueChange={(value) => {
            setOp(value as PercentOp);
            setResult(null);
            setError("");
          }}
        >
          <SelectTrigger id="operation-type" className="w-full">
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="increase">Increase Base Value by Percentage</SelectItem>
            <SelectItem value="decrease">Decrease Base Value by Percentage</SelectItem>
            <SelectItem value="difference">Percentage Change/Difference between two values</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="val1">{getVal1Label()}</Label>
          <Input
            id="val1"
            type="number"
            placeholder={op === "difference" ? "e.g., 100" : "e.g., 15"}
            value={val1}
            onChange={(e) => {
              setVal1(e.target.value);
              setResult(null);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="val2">{getVal2Label()}</Label>
          <Input
            id="val2"
            type="number"
            placeholder={op === "difference" ? "e.g., 150" : "e.g., 200"}
            value={val2}
            onChange={(e) => {
              setVal2(e.target.value);
              setResult(null);
            }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-3">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</span>
            <p className="text-3xl font-extrabold mt-1 text-foreground">
              {op === "difference" ? `${result.result}%` : result.result}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Calculation Details</span>
            <p className="text-sm text-muted-foreground mt-1 font-mono break-all">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
