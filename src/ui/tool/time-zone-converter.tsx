"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { convertTimeZone, TIME_ZONES } from "@/src/logic/time-zone";

export function TimeZoneConverterTool() {
  const today = new Date();
  const formatIsoDate = (d: Date) => d.toISOString().split("T")[0];
  const formatIsoTime = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [dateStr, setDateStr] = useState(formatIsoDate(today));
  const [timeStr, setTimeStr] = useState(formatIsoTime(today));
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("IST");
  const [result, setResult] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    if (!dateStr || !timeStr) {
      setError("Please select a valid date and time.");
      return;
    }

    try {
      const res = convertTimeZone({
        dateStr,
        timeStr,
        sourceZoneCode: sourceZone,
        targetZoneCode: targetZone,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error");
    }
  };

  const formatResultDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatResultTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="conv-date">Date</Label>
          <Input
            id="conv-date"
            type="date"
            value={dateStr}
            onChange={(e) => { setDateStr(e.target.value); setResult(null); }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-time">Time</Label>
          <Input
            id="conv-time"
            type="time"
            value={timeStr}
            onChange={(e) => { setTimeStr(e.target.value); setResult(null); }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="source-zone">From Time Zone</Label>
          <Select value={sourceZone} onValueChange={(val) => { setSourceZone(val); setResult(null); }}>
            <SelectTrigger id="source-zone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_ZONES.map((tz) => (
                <SelectItem key={tz.code} value={tz.code}>
                  {tz.code} - {tz.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-zone">To Time Zone</Label>
          <Select value={targetZone} onValueChange={(val) => { setTargetZone(val); setResult(null); }}>
            <SelectTrigger id="target-zone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_ZONES.map((tz) => (
                <SelectItem key={tz.code} value={tz.code}>
                  {tz.code} - {tz.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleConvert}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Convert Time
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-4">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Converted Time ({targetZone})</span>
            <p className="text-3xl font-extrabold mt-1 text-primary">{formatResultTime(result)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatResultDate(result)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
