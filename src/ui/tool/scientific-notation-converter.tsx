"use client";

import { useState } from "react";
import { toScientificNotation, fromScientificNotation, type ScientificNotationResult } from "@/src/logic/scientific-notation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function ScientificNotationConverterTool() {
  const [activeTab, setActiveTab] = useState("to");

  // To scientific states
  const [decInput, setDecInput] = useState("125000");
  const [toResult, setToResult] = useState<ScientificNotationResult | null>(null);
  const [toError, setToError] = useState("");

  // From scientific states
  const [sciInput, setSciInput] = useState("1.25 x 10^5");
  const [fromResult, setFromResult] = useState<ScientificNotationResult | null>(null);
  const [fromError, setFromError] = useState("");

  const handleToScientific = () => {
    setToError("");
    const res = toScientificNotation(decInput);
    if (res.isValid) {
      setToResult(res);
    } else {
      setToError(res.error || "Failed to convert");
      setToResult(null);
    }
  };

  const handleFromScientific = () => {
    setFromError("");
    const res = fromScientificNotation(sciInput);
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
          <TabsTrigger value="to">Decimal to Scientific</TabsTrigger>
          <TabsTrigger value="from">Scientific to Decimal</TabsTrigger>
        </TabsList>

        <TabsContent value="to" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="dec-num-val" className="text-sm font-medium">Decimal Number</label>
            <input
              id="dec-num-val"
              type="text"
              value={decInput}
              onChange={(e) => setDecInput(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              placeholder="e.g. 125000 or 0.0045"
            />
          </div>

          <button
            onClick={handleToScientific}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert Number
          </button>

          {toError && <p className="text-xs text-destructive">{toError}</p>}

          {toResult && (
            <div className="grid gap-3 font-mono text-xs border border-border/60 bg-muted/20 p-5 rounded-2xl">
              <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
                <span className="text-muted-foreground font-sans">Scientific Notation:</span>
                <div className="flex gap-2.5 items-center">
                  <span className="font-bold select-all">{toResult.scientific}</span>
                  <button onClick={() => handleCopy(toResult.scientific)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
                <span className="text-muted-foreground font-sans">E-Notation:</span>
                <div className="flex gap-2.5 items-center">
                  <span className="font-bold select-all">{toResult.eNotation}</span>
                  <button onClick={() => handleCopy(toResult.eNotation)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="from" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="sci-num-val" className="text-sm font-medium">Scientific Notation</label>
            <input
              id="sci-num-val"
              type="text"
              value={sciInput}
              onChange={(e) => setSciInput(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              placeholder="e.g. 1.25 x 10^5 or 1.25e+5"
            />
          </div>

          <button
            onClick={handleFromScientific}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert Notation
          </button>

          {fromError && <p className="text-xs text-destructive">{fromError}</p>}

          {fromResult && (
            <div className="grid gap-3 font-mono text-xs border border-border/60 bg-muted/20 p-5 rounded-2xl">
              <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
                <span className="text-muted-foreground font-sans">Decimal Number:</span>
                <div className="flex gap-2.5 items-center">
                  <span className="font-bold select-all">{fromResult.decimal}</span>
                  <button onClick={() => handleCopy(fromResult.decimal)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
