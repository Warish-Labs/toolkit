"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { calculateAge, type AgeResult } from "@/src/logic/age";

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    if (!birthDate) { setError("Please enter a date of birth."); return; }
    try {
      const end = endDate ? new Date(endDate) : new Date();
      const res = calculateAge(new Date(birthDate), end);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid date");
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birth-date">Date of Birth</Label>
          <Input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date (optional)</Label>
          <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <button onClick={calculate} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring">
        Calculate Age
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Years" value={result.years} />
          <StatCard label="Months" value={result.months} />
          <StatCard label="Days" value={result.days} />
          <StatCard label="Total Days" value={result.totalDays.toLocaleString()} />
          <StatCard label="Total Weeks" value={result.totalWeeks.toLocaleString()} />
          <StatCard label="Next Birthday" value={`${result.daysUntilBirthday} days`} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
