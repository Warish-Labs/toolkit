"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { adjustBusinessDays, calculateBusinessDaysDiff, type BusinessDaysResult } from "@/src/logic/business-days";

export function BusinessDaysCalculatorTool() {
  const [activeTab, setActiveTab] = useState("diff");
  
  // Tab 1: Diff Mode
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Tab 2: Adjust Mode
  const [adjustDate, setAdjustDate] = useState("");
  const [daysToAdjust, setDaysToAdjust] = useState("");
  const [direction, setDirection] = useState<"add" | "subtract">("add");

  const [holidaysText, setHolidaysText] = useState("");
  const [diffResult, setDiffResult] = useState<BusinessDaysResult | null>(null);
  const [adjustResult, setAdjustResult] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const handleCalculateDiff = () => {
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    const holidays = holidaysText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    try {
      const res = calculateBusinessDaysDiff({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        holidays,
      });
      setDiffResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  const handleCalculateAdjust = () => {
    setError("");
    if (!adjustDate) {
      setError("Please select a starting date.");
      return;
    }
    const days = parseInt(daysToAdjust, 10);
    if (isNaN(days) || days < 0) {
      setError("Please enter a valid positive number of business days.");
      return;
    }

    const holidays = holidaysText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    try {
      const adjustedDays = direction === "add" ? days : -days;
      const res = adjustBusinessDays({
        startDate: new Date(adjustDate),
        daysToAdjust: adjustedDays,
        holidays,
      });
      setAdjustResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Adjustment error");
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
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setError(""); setDiffResult(null); setAdjustResult(null); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diff">Business Days Between Dates</TabsTrigger>
          <TabsTrigger value="adjust">Add/Subtract Business Days</TabsTrigger>
        </TabsList>

        <TabsContent value="diff" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setDiffResult(null); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setDiffResult(null); }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holidays-diff">Holidays to Exclude (YYYY-MM-DD, one per line)</Label>
            <textarea
              id="holidays-diff"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g.&#10;2026-12-25"
              value={holidaysText}
              onChange={(e) => { setHolidaysText(e.target.value); setDiffResult(null); setAdjustResult(null); }}
            />
          </div>

          <button
            onClick={handleCalculateDiff}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Calculate Business Days
          </button>

          {diffResult && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
              <div className="text-center py-2 border-b border-border/40 pb-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Days Count (Mon-Fri)</span>
                <p className="text-4xl font-extrabold mt-1 text-emerald-500">{diffResult.businessDaysCount} days</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-sm text-center">
                <div className="p-3 border border-border/60 rounded-lg bg-background/50">
                  <span className="text-xs text-muted-foreground">Weekend Days</span>
                  <p className="text-lg font-bold mt-1 text-destructive">{diffResult.weekendDaysCount} days</p>
                </div>
                <div className="p-3 border border-border/60 rounded-lg bg-background/50">
                  <span className="text-xs text-muted-foreground">Holidays Skipped</span>
                  <p className="text-lg font-bold mt-1">{diffResult.holidaysCount} days</p>
                </div>
                <div className="p-3 border border-border/60 rounded-lg bg-background/50">
                  <span className="text-xs text-muted-foreground">Total Span</span>
                  <p className="text-lg font-bold mt-1">{diffResult.totalDaysCount} days</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="adjust" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="adjust-date">Start Date</Label>
              <Input
                id="adjust-date"
                type="date"
                value={adjustDate}
                onChange={(e) => { setAdjustDate(e.target.value); setAdjustResult(null); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjust-dir">Operation</Label>
              <Select value={direction} onValueChange={(val) => { setDirection(val as "add" | "subtract"); setAdjustResult(null); }}>
                <SelectTrigger id="adjust-dir">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Business Days</SelectItem>
                  <SelectItem value="subtract">Subtract Business Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjust-days">Number of Business Days</Label>
              <Input
                id="adjust-days"
                type="number"
                min="0"
                placeholder="e.g., 10"
                value={daysToAdjust}
                onChange={(e) => { setDaysToAdjust(e.target.value); setAdjustResult(null); }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holidays-adjust">Holidays to Skip (YYYY-MM-DD, one per line)</Label>
            <textarea
              id="holidays-adjust"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g.&#10;2026-12-25"
              value={holidaysText}
              onChange={(e) => { setHolidaysText(e.target.value); setDiffResult(null); setAdjustResult(null); }}
            />
          </div>

          <button
            onClick={handleCalculateAdjust}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Calculate Adjusted Date
          </button>

          {adjustResult && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-3">
              <div className="text-center py-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resulting Target Date</span>
                <p className="text-2xl font-extrabold mt-1 text-foreground">{formatDate(adjustResult)}</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{adjustResult.toISOString().split("T")[0]}</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
