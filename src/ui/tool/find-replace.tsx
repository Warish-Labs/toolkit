"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { Input } from "@/src/ui/shared/input";
import { findAndReplace, type FindReplaceOptions } from "@/src/logic/find-replace";
import { Clipboard, Check } from "lucide-react";

export function FindReplaceTool() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [options, setOptions] = useState<FindReplaceOptions>({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
  });
  const [output, setOutput] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const handleReplace = () => {
    const result = findAndReplace(input, find, replace, options);
    setOutput(result.output);
    setCount(result.count);
    setError(result.error);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof FindReplaceOptions) => {
    setOptions((o) => ({ ...o, [key]: !o[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="fr-input">Input Text</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setInput(""); setOutput(""); setCount(null); setError(undefined); }}
            className="h-8 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
        <Textarea
          id="fr-input"
          rows={6}
          placeholder="Paste your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fr-find">Find</Label>
          <Input
            id="fr-find"
            placeholder={options.useRegex ? "Regex pattern..." : "Text to find..."}
            value={find}
            onChange={(e) => setFind(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fr-replace">Replace with</Label>
          <Input
            id="fr-replace"
            placeholder="Replacement text..."
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={options.caseSensitive}
            onChange={() => toggleOption("caseSensitive")}
            className="rounded"
          />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={options.wholeWord}
            onChange={() => toggleOption("wholeWord")}
            className="rounded"
            disabled={options.useRegex}
          />
          Whole word
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={options.useRegex}
            onChange={() => toggleOption("useRegex")}
            className="rounded"
          />
          Regex mode
        </label>
        <Button onClick={handleReplace} disabled={!input || !find}>
          Replace All
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 text-sm text-destructive">
          <p className="font-semibold">Error</p>
          <p className="mt-1 text-xs font-mono">{error}</p>
        </div>
      )}

      {count !== null && !error && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{count}</span> replacement{count !== 1 ? "s" : ""} made.
        </p>
      )}

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
          rows={6}
          readOnly
          value={output}
          placeholder="Result will appear here..."
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}
