"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateWorkingDays, type WorkingDaysResult } from "@/src/logic/working-days";

export function WorkingDaysCalculatorTool() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekends, setWeekends] = useState<number[]>([0, 6]); // Default Saturday (6) and Sunday (0)
  const [holidaysText, setHolidaysText] = useState("");
  const [result, setResult] = useState<WorkingDaysResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    // Parse holidays line-by-line
    const holidays = holidaysText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    try {
      const res = calculateWorkingDays({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weekendDays: weekends,
        holidays,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const handleWeekendToggle = (day: number) => {
    if (weekends.includes(day)) {
      setWeekends(weekends.filter((d) => d !== day));
    } else {
      setWeekends([...weekends, day]);
    }
    setResult(null);
  };

  const daysOfWeek = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
  ];

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
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Select Weekend Days</Label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const isWeekend = weekends.includes(day.value);
              return (
                <button
                  key={day.value}
                  onClick={() => handleWeekendToggle(day.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${isWeekend ? "bg-destructive/10 border-destructive text-destructive font-semibold" : "bg-muted text-muted-foreground border-transparent hover:text-foreground"}`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="holidays">Custom Holidays (YYYY-MM-DD, one per line)</Label>
          <textarea
            id="holidays"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g.&#10;2026-12-25&#10;2026-01-01"
            value={holidaysText}
            onChange={(e) => { setHolidaysText(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Working Days
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Working Days (Weekdays)</span>
            <p className="text-4xl font-extrabold mt-1 text-emerald-500">{result.workingDays} days</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm text-center">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Weekend Days</span>
              <p className="text-lg font-bold mt-1 text-destructive">{result.weekendDays} days</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Holidays Skipped</span>
              <p className="text-lg font-bold mt-1">{result.holidaysCount} days</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Span</span>
              <p className="text-lg font-bold mt-1">{result.totalDays} days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
