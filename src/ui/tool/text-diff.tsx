"use client";

import { useState } from "react";
import { computeTextDiff, type DiffLine } from "@/src/logic/text-diff";

export function TextDiffTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffs, setDiffs] = useState<DiffLine[]>([]);
  const [hasCompared, setHasCompared] = useState(false);

  const handleCompare = () => {
    const res = computeTextDiff(original, modified);
    setDiffs(res);
    setHasCompared(true);
  };

  const addedCount = diffs.filter(d => d.type === 'added').length;
  const removedCount = diffs.filter(d => d.type === 'removed').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="diff-orig" className="text-sm font-medium">Original Text (A)</label>
          <textarea
            id="diff-orig"
            className="flex min-h-[140px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Paste original reference text here..."
            value={original}
            onChange={(e) => { setOriginal(e.target.value); setHasCompared(false); }}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="diff-mod" className="text-sm font-medium">Modified Text (B)</label>
          <textarea
            id="diff-mod"
            className="flex min-h-[140px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Paste modified text here..."
            value={modified}
            onChange={(e) => { setModified(e.target.value); setHasCompared(false); }}
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Compare Texts
      </button>

      {hasCompared && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2">
            <span>Diff Results</span>
            <div className="flex gap-4 font-semibold">
              <span className="text-emerald-500">+{addedCount} line{addedCount !== 1 && 's'}</span>
              <span className="text-destructive">-{removedCount} line{removedCount !== 1 && 's'}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 font-mono text-[11px] space-y-1 overflow-x-auto max-h-[400px]">
            {diffs.map((line, idx) => {
              let bgClass = "text-muted-foreground";
              let prefix = " ";
              if (line.type === 'added') {
                bgClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-1 rounded";
                prefix = "+";
              } else if (line.type === 'removed') {
                bgClass = "bg-destructive/10 text-destructive font-semibold px-1 rounded";
                prefix = "-";
              }
              return (
                <div key={idx} className={`flex gap-3 leading-relaxed ${bgClass}`}>
                  <span className="w-6 shrink-0 opacity-50 text-right select-none">{line.originalLineNum || line.modifiedLineNum || ''}</span>
                  <span className="w-3 shrink-0 opacity-60 select-none">{prefix}</span>
                  <span className="whitespace-pre">{line.content || ' '}</span>
                </div>
              );
            })}
            {diffs.length === 0 && (
              <p className="text-center font-sans text-xs text-muted-foreground py-4">No text entered to compare.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
