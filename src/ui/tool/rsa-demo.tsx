"use client";

import { useState } from "react";
import { generateRsaKeyPair } from "@/src/logic/security-crypto";

export function RsaDemoTool() {
  const [keys, setKeys] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateRsaKeyPair();
      setKeys(res);
    } catch (e) {
      // failed
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus-ring"
      >
        {loading ? "Generating 2048-bit Keys..." : "Generate RSA 2048 Keypair"}
      </button>

      {keys && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Public Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Public Key (SPKI)</span>
              <button
                onClick={() => handleCopy(keys.publicKeyPem)}
                className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-card text-[9px] font-mono overflow-x-auto whitespace-pre leading-relaxed select-all max-h-[250px]">
              {keys.publicKeyPem}
            </pre>
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Private Key (PKCS8)</span>
              <button
                onClick={() => handleCopy(keys.privateKeyPem)}
                className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-card text-[9px] font-mono overflow-x-auto whitespace-pre leading-relaxed select-all max-h-[250px]">
              {keys.privateKeyPem}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
