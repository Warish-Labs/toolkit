"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { textToBinary, binaryToText } from "@/src/logic/text-binary";
import { Clipboard, Check } from "lucide-react";

type TabMode = "text-to-binary" | "binary-to-text";

export function TextBinaryConverterTool() {
  const [activeTab, setActiveTab] = useState<TabMode>("text-to-binary");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result =
    activeTab === "text-to-binary" ? textToBinary(input) : binaryToText(input);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab: TabMode) => {
    setActiveTab(tab);
    setInput("");
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex rounded-lg border border-border overflow-hidden w-fit">
        <button
          onClick={() => handleTabChange("text-to-binary")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "text-to-binary"
              ? "bg-foreground text-background"
              : "hover:bg-muted"
          }`}
        >
          Text → Binary
        </button>
        <button
          onClick={() => handleTabChange("binary-to-text")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-l border-border ${
            activeTab === "binary-to-text"
              ? "bg-foreground text-background"
              : "hover:bg-muted"
          }`}
        >
          Binary → Text
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="binary-input">
              {activeTab === "text-to-binary" ? "Text Input" : "Binary Input"}
            </Label>
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
            id="binary-input"
            rows={10}
            placeholder={
              activeTab === "text-to-binary"
                ? "Type or paste text to convert to binary..."
                : "Paste 8-bit binary (space-separated) to decode..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={activeTab === "binary-to-text" ? "font-mono text-xs" : undefined}
          />
          {activeTab === "binary-to-text" && (
            <p className="text-xs text-muted-foreground">
              Enter 8-bit binary groups separated by spaces, e.g.{" "}
              <code className="font-mono">01001000 01101001</code>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {activeTab === "text-to-binary" ? "Binary Output" : "Decoded Text"}
            </Label>
            {result.isValid && result.output && (
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
            value={result.isValid ? result.output : ""}
            placeholder="Output will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>

      {!result.isValid && result.error && (
        <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive">
          <p className="font-semibold">Conversion Error</p>
          <p className="mt-1 text-xs font-mono">{result.error}</p>
        </div>
      )}
    </div>
  );
}
