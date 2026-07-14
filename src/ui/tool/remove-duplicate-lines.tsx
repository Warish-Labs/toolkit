"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import {
  removeDuplicateLines,
  type RemoveDuplicatesOptions,
} from "@/src/logic/remove-duplicate-lines";
import { Clipboard, Check } from "lucide-react";

export function RemoveDuplicateLinesTool() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<RemoveDuplicatesOptions>({
    caseInsensitive: false,
    trimLines: false,
  });
  const [copied, setCopied] = useState(false);

  const result = removeDuplicateLines(input, options);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={options.caseInsensitive}
            onChange={(e) =>
              setOptions((o) => ({ ...o, caseInsensitive: e.target.checked }))
            }
            className="rounded"
          />
          Case-insensitive comparison
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={options.trimLines}
            onChange={(e) =>
              setOptions((o) => ({ ...o, trimLines: e.target.checked }))
            }
            className="rounded"
          />
          Trim whitespace from lines
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="dedup-input">Input Lines</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <Textarea
            id="dedup-input"
            rows={12}
            placeholder="Paste lines here — duplicates will be removed..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Output ({result.uniqueCount} unique lines)</Label>
            {result.output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-xs gap-1"
              >
                {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <Textarea
            rows={12}
            readOnly
            value={result.output}
            placeholder="Result will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>

      {input && (
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Original: <strong className="text-foreground">{result.originalCount}</strong> lines</span>
          <span>Removed: <strong className="text-foreground">{result.removedCount}</strong> duplicates</span>
          <span>Unique: <strong className="text-foreground">{result.uniqueCount}</strong> lines</span>
        </div>
      )}
    </div>
  );
}
