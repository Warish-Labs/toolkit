"use client";

import { useState, useEffect } from "react";
import { parseUnixTimestamp, parseDateStringToTimestamp, type TimestampAnalysis } from "@/src/logic/unix-timestamp";

export function UnixTimestampConverterTool() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  
  // Epoch to Date
  const [epochInput, setEpochInput] = useState("");
  const [epochModeMs, setEpochModeMs] = useState(false);
  const [epochResult, setEpochResult] = useState<TimestampAnalysis | null>(null);
  const [epochError, setEpochError] = useState("");

  // Date to Epoch
  const [dateInput, setDateInput] = useState("");
  const [dateResult, setDateResult] = useState<TimestampAnalysis | null>(null);
  const [dateError, setDateError] = useState("");

  // Live timer for current epoch
  useEffect(() => {
    setCurrentEpoch(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEpochToDate = () => {
    setEpochError("");
    try {
      const num = Number(epochInput.trim());
      if (isNaN(num) || epochInput.trim() === "") {
        throw new Error("Invalid timestamp number");
      }
      const res = parseUnixTimestamp(num, epochModeMs);
      setEpochResult(res);
    } catch (e) {
      setEpochError(e instanceof Error ? e.message : "Error parsing timestamp");
      setEpochResult(null);
    }
  };

  const handleDateToEpoch = () => {
    setDateError("");
    try {
      const res = parseDateStringToTimestamp(dateInput);
      setDateResult(res);
    } catch (e) {
      setDateError(e instanceof Error ? e.message : "Error parsing date string");
      setDateResult(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Current Live Epoch Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Unix Epoch Time</span>
          <div className="text-2xl font-mono font-extrabold text-foreground tracking-wide">
            {currentEpoch}
          </div>
        </div>
        <button
          onClick={() => handleCopy(currentEpoch.toString())}
          className="text-xs bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shrink-0"
        >
          Copy Current Epoch
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Epoch to Date Block */}
        <div className="space-y-4 border border-border/60 p-5 rounded-2xl bg-card">
          <h3 className="font-bold text-sm">Unix Epoch to Human-Readable Date</h3>
          
          <div className="space-y-2">
            <label htmlFor="epoch-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Timestamp Input</label>
            <input
              id="epoch-input"
              type="text"
              placeholder={epochModeMs ? "e.g. 1781623902200" : "e.g. 1781623902"}
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              id="epoch-mode-ms"
              type="checkbox"
              checked={epochModeMs}
              onChange={(e) => setEpochModeMs(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="epoch-mode-ms" className="text-xs font-medium cursor-pointer">Input is in Milliseconds (ms)</label>
          </div>

          <button
            onClick={handleEpochToDate}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert Epoch
          </button>

          {epochError && <p className="text-xs text-destructive">{epochError}</p>}

          {epochResult && (
            <div className="space-y-2.5 pt-2 text-xs font-mono border-t border-border/40">
              <div className="flex justify-between items-center hover:bg-muted/40 p-1.5 rounded">
                <span className="text-muted-foreground font-sans">GMT/UTC:</span>
                <span className="text-right truncate max-w-[200px]" title={epochResult.utcString}>{epochResult.utcString}</span>
              </div>
              <div className="flex justify-between items-center hover:bg-muted/40 p-1.5 rounded">
                <span className="text-muted-foreground font-sans">Local:</span>
                <span className="text-right truncate max-w-[200px]" title={epochResult.localString}>{epochResult.localString}</span>
              </div>
              <div className="flex justify-between items-center hover:bg-muted/40 p-1.5 rounded">
                <span className="text-muted-foreground font-sans">Relative:</span>
                <span>{epochResult.relativeTime}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date to Epoch Block */}
        <div className="space-y-4 border border-border/60 p-5 rounded-2xl bg-card">
          <h3 className="font-bold text-sm">Human-Readable Date to Epoch</h3>

          <div className="space-y-2">
            <label htmlFor="date-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Date String Input</label>
            <input
              id="date-input"
              type="text"
              placeholder="e.g. 2026-07-14 19:12:00 or ISO strings"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
            />
          </div>

          <button
            onClick={handleDateToEpoch}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert Date
          </button>

          {dateError && <p className="text-xs text-destructive">{dateError}</p>}

          {dateResult && (
            <div className="space-y-2.5 pt-2 text-xs font-mono border-t border-border/40">
              <div className="flex justify-between items-center hover:bg-muted/40 p-1.5 rounded">
                <span className="text-muted-foreground font-sans">Seconds (s):</span>
                <div className="flex gap-2 items-center">
                  <span>{dateResult.seconds}</span>
                  <button
                    onClick={() => handleCopy(dateResult.seconds.toString())}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center hover:bg-muted/40 p-1.5 rounded">
                <span className="text-muted-foreground font-sans">Milliseconds (ms):</span>
                <div className="flex gap-2 items-center">
                  <span>{dateResult.milliseconds}</span>
                  <button
                    onClick={() => handleCopy(dateResult.milliseconds.toString())}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
