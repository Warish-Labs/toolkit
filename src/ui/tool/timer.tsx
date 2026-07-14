"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";

export function TimerTool() {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerId = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (secondsToRun?: number) => {
    let runSeconds = secondsToRun;
    if (runSeconds === undefined) {
      const h = parseInt(hours, 10) || 0;
      const m = parseInt(minutes, 10) || 0;
      const s = parseInt(seconds, 10) || 0;
      runSeconds = h * 3600 + m * 60 + s;
    }

    if (runSeconds <= 0) return;

    setTotalSeconds(runSeconds);
    setInitialSeconds(runSeconds);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (timerId.current) clearInterval(timerId.current);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setInitialSeconds(0);
    setIsCompleted(false);
    if (timerId.current) clearInterval(timerId.current);
  };

  // Play browser synthesizer beep
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Play 3 pulses
      [0, 300, 600].forEach((delay) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.value = 880; // A5 note
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        }, delay);
      });
    } catch (e) {
      console.error("Audio Context not allowed or failed:", e);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    timerId.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          playBeep();
          if (timerId.current) clearInterval(timerId.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [isRunning]);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (val: number) => val.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const presets = [
    { label: "1 Min", value: 60 },
    { label: "3 Min", value: 180 },
    { label: "5 Min", value: 300 },
    { label: "10 Min", value: 600 },
    { label: "15 Min", value: 900 },
    { label: "30 Min", value: 1800 },
  ];

  const progressPercent = initialSeconds > 0 ? (totalSeconds / initialSeconds) * 100 : 0;

  return (
    <div className="space-y-6">
      {totalSeconds === 0 && !isCompleted ? (
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-3">
            <div className="space-y-1 text-center">
              <Label htmlFor="timer-h">Hours</Label>
              <Input
                id="timer-h"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="text-center font-mono"
              />
            </div>
            <div className="space-y-1 text-center">
              <Label htmlFor="timer-m">Minutes</Label>
              <Input
                id="timer-m"
                type="number"
                min="0"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="text-center font-mono"
              />
            </div>
            <div className="space-y-1 text-center">
              <Label htmlFor="timer-s">Seconds</Label>
              <Input
                id="timer-s"
                type="number"
                min="0"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="text-center font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => startTimer(preset.value)}
                  className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => startTimer()}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-ring w-full sm:w-auto"
          >
            Start Timer
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-6 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-6xl font-mono font-extrabold tracking-tight text-foreground select-none">
              {formatTimer(totalSeconds)}
            </p>

            {/* Simple progress bar */}
            <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden max-w-sm mx-auto">
              <div
                className="bg-primary h-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {isCompleted && (
            <p className="text-emerald-500 font-semibold text-lg animate-pulse">⏰ Time is up!</p>
          )}

          <div className="flex justify-center gap-3">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus-ring"
              >
                Pause
              </button>
            ) : (
              !isCompleted && (
                <button
                  onClick={() => setIsRunning(true)}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
                >
                  Resume
                </button>
              )
            )}

            <button
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 focus-ring"
            >
              {isCompleted ? "Dismiss" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
