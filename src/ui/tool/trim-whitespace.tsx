"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { trimWhitespace, type TrimMode } from "@/src/logic/trim-whitespace";
import { Clipboard, Check } from "lucide-react";

const trimModes: { value: TrimMode; label: string; description: string }[] = [
  { value: "trim-both", label: "Trim Both", description: "Remove leading & trailing whitespace per line" },
  { value: "trim-start", label: "Trim Start", description: "Remove leading whitespace per line" },
  { value: "trim-end", label: "Trim End", description: "Remove trailing whitespace per line" },
  { value: "collapse-spaces", label: "Collapse Spaces", description: "Reduce multiple spaces to one" },
  { value: "remove-all-spaces", label: "Remove All Spaces", description: "Strip all whitespace characters" },
];

export function TrimWhitespaceTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeMode, setActiveMode] = useState<TrimMode | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTrim = (mode: TrimMode) => {
    setActiveMode(mode);
    setOutput(trimWhitespace(input, mode));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="trim-input">Input Text</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setInput(""); setOutput(""); setActiveMode(null); }}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <Textarea
            id="trim-input"
            rows={12}
            placeholder="Paste text with extra whitespace..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Output</Label>
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
            placeholder="Trimmed text will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Trim Mode</Label>
        <div className="flex flex-wrap gap-2">
          {trimModes.map((mode) => (
            <Button
              key={mode.value}
              variant={activeMode === mode.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleTrim(mode.value)}
              disabled={!input}
              title={mode.description}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
