"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function CountdownCalculatorTool() {
  const [eventTitle, setEventTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("00:00");
  const [countdownText, setCountdownText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    if (!targetDate) return;
    setIsActive(true);
    setCountdownText(eventTitle.trim() || "Event");
  };

  const stopCountdown = () => {
    setIsActive(false);
    setRemaining(null);
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  };

  useEffect(() => {
    if (!isActive || !targetDate) return;

    const [hours, minutes] = targetTime.split(":").map(Number);
    const [year, month, day] = targetDate.split("-").map(Number);
    const targetMs = new Date(year, month - 1, day, hours, minutes).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetMs - now;

      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        setIsActive(false);
        if (intervalId.current) clearInterval(intervalId.current);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemaining({ days, hours, minutes, seconds, totalMs: diff });
    };

    updateCountdown();
    intervalId.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [isActive, targetDate, targetTime]);

  return (
    <div className="space-y-6">
      {!isActive ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                type="text"
                placeholder="e.g., Vacation Countdown"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-date">Target Date</Label>
              <Input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-time">Target Time</Label>
              <Input
                id="target-time"
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={startCountdown}
            disabled={!targetDate}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring disabled:opacity-50"
          >
            Start Countdown
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-6 space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Countdown to</span>
            <h3 className="text-2xl font-bold text-foreground">{countdownText}</h3>
          </div>

          {remaining && (
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-background/80 border border-border/40 rounded-xl p-3 flex flex-col justify-center">
                <span className="text-4xl font-extrabold text-foreground">{remaining.days}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mt-1">Days</span>
              </div>
              <div className="bg-background/80 border border-border/40 rounded-xl p-3 flex flex-col justify-center">
                <span className="text-4xl font-extrabold text-foreground">{remaining.hours}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mt-1">Hours</span>
              </div>
              <div className="bg-background/80 border border-border/40 rounded-xl p-3 flex flex-col justify-center">
                <span className="text-4xl font-extrabold text-foreground">{remaining.minutes}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mt-1">Minutes</span>
              </div>
              <div className="bg-background/80 border border-border/40 rounded-xl p-3 flex flex-col justify-center">
                <span className="text-4xl font-extrabold text-foreground">{remaining.seconds}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mt-1">Seconds</span>
              </div>
            </div>
          )}

          {remaining?.totalMs === 0 && (
            <p className="text-emerald-500 font-semibold text-lg">🎉 The event is here!</p>
          )}

          <button
            onClick={stopCountdown}
            className="inline-flex items-center justify-center rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-ring"
          >
            Reset / Stop Countdown
          </button>
        </div>
      )}
    </div>
  );
}
