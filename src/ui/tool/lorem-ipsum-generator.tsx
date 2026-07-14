"use client";

import { useState } from "react";
import { generateLoremIpsum } from "@/src/logic/lorem-ipsum";

export function LoremIpsumGeneratorTool() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    const text = generateLoremIpsum({ type, count, startWithLorem });
    setResult(text);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <div className="space-y-1.5">
          <label htmlFor="lorem-type" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Generate Type</label>
          <select
            id="lorem-type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lorem-count" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Count</label>
          <input
            id="lorem-count"
            type="number"
            min={1}
            max={type === 'words' ? 1000 : type === 'sentences' ? 100 : 50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input
            id="start-lorem"
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="start-lorem" className="text-xs font-medium cursor-pointer">Start with &quot;Lorem ipsum...&quot;</label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Generate Text
      </button>

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Output</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            className="flex min-h-[180px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-sans shadow-sm focus-visible:outline-none leading-relaxed select-all"
            value={result}
          />
        </div>
      )}
    </div>
  );
}
