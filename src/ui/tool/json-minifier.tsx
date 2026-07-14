"use client";

import { useState } from "react";
import { minifyJson } from "@/src/logic/json-minifier";

export function JsonMinifierTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleMinify = () => {
    setError("");
    try {
      const res = minifyJson(jsonInput);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON input");
      setResult("");
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-sm font-medium">JSON Data Input</span>
        <textarea
          className="flex min-h-[160px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder='e.g.&#10;{&#10;  "name": "Toolkit",&#10;  "status": "active"&#10;}'
          value={jsonInput}
          onChange={(e) => { setJsonInput(e.target.value); setError(""); }}
        />
      </div>

      <button
        onClick={handleMinify}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Minify JSON
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Minified Result</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            className="flex min-h-[100px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
            value={result}
          />
        </div>
      )}
    </div>
  );
}
