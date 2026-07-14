"use client";

import { useState, useEffect, useRef } from "react";

interface LapRecord {
  lapIndex: number;
  lapTime: number; // in ms
  overallTime: number; // in ms
}

export function StopwatchTool() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // overall elapsed time in ms
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  const updateStopwatch = () => {
    const elapsed = Date.now() - startTimeRef.current + accumulatedTimeRef.current;
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(updateStopwatch);
  };

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(updateStopwatch);
  };

  const handlePause = () => {
    if (!isRunning) return;
    setIsRunning(false);
    accumulatedTimeRef.current = time;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  const handleLap = () => {
    if (!isRunning) return;
    const lapIndex = laps.length + 1;
    const lastOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const lapTime = time - lastOverall;
    setLaps([{ lapIndex, lapTime, overallTime: time }, ...laps]);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const formatStopwatchTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6 border border-border/40 rounded-2xl bg-muted/10 space-y-4">
        <p className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight text-foreground select-all">
          {formatStopwatchTime(time)}
        </p>

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus-ring"
            >
              Pause
            </button>
          )}

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-2 text-sm font-semibold transition-colors hover:bg-secondary/80 focus-ring disabled:opacity-50"
          >
            Lap
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-lg bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 focus-ring"
          >
            Reset
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Laps Recorded</h4>
          <div className="border border-border/40 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto bg-background/50">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground border-b border-border/40">
                <tr>
                  <th className="px-4 py-2">Lap</th>
                  <th className="px-4 py-2">Lap Split Time</th>
                  <th className="px-4 py-2">Overall Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {laps.map((lap) => (
                  <tr key={lap.lapIndex} className="hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">#{lap.lapIndex}</td>
                    <td className="px-4 py-2 text-primary">+{formatStopwatchTime(lap.lapTime)}</td>
                    <td className="px-4 py-2">{formatStopwatchTime(lap.overallTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
