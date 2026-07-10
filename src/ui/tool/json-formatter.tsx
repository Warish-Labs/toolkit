"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { formatJson, minifyJson, type JsonResult } from "@/src/logic/json";
import { Check, Clipboard } from "lucide-react";

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JsonResult | null>(null);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const res = formatJson(input, indent);
    setResult(res);
  };

  const handleMinify = () => {
    const res = minifyJson(input);
    setResult(res);
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  const handleCopy = async () => {
    if (!result?.formatted) return;
    await navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="json-input">JSON Input</Label>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 text-xs">
              Clear
            </Button>
          </div>
          <Textarea
            id="json-input"
            rows={12}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="json-output">Result</Label>
            {result?.isValid && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-xs gap-1">
                {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <div className="relative">
            <Textarea
              id="json-output"
              rows={12}
              readOnly
              value={result?.formatted || ""}
              placeholder="Output will appear here..."
              className={`font-mono text-xs ${result && !result.isValid ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={handleFormat}>Format</Button>
          <Button variant="outline" onClick={handleMinify}>Minify</Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="indent-select" className="text-xs">Indentation:</Label>
          <select
            id="indent-select"
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs focus-ring"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          {result.isValid ? (
            <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20 text-sm text-green-600 dark:text-green-400">
              <p className="font-semibold">Valid JSON</p>
              {result.stats && (
                <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Total Keys: </span>
                    <span className="font-mono font-semibold">{result.stats.keys}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Depth: </span>
                    <span className="font-mono font-semibold">{result.stats.depth}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size: </span>
                    <span className="font-mono font-semibold">{result.stats.size} bytes</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive">
              <p className="font-semibold">Invalid JSON</p>
              <p className="mt-1 text-xs font-mono">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
