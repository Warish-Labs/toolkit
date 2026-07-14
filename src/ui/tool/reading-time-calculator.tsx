"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { Input } from "@/src/ui/shared/input";
import { calculateReadingTime } from "@/src/logic/reading-time";

export function ReadingTimeCalculatorTool() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);

  const result = calculateReadingTime(text, wpm);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="reading-input">Enter Text</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setText("")}
            className="h-8 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
        <Textarea
          id="reading-input"
          rows={8}
          placeholder="Paste your article or text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wpm-input">Reading Speed (WPM)</Label>
        <div className="flex items-center gap-4">
          <input
            id="wpm-range"
            type="range"
            min={50}
            max={1000}
            step={50}
            value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
            className="flex-1 accent-foreground"
          />
          <Input
            id="wpm-input"
            type="number"
            min={50}
            max={1000}
            value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Average adult reading speed is 200–250 WPM.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <div className="rounded-lg border border-border/60 bg-muted/30 p-6 text-center">
          <p className="text-3xl font-bold">{result.displayTime}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
            Reading Time
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-6 text-center">
          <p className="text-3xl font-bold">{result.wordCount.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
            Words
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-6 text-center">
          <p className="text-3xl font-bold">{wpm}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
            WPM
          </p>
        </div>
      </div>
    </div>
  );
}
