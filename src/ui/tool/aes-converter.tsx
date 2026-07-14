"use client";

import { useState } from "react";
import { aesEncrypt, aesDecrypt } from "@/src/logic/security-crypto";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function AesConverterTool() {
  const [activeTab, setActiveTab] = useState("encrypt");

  // Encryption states
  const [encMessage, setEncMessage] = useState("");
  const [encSecret, setEncSecret] = useState("");
  const [encResult, setEncResult] = useState("");
  const [encError, setEncError] = useState("");

  // Decryption states
  const [decCipher, setDecCipher] = useState("");
  const [decSecret, setDecSecret] = useState("");
  const [decResult, setDecResult] = useState("");
  const [decError, setDecError] = useState("");

  const handleEncrypt = async () => {
    setEncError("");
    try {
      if (!encMessage || !encSecret) {
        throw new Error("Message and secret key are required.");
      }
      const res = await aesEncrypt(encMessage, encSecret);
      setEncResult(res);
    } catch (e) {
      setEncError(e instanceof Error ? e.message : "Encryption failed.");
      setEncResult("");
    }
  };

  const handleDecrypt = async () => {
    setDecError("");
    try {
      if (!decCipher || !decSecret) {
        throw new Error("Ciphertext and secret key are required.");
      }
      const res = await aesDecrypt(decCipher, decSecret);
      setDecResult(res);
    } catch (e) {
      setDecError(e instanceof Error ? e.message : "Decryption failed. Please check secret key and payload structure.");
      setDecResult("");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setEncError(""); setDecError(""); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">AES Encryption</TabsTrigger>
          <TabsTrigger value="decrypt">AES Decryption</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="aes-enc-msg" className="text-sm font-medium">Plain Text Message</label>
            <textarea
              id="aes-enc-msg"
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-sans shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder="Enter message to encrypt..."
              value={encMessage}
              onChange={(e) => setEncMessage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="aes-enc-key" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Secret Key</label>
            <input
              id="aes-enc-key"
              type="text"
              placeholder="Enter encryption passphrase..."
              value={encSecret}
              onChange={(e) => setEncSecret(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
            />
          </div>

          <button
            onClick={handleEncrypt}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Encrypt Message
          </button>

          {encError && <p className="text-xs text-destructive">{encError}</p>}

          {encResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Encrypted Ciphertext (Base64)</span>
                <button
                  onClick={() => handleCopy(encResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[90px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
                value={encResult}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="aes-dec-cipher" className="text-sm font-medium">Base64 Ciphertext</label>
            <textarea
              id="aes-dec-cipher"
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder="Paste encrypted base64 payload..."
              value={decCipher}
              onChange={(e) => setDecCipher(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="aes-dec-key" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Secret Key</label>
            <input
              id="aes-dec-key"
              type="text"
              placeholder="Enter decryption passphrase..."
              value={decSecret}
              onChange={(e) => setDecSecret(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
            />
          </div>

          <button
            onClick={handleDecrypt}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Decrypt Ciphertext
          </button>

          {decError && <p className="text-xs text-destructive">{decError}</p>}

          {decResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Decrypted Plain Text</span>
                <button
                  onClick={() => handleCopy(decResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[90px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-sans shadow-sm focus-visible:outline-none select-all"
                value={decResult}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
