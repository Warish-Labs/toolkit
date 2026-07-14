"use client";

import { useState } from "react";
import { checkIsPrime, generatePrimes } from "@/src/logic/prime-checker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function PrimeCheckerTool() {
  const [activeTab, setActiveTab] = useState("check");

  // Checker params
  const [checkNum, setCheckNum] = useState("17");
  const [checkResult, setCheckResult] = useState<any>(null);

  // Generator params
  const [genLimit, setGenLimit] = useState(100);
  const [generatedList, setGeneratedList] = useState<number[]>([]);

  const handleCheck = () => {
    const val = parseInt(checkNum, 10);
    if (!isNaN(val)) {
      const res = checkIsPrime(val);
      setCheckResult(res);
    }
  };

  const handleGenerate = () => {
    const val = Math.min(10000, Math.max(2, genLimit));
    const list = generatePrimes(val);
    setGeneratedList(list);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setCheckResult(null); setGeneratedList([]); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="check">Prime Checker</TabsTrigger>
          <TabsTrigger value="generate">Prime Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="check" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="prime-num-input" className="text-sm font-medium">Integer Input</label>
            <input
              id="prime-num-input"
              type="number"
              value={checkNum}
              onChange={(e) => setCheckNum(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
          </div>

          <button
            onClick={handleCheck}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Check Number
          </button>

          {checkResult && (
            <div className={`rounded-xl border p-5 space-y-3 ${checkResult.isPrime ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"}`}>
              <h4 className="font-bold text-sm">
                {checkResult.isPrime ? "✓ Prime Number" : "✗ Composite Number"}
              </h4>
              <p className="text-xs leading-relaxed font-sans">{checkResult.description}</p>
              {checkResult.factors.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-border/40 text-xs">
                  <span className="font-sans font-bold text-muted-foreground uppercase tracking-wider block">Divisors:</span>
                  <span className="font-mono">{checkResult.factors.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="prime-gen-limit" className="text-sm font-medium">Generate primes up to (Max: 10,000)</label>
            <input
              id="prime-gen-limit"
              type="number"
              min={2}
              max={10000}
              value={genLimit}
              onChange={(e) => setGenLimit(Math.max(2, Math.min(10000, Number(e.target.value))))}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Generate List
          </button>

          {generatedList.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Found {generatedList.length} primes</span>
              <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 max-h-[250px] overflow-y-auto font-mono text-xs">
                {generatedList.map((prime) => (
                  <span key={prime} className="px-2 py-0.5 bg-card border rounded shadow-sm">
                    {prime}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
