"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { Input } from "@/src/ui/shared/input";
import { repeatText } from "@/src/logic/text-repeater";
import { Clipboard, Check } from "lucide-react";

export function TextRepeaterTool() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(3);
  const [separator, setSeparator] = useState("\n");
  const [copied, setCopied] = useState(false);

  const output = repeatText(input, count, separator);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const separatorDisplay = (sep: string) => {
    if (sep === "\n") return "↵ Newline";
    if (sep === "\n\n") return "↵↵ Double Newline";
    if (sep === ", ") return ", Comma";
    if (sep === " ") return "· Space";
    return sep || "(none)";
  };

  const presets = [
    { label: "Newline", value: "\n" },
    { label: "Double Newline", value: "\n\n" },
    { label: "Comma", value: ", " },
    { label: "Space", value: " " },
    { label: "None", value: "" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="repeater-input">Text to Repeat</Label>
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
          id="repeater-input"
          rows={4}
          placeholder="Enter text to repeat..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="repeat-count">Repeat Count (1 – 1000)</Label>
          <Input
            id="repeat-count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repeat-separator">Separator</Label>
          <Input
            id="repeat-separator"
            placeholder="Separator between repetitions..."
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="font-mono"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setSeparator(p.value)}
                className="text-xs px-2 py-0.5 rounded border border-border/60 hover:bg-muted transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Output (repeated {count}×, separator: {separatorDisplay(separator)})</Label>
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
          rows={8}
          readOnly
          value={output}
          placeholder="Repeated text will appear here..."
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}
