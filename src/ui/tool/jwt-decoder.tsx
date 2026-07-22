"use client";

import { useState, useEffect } from "react";
import { decodeJwt, type DecodedJwt } from "@/src/logic/jwt-decoder";

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      if (tokenParam) {
        setToken(tokenParam);
        setError("");
        try {
          const res = decodeJwt(tokenParam);
          setResult(res);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Error decoding JWT");
          setResult(null);
        }
      }
    }
  }, []);

  const handleDecode = () => {
    setError("");
    try {
      const res = decodeJwt(token);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error decoding JWT");
      setResult(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setToken(text);
      setError("");
      setResult(null);
    } catch (e) {
      // fallback
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">JWT Token Input</span>
          <button
            onClick={handlePaste}
            className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
          >
            Paste Token
          </button>
        </div>
        <textarea
          className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4MTYyMzkwMjJ9.signature"
          value={token}
          onChange={(e) => { setToken(e.target.value); setError(""); }}
        />
      </div>

      <button
        onClick={handleDecode}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Decode JWT
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-5 grid gap-4 sm:grid-cols-3 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Token Status</span>
              <p className={`text-sm font-bold ${result.isExpired ? "text-destructive" : "text-emerald-500"}`}>
                {result.isExpired ? "Expired ✗" : "Active ✓"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Issued At (iat)</span>
              <p className="text-sm font-medium text-foreground">{formatDate(result.issuedAt)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Expiration Time (exp)</span>
              <p className="text-sm font-medium text-foreground">{formatDate(result.expiresAt)}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Header (Algorithm & Type)</span>
              <pre className="p-4 border border-border/60 rounded-xl bg-card text-xs font-mono overflow-auto max-h-[220px]">
                {JSON.stringify(result.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payload (Claims)</span>
              <pre className="p-4 border border-border/60 rounded-xl bg-card text-xs font-mono overflow-auto max-h-[220px]">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
