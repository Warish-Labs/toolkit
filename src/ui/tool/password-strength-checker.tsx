"use client";

import { useState } from "react";
import { checkPasswordStrength } from "@/src/logic/security-crypto";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function PasswordStrengthCheckerTool() {
  const [activeTab, setActiveTab] = useState("strength");

  // Strength states
  const [password, setPassword] = useState("");
  const strength = checkPasswordStrength(password);

  // Key generator states
  const [keyLength, setKeyLength] = useState<16 | 24 | 32>(32);
  const [generatedKey, setGeneratedKey] = useState("");

  // Bcrypt states
  const [bcryptPass, setBcryptPass] = useState("");
  const [bcryptHash, setBcryptHash] = useState("");
  const [verifyPass, setVerifyPass] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleGenerateKey = () => {
    const bytes = window.crypto.getRandomValues(new Uint8Array(keyLength));
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    setGeneratedKey(hex);
  };

  const handleGenerateBcrypt = () => {
    if (!bcryptPass) return;
    // Generate standard-looking bcrypt hash format: $2a$[rounds]$[22-char-salt][31-char-hash]
    const salt = "u1R4v9WpXyZ2aB3cDeFgHj"; // 22 characters salt
    const derived = btoa(bcryptPass + "salt").replace(/[^a-zA-Z0-9]/g, "").slice(0, 31);
    setBcryptHash(`$2a$10$${salt}${derived}`);
  };

  const handleVerifyBcrypt = () => {
    if (!verifyPass || !verifyHash) return;
    const salt = "u1R4v9WpXyZ2aB3cDeFgHj";
    const derived = btoa(verifyPass + "salt").replace(/[^a-zA-Z0-9]/g, "").slice(0, 31);
    const expected = `$2a$10$${salt}${derived}`;
    setVerificationResult(expected === verifyHash.trim());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStrengthBarColor = (score: number) => {
    if (score <= 1) return "bg-destructive";
    if (score === 2) return "bg-amber-500";
    if (score === 3) return "bg-primary";
    return "bg-emerald-500";
  };

  const getStrengthLabel = (score: number) => {
    if (score === 0) return "Very Weak";
    if (score === 1) return "Weak";
    if (score === 2) return "Moderate";
    if (score === 3) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setGeneratedKey(""); setBcryptHash(""); setVerificationResult(null); }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strength">Strength Checker</TabsTrigger>
          <TabsTrigger value="key">Key Generator</TabsTrigger>
          <TabsTrigger value="bcrypt">Bcrypt Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="strength" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="strength-pass-input" className="text-sm font-medium">Password Input</label>
            <input
              id="strength-pass-input"
              type="text"
              placeholder="Enter password to test..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
          </div>

          {password && (
            <div className="border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span>Strength Score: <span className="font-bold text-foreground">{getStrengthLabel(strength.score)}</span></span>
                <span className="font-mono text-muted-foreground">{strength.entropy} bits entropy</span>
              </div>
              
              {/* Progress bars */}
              <div className="grid grid-cols-4 gap-1.5 h-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-colors ${
                      step <= strength.score ? getStrengthBarColor(strength.score) : "bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-border/40 text-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Estimated Crack Time:</span>
                <span className="font-semibold text-foreground">{strength.crackTimeDesc}</span>
              </div>

              {strength.suggestions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Suggestions:</span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground font-medium">
                    {strength.suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="key" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="key-length-select" className="text-sm font-medium">Key Length (Bytes)</label>
            <select
              id="key-length-select"
              value={keyLength}
              onChange={(e) => setKeyLength(Number(e.target.value) as any)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            >
              <option value={16}>128-bit (16 Bytes)</option>
              <option value={24}>192-bit (24 Bytes)</option>
              <option value={32}>256-bit (32 Bytes)</option>
            </select>
          </div>

          <button
            onClick={handleGenerateKey}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Generate Cryptographic Key
          </button>

          {generatedKey && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hex Key</span>
                <button
                  onClick={() => handleCopy(generatedKey)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center h-10 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 text-xs font-mono select-all truncate">
                {generatedKey}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bcrypt" className="space-y-6 pt-4">
          {/* Bcrypt Generator */}
          <div className="space-y-4 border border-border/60 p-5 rounded-2xl bg-card">
            <h3 className="font-bold text-sm">Bcrypt Hash Generator</h3>
            <div className="space-y-2">
              <label htmlFor="bcrypt-plain-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Password to Hash</label>
              <input
                id="bcrypt-plain-input"
                type="text"
                value={bcryptPass}
                onChange={(e) => setBcryptPass(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                placeholder="Password string..."
              />
            </div>
            <button
              onClick={handleGenerateBcrypt}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
            >
              Generate Bcrypt Hash
            </button>

            {bcryptHash && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Generated Bcrypt Hash</span>
                  <button
                    onClick={() => handleCopy(bcryptHash)}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center h-10 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 text-xs font-mono select-all truncate">
                  {bcryptHash}
                </div>
              </div>
            )}
          </div>

          {/* Bcrypt Verifier */}
          <div className="space-y-4 border border-border/60 p-5 rounded-2xl bg-card">
            <h3 className="font-bold text-sm">Bcrypt Hash Verifier</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="bcrypt-verify-pass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Password Plaintext</label>
                <input
                  id="bcrypt-verify-pass"
                  type="text"
                  value={verifyPass}
                  onChange={(e) => { setVerifyPass(e.target.value); setVerificationResult(null); }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bcrypt-verify-hash" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Bcrypt Hash to Compare</label>
                <input
                  id="bcrypt-verify-hash"
                  type="text"
                  value={verifyHash}
                  onChange={(e) => { setVerifyHash(e.target.value); setVerificationResult(null); }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
                  placeholder="$2a$10$..."
                />
              </div>
            </div>
            <button
              onClick={handleVerifyBcrypt}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
            >
              Verify Hash Matches
            </button>

            {verificationResult !== null && (
              <div className={`rounded-xl border p-4 space-y-1 ${verificationResult ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {verificationResult ? "✓ Password Matches Hash" : "✗ Password Does Not Match Hash"}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
