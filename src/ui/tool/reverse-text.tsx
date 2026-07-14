"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { reverseText, type ReverseMode } from "@/src/logic/reverse-text";
import { Clipboard, Check } from "lucide-react";

const modes: { value: ReverseMode; label: string; description: string }[] = [
  { value: "string", label: "Reverse Entire String", description: "Reverse all characters" },
  { value: "words", label: "Reverse Each Line's Words", description: "Reverse word order per line" },
  { value: "lines", label: "Reverse Line Order", description: "Flip the order of lines" },
];

export function ReverseTextTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeMode, setActiveMode] = useState<ReverseMode | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReverse = (mode: ReverseMode) => {
    setActiveMode(mode);
    setOutput(reverseText(input, mode));
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
            <Label htmlFor="reverse-input">Input Text</Label>
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
            id="reverse-input"
            rows={10}
            placeholder="Type or paste text to reverse..."
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
            rows={10}
            readOnly
            value={output}
            placeholder="Reversed text will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Reverse Mode</Label>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <Button
              key={mode.value}
              variant={activeMode === mode.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleReverse(mode.value)}
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
