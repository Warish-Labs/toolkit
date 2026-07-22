"use client";

import { useState } from "react";
import { generateJwt, generateJwtRsaKeyPair } from "@/src/logic/jwt-generator";

const INITIAL_HEADER = {
  alg: "HS256",
  typ: "JWT",
};

const INITIAL_PAYLOAD = {
  sub: "1234567890",
  name: "John Doe",
  iat: Math.floor(Date.now() / 1000),
  admin: true,
};

export function JwtGeneratorTool() {
  const [headerStr, setHeaderStr] = useState(JSON.stringify(INITIAL_HEADER, null, 2));
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(INITIAL_PAYLOAD, null, 2));
  const [alg, setAlg] = useState("HS256");
  const [secret, setSecret] = useState("your-256-bit-secret-key-here");
  const [privateKeyPem, setPrivateKeyPem] = useState("");
  const [publicKeyPem, setPublicKeyPem] = useState("");
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  const [headerError, setHeaderError] = useState("");
  const [payloadError, setPayloadError] = useState("");
  const [genError, setGenError] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAlgChange = (nextAlg: string) => {
    setAlg(nextAlg);
    try {
      const parsed = JSON.parse(headerStr);
      if (parsed.alg !== nextAlg) {
        parsed.alg = nextAlg;
        setHeaderStr(JSON.stringify(parsed, null, 2));
      }
    } catch {
      // Don't overwrite if JSON is currently invalid
    }
  };

  // Sync state alg when header JSON alg is edited directly
  const handleHeaderChange = (val: string) => {
    setHeaderStr(val);
    setHeaderError("");
    try {
      const parsed = JSON.parse(val);
      if (parsed.alg && parsed.alg !== alg) {
        setAlg(parsed.alg);
      }
    } catch {
      setHeaderError("Invalid JSON syntax");
    }
  };

  const handlePayloadChange = (val: string) => {
    setPayloadStr(val);
    setPayloadError("");
    try {
      JSON.parse(val);
    } catch {
      setPayloadError("Invalid JSON syntax");
    }
  };

  const handleGenerate = async () => {
    setGenError("");
    setGeneratedToken("");

    let headerObj;
    let payloadObj;

    try {
      headerObj = JSON.parse(headerStr);
    } catch {
      setGenError("Header contains invalid JSON.");
      return;
    }

    try {
      payloadObj = JSON.parse(payloadStr);
    } catch {
      setGenError("Payload contains invalid JSON.");
      return;
    }

    try {
      const keyOrSecret = alg === "RS256" ? privateKeyPem : secret;
      const token = await generateJwt(headerObj, payloadObj, keyOrSecret);
      setGeneratedToken(token);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Failed to generate JWT");
    }
  };

  const handleGenerateRsaKeys = async () => {
    setIsGeneratingKeys(true);
    setGenError("");
    try {
      const keys = await generateJwtRsaKeyPair();
      setPrivateKeyPem(keys.privateKeyPem);
      setPublicKeyPem(keys.publicKeyPem);
    } catch {
      setGenError("Failed to generate RSA keys.");
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const handleGenerateRandomSecret = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    const randSecret = Array.from(bytes)
      .map((b) => chars[b % chars.length])
      .join("");
    setSecret(randSecret);
  };

  const setExpirationTime = (minutes: number) => {
    try {
      const parsed = JSON.parse(payloadStr);
      parsed.exp = Math.floor(Date.now() / 1000) + minutes * 60;
      setPayloadStr(JSON.stringify(parsed, null, 2));
      setPayloadError("");
    } catch {
      setGenError("Cannot set expiration. Payload is not valid JSON.");
    }
  };

  const removeExpiration = () => {
    try {
      const parsed = JSON.parse(payloadStr);
      delete parsed.exp;
      setPayloadStr(JSON.stringify(parsed, null, 2));
      setPayloadError("");
    } catch {
      setGenError("Payload is not valid JSON.");
    }
  };

  const addIssuedAt = () => {
    try {
      const parsed = JSON.parse(payloadStr);
      parsed.iat = Math.floor(Date.now() / 1000);
      setPayloadStr(JSON.stringify(parsed, null, 2));
      setPayloadError("");
    } catch {
      setGenError("Payload is not valid JSON.");
    }
  };

  const addJwtId = () => {
    try {
      const parsed = JSON.parse(payloadStr);
      const randBytes = new Uint8Array(16);
      window.crypto.getRandomValues(randBytes);
      const uuid = Array.from(randBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
      parsed.jti = uuid;
      setPayloadStr(JSON.stringify(parsed, null, 2));
      setPayloadError("");
    } catch {
      setGenError("Payload is not valid JSON.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getColoredToken = () => {
    if (!generatedToken) return null;
    const parts = generatedToken.split(".");
    return (
      <div className="font-mono break-all text-xs border border-border/60 rounded-xl p-4 bg-muted/40 leading-relaxed">
        <span className="text-rose-500 font-medium">{parts[0]}</span>
        <span className="text-muted-foreground font-bold">.</span>
        <span className="text-fuchsia-500 font-medium">{parts[1]}</span>
        <span className="text-muted-foreground font-bold">.</span>
        <span className="text-cyan-500 font-medium">{parts[2]}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          {/* Algorithm & Signature Selection */}
          <div className="space-y-3 rounded-xl border border-border/50 bg-muted/20 p-5">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Signing Configuration
            </h3>

            <div className="grid gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Algorithm (alg)</label>
                <select
                  value={alg}
                  onChange={(e) => handleAlgChange(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="HS256" className="bg-popover text-popover-foreground">HS256 (HMAC SHA-256)</option>
                  <option value="HS384" className="bg-popover text-popover-foreground">HS384 (HMAC SHA-384)</option>
                  <option value="HS512" className="bg-popover text-popover-foreground">HS512 (HMAC SHA-512)</option>
                  <option value="RS256" className="bg-popover text-popover-foreground">RS256 (RSA PKCS#1 v1.5 SHA-256)</option>
                  <option value="none" className="bg-popover text-popover-foreground">none (Unsigned / Unsecured)</option>
                </select>
              </div>

              {/* Symmetric Secrets */}
              {alg.startsWith("HS") && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-foreground">HMAC Secret</label>
                    <button
                      onClick={handleGenerateRandomSecret}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary px-2.5 py-1 rounded transition-colors text-secondary-foreground"
                    >
                      Generate Secret
                    </button>
                  </div>
                  <input
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              )}

              {/* Asymmetric Private Keys */}
              {alg === "RS256" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-foreground">
                      RSA Private Key (PKCS#8 PEM)
                    </label>
                    <button
                      onClick={handleGenerateRsaKeys}
                      disabled={isGeneratingKeys}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary disabled:opacity-50 px-2.5 py-1 rounded transition-colors text-secondary-foreground"
                    >
                      {isGeneratingKeys ? "Generating..." : "Generate RSA Key Pair"}
                    </button>
                  </div>
                  <textarea
                    value={privateKeyPem}
                    onChange={(e) => setPrivateKeyPem(e.target.value)}
                    placeholder="-----BEGIN PRIVATE KEY-----\n..."
                    className="flex min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-[10px] font-mono shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {publicKeyPem && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                        Matching Public Key (SPKI PEM)
                      </span>
                      <pre className="p-3 border border-border/50 rounded-lg bg-card text-[9px] font-mono overflow-auto max-h-[80px]">
                        {publicKeyPem}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {alg === "none" && (
                <p className="text-xs text-amber-500 font-medium">
                  Warning: No signature will be generated. The token will be unsecured and end in a dot.
                </p>
              )}
            </div>
          </div>

          {/* Header Editor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                JWT Header
              </span>
              {headerError && <span className="text-[10px] text-destructive">{headerError}</span>}
            </div>
            <textarea
              value={headerStr}
              onChange={(e) => handleHeaderChange(e.target.value)}
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Right Column: Payload & Helpers */}
        <div className="space-y-6">
          {/* Payload Editor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                JWT Payload (Claims)
              </span>
              {payloadError && <span className="text-[10px] text-destructive">{payloadError}</span>}
            </div>
            <textarea
              value={payloadStr}
              onChange={(e) => handlePayloadChange(e.target.value)}
              className="flex min-h-[220px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Claim Quick Helpers */}
          <div className="space-y-2.5 rounded-xl border border-border/50 bg-muted/20 p-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Quick Payload Claims
            </span>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex rounded-lg border border-border/80 p-0.5 bg-card text-xs">
                <button
                  onClick={() => setExpirationTime(5)}
                  className="px-2 py-1 hover:bg-secondary rounded-md transition-colors"
                >
                  +5m Exp
                </button>
                <button
                  onClick={() => setExpirationTime(60)}
                  className="px-2 py-1 hover:bg-secondary rounded-md transition-colors"
                >
                  +1h Exp
                </button>
                <button
                  onClick={() => setExpirationTime(24 * 60)}
                  className="px-2 py-1 hover:bg-secondary rounded-md transition-colors"
                >
                  +1d Exp
                </button>
                <button
                  onClick={removeExpiration}
                  className="px-2 py-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Clear Exp
                </button>
              </div>

              <button
                onClick={addIssuedAt}
                className="text-xs bg-secondary/70 hover:bg-secondary border border-border/85 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                Set iat (Now)
              </button>

              <button
                onClick={addJwtId}
                className="text-xs bg-secondary/70 hover:bg-secondary border border-border/85 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                Add jti (UUID)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger & Error Handling */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleGenerate}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-ring cursor-pointer"
        >
          Generate JWT
        </button>
        {genError && <p className="text-xs text-destructive font-medium">{genError}</p>}
      </div>

      {/* Final Encoded Token Output */}
      {generatedToken && (
        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/10 p-5 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Generated JWT Token (Encoded)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                {copied ? "Copied! ✓" : "Copy Token"}
              </button>
              <a
                href={`/tools/jwt-decoder?token=${encodeURIComponent(generatedToken)}`}
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                Open in Decoder →
              </a>
            </div>
          </div>
          {getColoredToken()}
        </div>
      )}
    </div>
  );
}
