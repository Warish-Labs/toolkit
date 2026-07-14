"use client";

import { useState } from "react";
import { testRegex } from "@/src/logic/regex-tester";

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");
  const [replacement, setReplacement] = useState("");
  const [showReplacement, setShowReplacement] = useState(false);

  const result = testRegex(
    pattern,
    flags,
    testText,
    showReplacement ? replacement : undefined
  );

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="regex-pattern" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Regular Expression Pattern</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground font-mono text-xs">/</span>
            <input
              id="regex-pattern"
              type="text"
              placeholder="e.g. ([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent pl-5 pr-8 py-1 text-xs font-mono shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="absolute right-3 text-muted-foreground font-mono text-xs">/</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Flags</span>
          <div className="flex gap-2.5 h-9 items-center">
            {["g", "i", "m"].map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`w-8 h-8 rounded text-xs font-mono font-bold transition-all ${
                  flags.includes(f)
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                }`}
                title={
                  f === "g"
                    ? "Global match"
                    : f === "i"
                    ? "Case-insensitive"
                    : "Multi-line"
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="regex-test-text" className="text-sm font-medium">Test String</label>
        <textarea
          id="regex-test-text"
          className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter text to match against here... e.g. contact@warishlabs.in or hello@world.com"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            id="regex-show-replace"
            type="checkbox"
            checked={showReplacement}
            onChange={(e) => setShowReplacement(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="regex-show-replace" className="text-xs font-medium cursor-pointer">Enable Regex Replacement</label>
        </div>

        {showReplacement && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="regex-replacement" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Replace With</label>
              <input
                id="regex-replacement"
                type="text"
                placeholder="e.g. obscured@$2"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
              />
            </div>
            {result.isValid && result.replacedText !== undefined && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resulting Text</span>
                <div className="flex items-center h-9 w-full rounded-md border border-border/60 bg-muted/20 px-3 text-xs font-mono overflow-x-auto truncate">
                  {result.replacedText}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!result.isValid && result.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 text-destructive p-4 text-xs font-mono">
          {result.error}
        </div>
      )}

      {result.isValid && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2">
            <span>Found <span className="font-semibold text-foreground">{result.matches.length}</span> match{result.matches.length !== 1 && "es"}</span>
          </div>

          {result.matches.length > 0 ? (
            <div className="space-y-3">
              {result.matches.slice(0, 10).map((match, idx) => (
                <div key={idx} className="rounded-xl border border-border/60 bg-card p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="font-bold text-primary">Match {idx + 1}: &quot;{match.match}&quot;</span>
                    <span className="text-[10px] text-muted-foreground">Index: {match.index}</span>
                  </div>
                  {match.groups.length > 0 && (
                    <div className="pl-4 border-l-2 border-primary/20 space-y-1 font-mono text-[11px]">
                      {match.groups.map((group, gIdx) => (
                        <div key={gIdx} className="text-muted-foreground">
                          Group {gIdx + 1}: <span className="text-foreground font-semibold">{group === undefined ? "undefined" : `"${group}"`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {result.matches.length > 10 && (
                <p className="text-center text-[10px] text-muted-foreground">Showing first 10 matches...</p>
              )}
            </div>
          ) : (
            pattern && <p className="text-xs text-muted-foreground">No matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}
