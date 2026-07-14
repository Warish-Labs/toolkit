"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateTimeDuration, type TimeDurationResult } from "@/src/logic/time-duration";

export function TimeDurationCalculatorTool() {
  const [startTime, setStartTime] = useState("09:00");
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");
  const [endTime, setEndTime] = useState("05:00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("PM");
  const [crossesMidnight, setCrossesMidnight] = useState(false);
  const [result, setResult] = useState<TimeDurationResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    try {
      const res = calculateTimeDuration({
        startTime,
        startPeriod,
        endTime,
        endPeriod,
        crossesMidnight,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 border border-border/40 rounded-xl p-4 bg-muted/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Time</h4>
          <div className="flex gap-2">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => { setStartTime(e.target.value); setResult(null); }}
              className="w-full"
            />
            <Select value={startPeriod} onValueChange={(val) => { setStartPeriod(val as "AM" | "PM"); setResult(null); }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 border border-border/40 rounded-xl p-4 bg-muted/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Time</h4>
          <div className="flex gap-2">
            <Input
              type="time"
              value={endTime}
              onChange={(e) => { setEndTime(e.target.value); setResult(null); }}
              className="w-full"
            />
            <Select value={endPeriod} onValueChange={(val) => { setEndPeriod(val as "AM" | "PM"); setResult(null); }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="crosses-midnight"
          type="checkbox"
          checked={crossesMidnight}
          onChange={(e) => { setCrossesMidnight(e.target.checked); setResult(null); }}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="crosses-midnight" className="cursor-pointer text-sm">
          Crosses midnight (End time is on the next day)
        </Label>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Time Duration
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Duration</span>
            <p className="text-3xl font-extrabold mt-1 text-foreground">
              {result.hours} hours and {result.minutes} minutes
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm text-center">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Hours (Decimal)</span>
              <p className="text-lg font-bold mt-1 text-primary">{result.totalHoursDecimal} hours</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Minutes</span>
              <p className="text-lg font-bold mt-1">{result.totalMinutes} minutes</p>
            </div>
            <div className="p-3 border border-border/60 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground">Total Seconds</span>
              <p className="text-lg font-bold mt-1">{result.totalSeconds} seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
