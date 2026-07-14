"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";
import { generateHmac, compareHashes } from "@/src/logic/hash-hmac";

export function HashCheckerTool() {
  const [activeTab, setActiveTab] = useState("hmac");

  // HMAC params
  const [hmacMessage, setHmacMessage] = useState("");
  const [hmacKey, setHmacKey] = useState("");
  const [hmacAlgo, setHmacAlgo] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>("SHA-256");
  const [hmacResult, setHmacResult] = useState("");
  const [hmacError, setHmacError] = useState("");

  // Compare params
  const [hashA, setHashA] = useState("");
  const [hashB, setHashB] = useState("");
  const [matchResult, setMatchResult] = useState<boolean | null>(null);

  const handleGenerateHmac = async () => {
    setHmacError("");
    try {
      const res = await generateHmac({
        message: hmacMessage,
        key: hmacKey,
        algo: hmacAlgo
      });
      setHmacResult(res);
    } catch (e) {
      setHmacError(e instanceof Error ? e.message : "Error generating HMAC");
      setHmacResult("");
    }
  };

  const handleCompare = () => {
    const matched = compareHashes(hashA, hashB);
    setMatchResult(matched);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setHmacError(""); setMatchResult(null); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hmac">HMAC Generator</TabsTrigger>
          <TabsTrigger value="compare">Hash Checker & Matcher</TabsTrigger>
        </TabsList>

        <TabsContent value="hmac" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="hmac-msg" className="text-sm font-medium">Message Input</label>
            <textarea
              id="hmac-msg"
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-sans shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder="Enter message to sign..."
              value={hmacMessage}
              onChange={(e) => setHmacMessage(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 items-end">
            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="hmac-key" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Secret Key</label>
              <input
                id="hmac-key"
                type="text"
                placeholder="Enter HMAC secret key..."
                value={hmacKey}
                onChange={(e) => setHmacKey(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="hmac-algo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Algorithm</label>
              <select
                id="hmac-algo"
                value={hmacAlgo}
                onChange={(e) => setHmacAlgo(e.target.value as 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              >
                <option value="SHA-256">SHA-256 (Recommended)</option>
                <option value="SHA-1">SHA-1</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateHmac}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Generate HMAC Keyed Hash
          </button>

          {hmacError && <p className="text-xs text-destructive">{hmacError}</p>}

          {hmacResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HMAC Signature</span>
                <button
                  onClick={() => handleCopy(hmacResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center h-10 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 text-xs font-mono select-all truncate">
                {hmacResult}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="hash-a" className="text-sm font-medium">Hash A</label>
              <textarea
                id="hash-a"
                className="flex min-h-[90px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
                placeholder="Paste first hash value here..."
                value={hashA}
                onChange={(e) => { setHashA(e.target.value); setMatchResult(null); }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hash-b" className="text-sm font-medium">Hash B</label>
              <textarea
                id="hash-b"
                className="flex min-h-[90px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
                placeholder="Paste second hash value here..."
                value={hashB}
                onChange={(e) => { setHashB(e.target.value); setMatchResult(null); }}
              />
            </div>
          </div>

          <button
            onClick={handleCompare}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Compare Hashes
          </button>

          {matchResult !== null && (
            <div className={`rounded-xl border p-4 space-y-1 ${matchResult ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                {matchResult ? "✓ Hashes Match" : "✗ Hashes Do Not Match"}
              </div>
              <p className="text-[10px] opacity-80">Case-insensitive verification logic applied.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
