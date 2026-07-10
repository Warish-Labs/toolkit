"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { countText } from "@/src/logic/word-counter";

export function WordCharacterCounterTool() {
  const [text, setText] = useState("");
  const stats = countText(text);

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="counter-input">Enter Text</Label>
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 text-xs">
            Clear
          </Button>
        </div>
        <Textarea
          id="counter-input"
          rows={8}
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Characters (No Spaces)" value={stats.charactersNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Reading Time" value={stats.readingTime} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{label}</p>
    </div>
  );
}
