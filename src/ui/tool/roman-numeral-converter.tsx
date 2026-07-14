"use client";

import { useState } from "react";
import { decimalToRoman, romanToDecimal, type RomanConversionResult } from "@/src/logic/roman-numerals";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function RomanNumeralConverterTool() {
  const [activeTab, setActiveTab] = useState("to");

  // Decimal to Roman states
  const [decInput, setDecInput] = useState("1984");
  const [toResult, setToResult] = useState<RomanConversionResult | null>(null);
  const [toError, setToError] = useState("");

  // Roman to Decimal states
  const [romInput, setRomInput] = useState("MCMLXXXIV");
  const [fromResult, setFromResult] = useState<RomanConversionResult | null>(null);
  const [fromError, setFromError] = useState("");

  const handleToRoman = () => {
    setToError("");
    const val = parseInt(decInput, 10);
    const res = decimalToRoman(val);
    if (res.isValid) {
      setToResult(res);
    } else {
      setToError(res.error || "Failed to convert");
      setToResult(null);
    }
  };

  const handleFromRoman = () => {
    setFromError("");
    const res = romanToDecimal(romInput);
    if (res.isValid) {
      setFromResult(res);
    } else {
      setFromError(res.error || "Failed to convert");
      setFromResult(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setToResult(null); setFromResult(null); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="to">Decimal to Roman</TabsTrigger>
          <TabsTrigger value="from">Roman to Decimal</TabsTrigger>
        </TabsList>

        <TabsContent value="to" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="roman-dec-input" className="text-sm font-medium">Integer Input (1 to 3999)</label>
            <input
              id="roman-dec-input"
              type="number"
              min={1}
              max={3999}
              value={decInput}
              onChange={(e) => setDecInput(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              placeholder="e.g. 1984"
            />
          </div>

          <button
            onClick={handleToRoman}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert to Roman
          </button>

          {toError && <p className="text-xs text-destructive">{toError}</p>}

          {toResult && (
            <div className="grid gap-3 font-mono text-xs border border-border/60 bg-muted/20 p-5 rounded-2xl">
              <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
                <span className="text-muted-foreground font-sans">Roman Numeral:</span>
                <div className="flex gap-2.5 items-center">
                  <span className="font-bold text-primary select-all text-sm">{toResult.roman}</span>
                  <button onClick={() => handleCopy(toResult.roman)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="from" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="roman-char-input" className="text-sm font-medium">Roman Numeral Value</label>
            <input
              id="roman-char-input"
              type="text"
              value={romInput}
              onChange={(e) => setRomInput(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono uppercase shadow-sm focus:outline-none"
              placeholder="e.g. MCMLXXXIV"
            />
          </div>

          <button
            onClick={handleFromRoman}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert to Decimal
          </button>

          {fromError && <p className="text-xs text-destructive">{fromError}</p>}

          {fromResult && (
            <div className="grid gap-3 font-mono text-xs border border-border/60 bg-muted/20 p-5 rounded-2xl">
              <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
                <span className="text-muted-foreground font-sans">Decimal Integer:</span>
                <div className="flex gap-2.5 items-center">
                  <span className="font-bold select-all text-sm">{fromResult.decimal}</span>
                  <button onClick={() => handleCopy(fromResult.decimal.toString())} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
