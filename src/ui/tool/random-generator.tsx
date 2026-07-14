"use client";

import { useState } from "react";
import { generateRandomPassword, generateRandomNumbers } from "@/src/logic/random-generator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function RandomGeneratorTool() {
  const [activeTab, setActiveTab] = useState("password");
  
  // Password parameters
  const [passLength, setPassLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Number parameters
  const [numMin, setNumMin] = useState(1);
  const [numMax, setNumMax] = useState(100);
  const [numCount, setNumCount] = useState(5);
  const [numUnique, setNumUnique] = useState(true);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);

  const [error, setError] = useState("");

  const handleGeneratePassword = () => {
    setError("");
    try {
      const res = generateRandomPassword({
        length: passLength,
        useUppercase: useUpper,
        useLowercase: useLower,
        useNumbers: useNumbers,
        useSymbols: useSymbols,
        avoidAmbiguous
      });
      setGeneratedPassword(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generating password");
      setGeneratedPassword("");
    }
  };

  const handleGenerateNumbers = () => {
    setError("");
    try {
      const res = generateRandomNumbers({
        min: numMin,
        max: numMax,
        count: numCount,
        unique: numUnique
      });
      setGeneratedNumbers(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generating numbers");
      setGeneratedNumbers([]);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setError(""); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password Generator</TabsTrigger>
          <TabsTrigger value="numbers">Random Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="pass-length" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Password Length ({passLength})</label>
              <input
                id="pass-length"
                type="range"
                min={6}
                max={128}
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full h-9"
              />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <input
                  id="pass-upper"
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="pass-upper" className="text-xs font-medium cursor-pointer">Uppercase (A-Z)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="pass-lower"
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="pass-lower" className="text-xs font-medium cursor-pointer">Lowercase (a-z)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="pass-num"
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="pass-num" className="text-xs font-medium cursor-pointer">Numbers (0-9)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="pass-sym"
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="pass-sym" className="text-xs font-medium cursor-pointer">Symbols (!@#...)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="pass-ambig"
                  type="checkbox"
                  checked={avoidAmbiguous}
                  onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="pass-ambig" className="text-xs font-medium cursor-pointer" title="Avoid o, O, 0, i, I, l, 1">Avoid ambiguous chars</label>
              </div>
            </div>
          </div>

          <button
            onClick={handleGeneratePassword}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Generate Password
          </button>

          {generatedPassword && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result Password</span>
                <button
                  onClick={() => handleCopy(generatedPassword)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center h-10 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 text-xs font-mono select-all truncate">
                {generatedPassword}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="numbers" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
            <div className="space-y-1.5">
              <label htmlFor="num-min" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Min Value</label>
              <input
                id="num-min"
                type="number"
                value={numMin}
                onChange={(e) => setNumMin(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="num-max" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Max Value</label>
              <input
                id="num-max"
                type="number"
                value={numMax}
                onChange={(e) => setNumMax(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="num-count" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Amount to Generate</label>
              <input
                id="num-count"
                type="number"
                min={1}
                max={500}
                value={numCount}
                onChange={(e) => setNumCount(Math.max(1, Math.min(500, Number(e.target.value))))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 py-2">
              <input
                id="num-unique"
                type="checkbox"
                checked={numUnique}
                onChange={(e) => setNumUnique(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="num-unique" className="text-xs font-medium cursor-pointer">Unique numbers only</label>
            </div>
          </div>

          <button
            onClick={handleGenerateNumbers}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Generate Numbers
          </button>

          {generatedNumbers.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Results ({generatedNumbers.length})</span>
                <button
                  onClick={() => handleCopy(generatedNumbers.join(', '))}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy All
                </button>
              </div>
              <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 max-h-[200px] overflow-y-auto">
                {generatedNumbers.map((num, idx) => (
                  <span key={idx} className="font-mono text-xs px-2.5 py-1 bg-card border rounded shadow-sm">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
