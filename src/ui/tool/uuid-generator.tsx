"use client";

import { useState } from "react";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { Input } from "@/src/ui/shared/input";
import { generateMultipleUuids } from "@/src/logic/uuid";
import { Clipboard, Check, RefreshCw } from "lucide-react";

export function UuidGeneratorTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = () => {
    const generated = generateMultipleUuids(count);
    setUuids(generated);
  };

  const handleCopySingle = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2 w-32">
          <Label htmlFor="uuid-count">Quantity</Label>
          <Input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(Math.max(1, Number(e.target.value)), 100))}
          />
        </div>
        <Button onClick={handleGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate
        </Button>
        {uuids.length > 1 && (
          <Button variant="outline" onClick={handleCopyAll}>
            {copiedAll ? "Copied All!" : "Copy All"}
          </Button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto rounded-lg border border-border bg-muted/20 p-2">
          {uuids.map((uuid, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 rounded bg-card p-2 text-xs font-mono border border-border/50"
            >
              <span>{uuid}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopySingle(uuid, idx)}
                className="h-7 w-7"
              >
                {copiedIndex === idx ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Clipboard className="h-3 w-3" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
