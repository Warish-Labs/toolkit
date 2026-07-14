"use client";

import { useState } from "react";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";

export function CalendarGeneratorTool() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear().toString());
  const [month, setMonth] = useState(today.getMonth().toString()); // 0-indexed
  const [startDay, setStartDay] = useState<"0" | "1">("0"); // 0 = Sunday, 1 = Monday

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearNum = parseInt(year, 10) || today.getFullYear();
  const monthNum = parseInt(month, 10);

  // Generate calendar days
  const firstDayOfMonth = new Date(yearNum, monthNum, 1);
  const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();

  // Find start day index offset
  // firstDayOfMonth.getDay() gives 0 (Sun) to 6 (Sat)
  let startOffset = firstDayOfMonth.getDay();
  if (startDay === "1") {
    // If Monday is starting day:
    // Sunday (0) becomes 6, Monday (1) becomes 0, etc.
    startOffset = startOffset === 0 ? 6 : startOffset - 1;
  }

  const daysGrid: (number | null)[] = [];
  // Fill initial blanks
  for (let i = 0; i < startOffset; i++) {
    daysGrid.push(null);
  }
  // Fill calendar dates
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const weekdays = startDay === "0" 
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrint = () => {
    window.print();
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      today.getDate() === day &&
      today.getMonth() === monthNum &&
      today.getFullYear() === yearNum
    );
  };

  // Generate lists of years (e.g. 50 years back and 20 years forward)
  const yearsList = [];
  for (let y = today.getFullYear() - 50; y <= today.getFullYear() + 20; y++) {
    yearsList.push(y.toString());
  }

  return (
    <div className="space-y-6 print:p-0 print:border-0 print:bg-white print:text-black">
      <div className="grid gap-4 sm:grid-cols-3 print:hidden">
        <div className="space-y-2">
          <Label htmlFor="calendar-year">Year</Label>
          <Select value={year} onValueChange={(val) => { if (val) setYear(val); }}>
            <SelectTrigger id="calendar-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearsList.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calendar-month">Month</Label>
          <Select value={month} onValueChange={(val) => { if (val) setMonth(val); }}>
            <SelectTrigger id="calendar-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, idx) => (
                <SelectItem key={m} value={idx.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calendar-start">Week Starts On</Label>
          <Select value={startDay} onValueChange={(val) => setStartDay(val as "0" | "1")}>
            <SelectTrigger id="calendar-start">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sunday</SelectItem>
              <SelectItem value="1">Monday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center print:hidden pt-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary/80 focus-ring"
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Printable Calendar Grid */}
      <div className="border border-border/60 rounded-2xl p-4 bg-muted/10 print:border-0 print:p-0 print:bg-transparent">
        <div className="text-center pb-4 border-b border-border/40 print:pb-2">
          <h2 className="text-2xl font-bold text-foreground print:text-black">
            {months[monthNum]} {yearNum}
          </h2>
        </div>

        <div className="grid grid-cols-7 gap-1 mt-4 text-center text-xs font-semibold print:gap-0 print:border-t print:border-l print:border-black/20">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-2 text-muted-foreground uppercase tracking-wider print:text-black print:border-r print:border-b print:border-black/20 print:bg-gray-100"
            >
              {day}
            </div>
          ))}

          {daysGrid.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[50px] sm:min-h-[70px] p-1 border border-border/40 rounded-lg flex flex-col justify-between items-end print:rounded-none print:border-r print:border-b print:border-black/20 ${day === null ? "bg-muted/10 opacity-30 print:bg-transparent" : "bg-background/80"} ${isToday(day) ? "ring-2 ring-primary bg-primary/5 text-primary font-bold print:ring-0 print:bg-gray-200" : ""}`}
            >
              {day && (
                <>
                  <span className="text-xs">{day}</span>
                  {/* Empty spacer or place to scribble notes if printed */}
                  <span className="h-4 w-4" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
