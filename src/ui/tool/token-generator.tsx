"use client";

import { useState } from "react";
import {
  generateRandomToken,
  calculateTokenEntropy,
  ENV_PRESETS,
  type TokenFormat,
  type TokenOptions,
  type EnvPreset,
} from "@/src/logic/token-generator";

export function TokenGeneratorTool() {
  // Config states
  const [size, setSize] = useState(32);
  const [sizeType, setSizeType] = useState<"bytes" | "chars">("bytes");
  const [format, setFormat] = useState<TokenFormat>("base64url");
  const [quantity, setQuantity] = useState(1);
  const [envVarName, setEnvVarName] = useState("JWT_SECRET");

  // Pure function to generate tokens for initial state
  const generateTokensList = (
    currentSize: number,
    currentSizeType: "bytes" | "chars",
    currentFormat: TokenFormat,
    currentQty: number
  ): string[] => {
    try {
      const generated: string[] = [];
      const opts: TokenOptions = { size: currentSize, sizeType: currentSizeType, format: currentFormat };
      for (let i = 0; i < currentQty; i++) {
        generated.push(generateRandomToken(opts));
      }
      return generated;
    } catch {
      return [];
    }
  };

  // Output states
  const [tokens, setTokens] = useState<string[]>(() =>
    generateTokensList(32, "bytes", "base64url", 1)
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedEnvLine, setCopiedEnvLine] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = (
    currentSize = size,
    currentSizeType = sizeType,
    currentFormat = format,
    currentQty = quantity
  ) => {
    setError("");
    try {
      const opts: TokenOptions = { size: currentSize, sizeType: currentSizeType, format: currentFormat };
      const generated: string[] = [];
      for (let i = 0; i < currentQty; i++) {
        generated.push(generateRandomToken(opts));
      }
      setTokens(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate tokens");
    }
  };

  const applyPreset = (preset: EnvPreset) => {
    setSize(preset.defaultSize);
    setSizeType(preset.defaultSizeType);
    setFormat(preset.defaultFormat);
    setEnvVarName(preset.envVar);
    handleGenerate(preset.defaultSize, preset.defaultSizeType, preset.defaultFormat, quantity);
  };

  const handleCopyToken = (token: string, index: number) => {
    navigator.clipboard.writeText(token);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(tokens.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyEnvLine = (token: string) => {
    const cleanVarName = envVarName.trim().toUpperCase() || "SECRET_KEY";
    navigator.clipboard.writeText(`${cleanVarName}=${token}`);
    setCopiedEnvLine(true);
    setTimeout(() => setCopiedEnvLine(false), 2000);
  };

  const getEntropyDetails = (token: string) => {
    const entropy = calculateTokenEntropy(token, { size, sizeType, format });
    let label = "Weak";
    let color = "text-rose-500 bg-rose-500/10 border-rose-500/20";
    let progressColor = "bg-rose-500";
    const pct = Math.min(100, (entropy / 256) * 100);

    if (entropy >= 128) {
      label = "Excellent (Cryptographically Strong)";
      color = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      progressColor = "bg-emerald-500";
    } else if (entropy >= 80) {
      label = "Strong";
      color = "text-teal-500 bg-teal-500/10 border-teal-500/20";
      progressColor = "bg-teal-500";
    } else if (entropy >= 50) {
      label = "Moderate";
      color = "text-amber-500 bg-amber-500/10 border-amber-500/20";
      progressColor = "bg-amber-500";
    }

    return { entropy, label, color, progressColor, pct };
  };

  const primaryToken = tokens[0] || "";
  const entropyDetails = getEntropyDetails(primaryToken);

  return (
    <div className="space-y-6">
      {/* Env Presets Section */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Select an Environment Preset
        </span>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {ENV_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex flex-col text-left p-3.5 border border-border/60 rounded-xl bg-card hover:bg-muted/40 transition-colors shadow-sm cursor-pointer"
            >
              <span className="text-xs font-bold text-foreground">{preset.name}</span>
              <span className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Configuration Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Panel: Configuration */}
        <div className="space-y-6 rounded-xl border border-border/50 bg-muted/20 p-5">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Configuration
          </h3>

          <div className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Token Format</label>
              <select
                value={format}
                onChange={(e) => {
                  const nextFormat = e.target.value as TokenFormat;
                  setFormat(nextFormat);
                  handleGenerate(size, sizeType, nextFormat, quantity);
                }}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="base64url" className="bg-popover text-popover-foreground">Base64URL (URL Safe, Standard)</option>
                <option value="base64" className="bg-popover text-popover-foreground">Base64 (Standard)</option>
                <option value="hex" className="bg-popover text-popover-foreground">Hexadecimal (Hex, 0-9, a-f)</option>
                <option value="alphanumeric" className="bg-popover text-popover-foreground">Alphanumeric (A-Z, a-z, 0-9)</option>
                <option value="alphanumeric_symbols" className="bg-popover text-popover-foreground">Alphanumeric + Symbols (Strongest)</option>
              </select>
            </div>

            {/* Size Unit Type Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Size Unit</label>
              <div className="flex rounded-lg border border-border/80 p-0.5 bg-card text-xs w-fit">
                <button
                  onClick={() => {
                    setSizeType("bytes");
                    handleGenerate(size, "bytes", format, quantity);
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    sizeType === "bytes" ? "bg-secondary text-secondary-foreground shadow-sm" : "hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  Bytes (Entropy source)
                </button>
                <button
                  onClick={() => {
                    setSizeType("chars");
                    handleGenerate(size, "chars", format, quantity);
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    sizeType === "chars" ? "bg-secondary text-secondary-foreground shadow-sm" : "hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  Characters (Length)
                </button>
              </div>
            </div>

            {/* Size Slider & Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Size ({sizeType})</span>
                <input
                  type="number"
                  min="8"
                  max="256"
                  value={size}
                  onChange={(e) => {
                    const nextSize = Math.max(8, Math.min(256, parseInt(e.target.value) || 32));
                    setSize(nextSize);
                    handleGenerate(nextSize, sizeType, format, quantity);
                  }}
                  className="w-16 rounded border border-input px-1.5 py-0.5 text-center font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <input
                type="range"
                min="8"
                max="128"
                value={size}
                onChange={(e) => {
                  const nextSize = parseInt(e.target.value);
                  setSize(nextSize);
                  handleGenerate(nextSize, sizeType, format, quantity);
                }}
                className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground block leading-tight">
                {sizeType === "bytes"
                  ? `Generates random token from ${size} cryptographically secure bytes.`
                  : `Generates a random token string of exactly ${size} characters.`}
              </span>
            </div>

            {/* Batch Quantity Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tokens Quantity</label>
              <select
                value={quantity}
                onChange={(e) => {
                  const nextQty = parseInt(e.target.value);
                  setQuantity(nextQty);
                  handleGenerate(size, sizeType, format, nextQty);
                }}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="1" className="bg-popover text-popover-foreground">Generate 1 Token</option>
                <option value="5" className="bg-popover text-popover-foreground">Generate 5 Tokens</option>
                <option value="10" className="bg-popover text-popover-foreground">Generate 10 Tokens</option>
                <option value="20" className="bg-popover text-popover-foreground">Generate 20 Tokens</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Panel: Output & Strength Audit */}
        <div className="space-y-6">
          {/* Audit Card */}
          {primaryToken && (
            <div className={`p-4 border rounded-xl space-y-3 shadow-sm ${entropyDetails.color}`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Token Security Audit
                </span>
                <span className="font-bold">{entropyDetails.entropy} Bits Entropy</span>
              </div>

              <div className="w-full bg-muted-foreground/10 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${entropyDetails.progressColor}`}
                  style={{ width: `${entropyDetails.pct}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-medium leading-none">
                <span>Strength: {entropyDetails.label}</span>
                {entropyDetails.entropy >= 128 ? (
                  <span>Highly Secure ✓</span>
                ) : (
                  <span>Secure for most apps</span>
                )}
              </div>
            </div>
          )}

          {/* Env formatting copy helper */}
          {primaryToken && quantity === 1 && (
            <div className="space-y-2.5 rounded-xl border border-border/50 bg-muted/20 p-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                .env File Format Builder
              </span>
              <div className="grid gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    Env Variable Name
                  </label>
                  <input
                    type="text"
                    value={envVarName}
                    onChange={(e) => setEnvVarName(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                    placeholder="JWT_SECRET"
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex items-center justify-between border border-border/60 bg-card rounded-lg p-2 text-xs font-mono overflow-x-auto select-all">
                  <span className="text-foreground shrink-0">{envVarName || "SECRET_KEY"}=</span>
                  <span className="text-primary truncate ml-1 mr-3 max-w-[200px]">
                    {primaryToken}
                  </span>
                  <button
                    onClick={() => handleCopyEnvLine(primaryToken)}
                    className="ml-auto text-[10px] shrink-0 font-semibold bg-secondary/80 hover:bg-secondary px-2.5 py-1 rounded transition-colors text-secondary-foreground cursor-pointer"
                  >
                    {copiedEnvLine ? "Copied! ✓" : "Copy Line"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => handleGenerate(size, sizeType, format, quantity)}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-ring cursor-pointer"
            >
              Regenerate Tokens
            </button>
          </div>
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
        </div>
      </div>

      {/* Generated Tokens Display Batch */}
      {tokens.length > 0 && (
        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/10 p-5 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Generated Tokens
            </span>
            {tokens.length > 1 && (
              <button
                onClick={handleCopyAll}
                className="text-xs bg-secondary/85 hover:bg-secondary px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              >
                {copiedAll ? "Copied All! ✓" : "Copy All Tokens"}
              </button>
            )}
          </div>

          <div className="grid gap-2">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 border border-border/40 bg-card/60 rounded-xl p-3 text-xs font-mono overflow-hidden"
              >
                <span className="text-muted-foreground w-6 shrink-0 text-center font-bold">
                  #{index + 1}
                </span>
                <span className="text-foreground truncate break-all select-all flex-1 min-w-0">
                  {token}
                </span>
                <button
                  onClick={() => handleCopyToken(token, index)}
                  className="text-[10px] shrink-0 font-semibold bg-secondary/80 hover:bg-secondary px-2.5 py-1 rounded transition-colors text-secondary-foreground cursor-pointer"
                >
                  {copiedIndex === index ? "Copied! ✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
