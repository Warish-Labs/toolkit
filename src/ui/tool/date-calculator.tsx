"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateDateAdjustment, type DateUnit, type DateDirection } from "@/src/logic/date-calc";

export function DateCalculatorTool() {
  const [startDate, setStartDate] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<DateUnit>("days");
  const [direction, setDirection] = useState<DateDirection>("add");
  const [result, setResult] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 0) {
      setError("Please enter a valid positive number.");
      return;
    }

    try {
      const res = calculateDateAdjustment({
        startDate: new Date(startDate),
        value: val,
        unit,
        direction,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <Label htmlFor="direction">Operation</Label>
          <Select value={direction} onValueChange={(val) => { setDirection(val as DateDirection); setResult(null); }}>
            <SelectTrigger id="direction">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add (Go Forward)</SelectItem>
              <SelectItem value="subtract">Subtract (Go Backward)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="value">Amount</Label>
          <Input
            id="value"
            type="number"
            min="0"
            placeholder="e.g., 30"
            value={value}
            onChange={(e) => { setValue(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={unit} onValueChange={(val) => { setUnit(val as DateUnit); setResult(null); }}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Target Date
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-3">
          <div className="text-center py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resulting Target Date</span>
            <p className="text-2xl font-extrabold mt-1 text-foreground">{formatDate(result)}</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{result.toISOString().split("T")[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
