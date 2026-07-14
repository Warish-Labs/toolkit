"use client";

import { useState } from "react";
import { generateIds } from "@/src/logic/nanoid-generator";

export function NanoidGeneratorTool() {
  const [type, setType] = useState<'uuid' | 'nanoid' | 'snowflake'>('nanoid');
  const [count, setCount] = useState(5);
  const [alphabet, setAlphabet] = useState('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-');
  const [size, setSize] = useState(21);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = () => {
    const list = generateIds({
      type,
      count,
      nanoAlphabet: alphabet,
      nanoSize: size
    });
    setResults(list);
  };

  const handleCopyAll = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="id-type" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Format</label>
          <select
            id="id-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'uuid' | 'nanoid' | 'snowflake')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value="nanoid">NanoID (Customisable)</option>
            <option value="uuid">UUID v4 (Standard)</option>
            <option value="snowflake">Twitter Snowflake</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="id-count" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Count to Generate</label>
          <input
            id="id-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          />
        </div>
      </div>

      {type === 'nanoid' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="nano-alphabet" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custom Alphabet</label>
            <input
              id="nano-alphabet"
              type="text"
              value={alphabet}
              onChange={(e) => setAlphabet(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label htmlFor="nano-size" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Length ({size})</label>
            </div>
            <input
              id="nano-size"
              type="range"
              min={5}
              max={64}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-9"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Generate IDs
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Values</span>
            <button
              onClick={handleCopyAll}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy All
            </button>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 font-mono text-xs space-y-1.5 overflow-x-auto max-h-[300px]">
            {results.map((id, index) => (
              <div key={index} className="flex justify-between items-center hover:bg-muted/40 px-2 py-0.5 rounded">
                <span>{id}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(id)}
                  className="text-[10px] text-primary font-semibold opacity-70 hover:opacity-100"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
