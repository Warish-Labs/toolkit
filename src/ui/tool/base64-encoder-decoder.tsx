"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { encodeBase64, decodeBase64, type Base64Result } from "@/src/logic/base64";
import { Clipboard, Check, ArrowRightLeft } from "lucide-react";

export function Base64EncoderDecoderTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Base64Result | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    const res = encodeBase64(input);
    setResult(res);
  };

  const handleDecode = () => {
    const res = decodeBase64(input);
    setResult(res);
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  const handleCopy = async () => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="base64-input">Input Text / Base64</Label>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 text-xs">
              Clear
            </Button>
          </div>
          <Textarea
            id="base64-input"
            rows={8}
            placeholder="Type or paste your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="base64-output">Output</Label>
            {result?.isValid && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-xs gap-1">
                {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <Textarea
            id="base64-output"
            rows={8}
            readOnly
            value={result?.output || ""}
            placeholder="Output will appear here..."
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleEncode} className="gap-2">
          Encode
        </Button>
        <Button variant="outline" onClick={handleDecode} className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Decode
        </Button>
      </div>

      {result && !result.isValid && (
        <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive">
          <p className="font-semibold">Conversion Error</p>
          <p className="mt-1 text-xs font-mono">{result.error}</p>
        </div>
      )}
    </div>
  );
}
