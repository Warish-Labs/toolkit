"use client";

import { useState } from "react";
import { formatXml } from "@/src/logic/xml-formatter";

export function XmlFormatterTool() {
  const [xmlInput, setXmlInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const handleFormat = () => {
    setError("");
    try {
      const res = formatXml(xmlInput, indentSize);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error formatting XML");
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
        <span className="text-sm font-medium">XML Data Input</span>
        <textarea
          className="flex min-h-[160px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder='e.g. <note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don&apos;t forget me this weekend!</body></note>'
          value={xmlInput}
          onChange={(e) => { setXmlInput(e.target.value); setError(""); }}
        />
      </div>

      <div className="flex gap-4 items-center">
        <div className="space-y-1.5">
          <label htmlFor="indent-size" className="text-xs text-muted-foreground">Indentation Size</label>
          <select
            id="indent-size"
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="flex h-8 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>

        <button
          onClick={handleFormat}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
        >
          Format XML
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Formatted XML</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            className="flex min-h-[180px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none"
            value={result}
          />
        </div>
      )}
    </div>
  );
}
