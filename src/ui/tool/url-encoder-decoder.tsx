"use client";

import { useState } from "react";
import { encodeUrl, decodeUrl } from "@/src/logic/url-codec";

export function UrlEncoderDecoderTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<'all' | 'special'>('all');
  const [error, setError] = useState("");

  const handleEncode = () => {
    setError("");
    try {
      const res = encodeUrl(input, mode);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error encoding URL");
    }
  };

  const handleDecode = () => {
    setError("");
    try {
      const res = decodeUrl(input, mode);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error decoding URL. Check if input is properly URL encoded.");
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-sm font-medium">URL / Text Input</span>
        <textarea
          className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. https://google.com/search?q=hello world"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="space-y-1">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'all' | 'special')}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value="all">Encode All Characters (encodeURIComponent)</option>
            <option value="special">Encode Only Special Characters (encodeURI)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEncode}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            URL Encode
          </button>
          <button
            onClick={handleDecode}
            className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 focus-ring"
          >
            URL Decode
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            className="flex min-h-[120px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none"
            value={result}
          />
        </div>
      )}
    </div>
  );
}
