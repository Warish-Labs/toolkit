"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { generateAllHashes, type HashResult } from "@/src/logic/hash";
import { Clipboard, Check } from "lucide-react";

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [copiedAlg, setCopiedAlg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input) {
      setHashes([]);
      return;
    }
    const results = await generateAllHashes(input);
    setHashes(results);
  };

  const handleCopy = async (hash: string, algorithm: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedAlg(algorithm);
    setTimeout(() => setCopiedAlg(null), 2000);
  };

  const handleClear = () => {
    setInput("");
    setHashes([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="hash-input">Input Text</Label>
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 text-xs">
            Clear
          </Button>
        </div>
        <Textarea
          id="hash-input"
          rows={5}
          placeholder="Enter text to generate hashes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <Button onClick={handleGenerate}>Generate Hashes</Button>

      {hashes.length > 0 && (
        <div className="space-y-4">
          <Label>Generated Hashes</Label>
          <div className="space-y-3">
            {hashes.map((item) => (
              <div
                key={item.algorithm}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 p-3 text-xs"
              >
                <div className="space-y-1">
                  <span className="font-semibold text-foreground">{item.algorithm}</span>
                  <p className="font-mono text-muted-foreground break-all">{item.hash}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(item.hash, item.algorithm)}
                  className="self-end sm:self-auto h-8 gap-1.5"
                >
                  {copiedAlg === item.algorithm ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
