"use client";

import { useState } from "react";
import { convertNumberBase } from "@/src/logic/number-base-converter";

export function NumberBaseConverterTool() {
  const [value, setValue] = useState("42");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);

  const result = convertNumberBase(value, fromBase, toBase);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 items-end">
        <div className="space-y-1.5">
          <label htmlFor="base-val-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Number Value</label>
          <input
            id="base-val-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
            placeholder="e.g. 42 or 2A"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="base-from-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">From Base</label>
          <select
            id="base-from-select"
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value={2}>Binary (2)</option>
            <option value={8}>Octal (8)</option>
            <option value={10}>Decimal (10)</option>
            <option value={16}>Hexadecimal (16)</option>
            {Array.from({ length: 35 }, (_, i) => i + 2)
              .filter(b => ![2, 8, 10, 16].includes(b))
              .map(b => (
                <option key={b} value={b}>Base ({b})</option>
              ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="base-to-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">To Base</label>
          <select
            id="base-to-select"
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value={16}>Hexadecimal (16)</option>
            <option value={2}>Binary (2)</option>
            <option value={8}>Octal (8)</option>
            <option value={10}>Decimal (10)</option>
            {Array.from({ length: 35 }, (_, i) => i + 2)
              .filter(b => ![2, 8, 10, 16].includes(b))
              .map(b => (
                <option key={b} value={b}>Base ({b})</option>
              ))}
          </select>
        </div>
      </div>

      {!result.isValid && result.error && (
        <p className="text-xs text-destructive">{result.error}</p>
      )}

      {result.isValid && (
        <div className="grid gap-3 font-mono text-xs border border-border/60 bg-muted/20 p-5 rounded-2xl">
          <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
            <span className="text-muted-foreground font-sans font-semibold">Decimal (Base 10):</span>
            <div className="flex gap-2.5 items-center">
              <span className="font-bold select-all">{result.decimal}</span>
              <button onClick={() => handleCopy(result.decimal)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
            <span className="text-muted-foreground font-sans font-semibold">Binary (Base 2):</span>
            <div className="flex gap-2.5 items-center max-w-[60%]">
              <span className="font-bold select-all truncate" title={result.binary}>{result.binary}</span>
              <button onClick={() => handleCopy(result.binary)} className="text-primary font-sans font-semibold hover:underline text-[10px] shrink-0">Copy</button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
            <span className="text-muted-foreground font-sans font-semibold">Hexadecimal (Base 16):</span>
            <div className="flex gap-2.5 items-center">
              <span className="font-bold select-all">{result.hexadecimal}</span>
              <button onClick={() => handleCopy(result.hexadecimal)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
            <span className="text-muted-foreground font-sans font-semibold">Octal (Base 8):</span>
            <div className="flex gap-2.5 items-center">
              <span className="font-bold select-all">{result.octal}</span>
              <button onClick={() => handleCopy(result.octal)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
            </div>
          </div>
          {result.custom !== undefined && (
            <div className="flex justify-between items-center bg-primary/5 border border-primary/20 rounded-lg p-2.5 px-4">
              <span className="text-primary font-sans font-semibold">Base ({toBase}) Result:</span>
              <div className="flex gap-2.5 items-center">
                <span className="font-bold select-all text-primary">{result.custom}</span>
                <button onClick={() => handleCopy(result.custom!)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
