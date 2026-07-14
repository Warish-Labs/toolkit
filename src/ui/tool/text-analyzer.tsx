"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { analyzeText } from "@/src/logic/text-analyzer";

export function TextAnalyzerTool() {
  const [text, setText] = useState("");
  const stats = analyzeText(text);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="analyzer-input">Enter Text</Label>
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
          id="analyzer-input"
          rows={8}
          placeholder="Type or paste your text here to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Chars (No Spaces)" value={stats.charactersNoSpaces} />
        <StatCard label="Unique Words" value={stats.uniqueWords} />
        <StatCard label="Avg Word Length" value={stats.averageWordLength} />
        <StatCard label="Longest Word" value={stats.longestWord || "—"} />
      </div>

      {stats.mostFrequentWords.length > 0 && (
        <div className="space-y-2">
          <Label>Most Frequent Words</Label>
          <div className="flex flex-wrap gap-2">
            {stats.mostFrequentWords.map(({ word, count }) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm"
              >
                <span className="font-medium">{word}</span>
                <span className="text-muted-foreground text-xs">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
      <p className="text-xl font-bold text-foreground truncate">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
        {label}
      </p>
    </div>
  );
}
