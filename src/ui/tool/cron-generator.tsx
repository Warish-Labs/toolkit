"use client";

import { useState } from "react";
import { buildCronExpression, describeCronExpression, type CronParts } from "@/src/logic/cron-generator";

export function CronGeneratorTool() {
  const [parts, setParts] = useState<CronParts>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });

  const [customCron, setCustomCron] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const activeCron = useCustom ? customCron : buildCronExpression(parts);
  const description = describeCronExpression(activeCron);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCron);
  };

  const setPreset = (minute: string, hour: string, dom: string, mon: string, dow: string) => {
    setUseCustom(false);
    setParts({ minute, hour, dayOfMonth: dom, month: mon, dayOfWeek: dow });
  };

  return (
    <div className="space-y-6">
      {/* Preset Row */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Common Presets</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPreset("*", "*", "*", "*", "*")}
            className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
          >
            Every Minute
          </button>
          <button
            onClick={() => setPreset("0", "*", "*", "*", "*")}
            className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
          >
            Hourly
          </button>
          <button
            onClick={() => setPreset("0", "0", "*", "*", "*")}
            className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
          >
            Daily at Midnight
          </button>
          <button
            onClick={() => setPreset("0", "0", "*", "*", "1")}
            className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
          >
            Weekly on Monday
          </button>
          <button
            onClick={() => setPreset("0", "0", "1", "*", "*")}
            className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
          >
            Monthly on 1st
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 py-1">
        <input
          id="use-custom-cron"
          type="checkbox"
          checked={useCustom}
          onChange={(e) => setUseCustom(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
        />
        <label htmlFor="use-custom-cron" className="text-xs font-medium cursor-pointer">Write custom cron expression</label>
      </div>

      {useCustom ? (
        <div className="space-y-1.5">
          <label htmlFor="custom-cron-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cron Expression</label>
          <input
            id="custom-cron-input"
            type="text"
            placeholder="e.g. */5 * * * *"
            value={customCron}
            onChange={(e) => setCustomCron(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-5 font-mono text-xs">
          <div className="space-y-1.5">
            <label htmlFor="cron-min" className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Minute</label>
            <input
              id="cron-min"
              type="text"
              value={parts.minute}
              onChange={(e) => setParts({ ...parts, minute: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cron-hour" className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Hour</label>
            <input
              id="cron-hour"
              type="text"
              value={parts.hour}
              onChange={(e) => setParts({ ...parts, hour: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cron-dom" className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Day (Month)</label>
            <input
              id="cron-dom"
              type="text"
              value={parts.dayOfMonth}
              onChange={(e) => setParts({ ...parts, dayOfMonth: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cron-month" className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Month</label>
            <input
              id="cron-month"
              type="text"
              value={parts.month}
              onChange={(e) => setParts({ ...parts, month: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cron-dow" className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Day (Week)</label>
            <input
              id="cron-dow"
              type="text"
              value={parts.dayOfWeek}
              onChange={(e) => setParts({ ...parts, dayOfWeek: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Main Results Card */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Result Expression</span>
            <div className="text-lg font-mono font-extrabold text-primary select-all">
              {activeCron}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Copy Expression
          </button>
        </div>

        <div className="border-t border-border/40 pt-4 space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">English Description</span>
          <p className="text-sm text-foreground font-semibold leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
