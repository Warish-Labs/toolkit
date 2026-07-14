"use client";

import { useState } from "react";

export function ClipboardInspectorTool() {
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");

  const handleReadClipboard = async () => {
    setError("");
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error("Clipboard API read text is not supported in this browser or requires HTTPS.");
      }
      const text = await navigator.clipboard.readText();
      setContent(text);
      setCharCount(text.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Permission denied or failed to access clipboard.");
      setContent("");
      setCharCount(0);
    }
  };

  const handleClear = () => {
    setContent("");
    setCharCount(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={handleReadClipboard}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
        >
          Inspect Clipboard
        </button>
        {content && (
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors focus-ring"
          >
            Clear Preview
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {content && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2">
            <span>Clipboard Analysis</span>
            <span className="font-semibold">{charCount} character{charCount !== 1 && 's'}</span>
          </div>

          <textarea
            readOnly
            className="flex min-h-[140px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
            value={content}
          />
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        This tool requires secure context (HTTPS/localhost) and user permission approval via the browser prompt.
      </p>
    </div>
  );
}
