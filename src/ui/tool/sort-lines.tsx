"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { sortLines, type SortMode } from "@/src/logic/sort-lines";
import { Clipboard, Check } from "lucide-react";

const sortModes: { value: SortMode; label: string }[] = [
  { value: "alphabetical", label: "A → Z" },
  { value: "alphabetical-reverse", label: "Z → A" },
  { value: "numerical", label: "0 → 9" },
  { value: "numerical-reverse", label: "9 → 0" },
  { value: "shuffle", label: "Shuffle" },
];

export function SortLinesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSort = (mode: SortMode) => {
    const result = sortLines(input, { mode, caseInsensitive });
    setOutput(result);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={caseInsensitive}
            onChange={(e) => setCaseInsensitive(e.target.checked)}
            className="rounded"
          />
          Case-insensitive sort
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sort-input">Input Lines</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setInput(""); setOutput(""); }}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <Textarea
            id="sort-input"
            rows={12}
            placeholder="Paste lines to sort, one per line..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sorted Output</Label>
            {output && (
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
            value={output}
            placeholder="Sorted lines will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sort Mode</Label>
        <div className="flex flex-wrap gap-2">
          {sortModes.map((mode) => (
            <Button
              key={mode.value}
              variant="outline"
              size="sm"
              onClick={() => handleSort(mode.value)}
              disabled={!input}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
