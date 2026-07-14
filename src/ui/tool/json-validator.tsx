"use client";

import { useState } from "react";
import { validateJson, type JsonValidationResult } from "@/src/logic/json-validator";

export function JsonValidatorTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState<JsonValidationResult | null>(null);

  const handleValidate = () => {
    const res = validateJson(jsonInput);
    setResult(res);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setResult(null);
    } catch (e) {
      // fallback
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">JSON Data Input</span>
          <div className="flex gap-2">
            <button
              onClick={handlePaste}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Paste
            </button>
            <button
              onClick={handleClear}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          className="flex min-h-[220px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder='e.g.&#10;{&#10;  "name": "Toolkit",&#10;  "status": "active"&#10;}'
          value={jsonInput}
          onChange={(e) => { setJsonInput(e.target.value); setResult(null); }}
        />
      </div>

      <button
        onClick={handleValidate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Validate JSON
      </button>

      {result && (
        <div className={`rounded-xl border p-5 space-y-2 ${result.isValid ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {result.isValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
          </div>
          {!result.isValid && (
            <div className="text-xs font-mono space-y-1.5 pt-1">
              <p>{result.error}</p>
              {result.line !== undefined && (
                <p className="opacity-80">Line {result.line}, Column {result.column}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
