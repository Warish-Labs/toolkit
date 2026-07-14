"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { Input } from "@/src/ui/shared/input";
import {
  removeSpecialCharacters,
  type RemoveSpecialMode,
  type RemoveSpecialOptions,
} from "@/src/logic/remove-special-characters";
import { Clipboard, Check } from "lucide-react";

const modes: { value: RemoveSpecialMode; label: string; description: string }[] = [
  { value: "alphanumeric-only", label: "Alphanumeric Only", description: "Keep letters and numbers only" },
  { value: "alphanumeric-spaces", label: "Alphanumeric + Spaces", description: "Keep letters, numbers, and spaces" },
  { value: "custom-whitelist", label: "Custom Whitelist", description: "Keep alphanumeric + your custom characters" },
];

export function RemoveSpecialCharactersTool() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<RemoveSpecialOptions>({
    mode: "alphanumeric-spaces",
    customWhitelist: "",
  });
  const [copied, setCopied] = useState(false);

  const output = removeSpecialCharacters(input, options);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Mode</Label>
        <div className="flex flex-col gap-2">
          {modes.map((mode) => (
            <label key={mode.value} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="remove-special-mode"
                value={mode.value}
                checked={options.mode === mode.value}
                onChange={() => setOptions((o) => ({ ...o, mode: mode.value }))}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium">{mode.label}</p>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </div>
            </label>
          ))}
        </div>

        {options.mode === "custom-whitelist" && (
          <div className="space-y-1 pl-6">
            <Label htmlFor="whitelist-input">Custom Whitelist Characters</Label>
            <Input
              id="whitelist-input"
              placeholder="e.g. .,!? to also keep punctuation"
              value={options.customWhitelist}
              onChange={(e) => setOptions((o) => ({ ...o, customWhitelist: e.target.value }))}
              className="font-mono max-w-xs"
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="special-input">Input Text</Label>
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
            id="special-input"
            rows={10}
            placeholder="Paste text with special characters..."
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
            placeholder="Cleaned text will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
