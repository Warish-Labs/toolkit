"use client";

import { useState } from "react";
import { stringToBase32, base32ToString, stringToHex, hexToString, stringToBinary, binaryToHtml } from "@/src/logic/encoding-studio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function EncodingStudioTool() {
  const [activeTab, setActiveTab] = useState("base32");

  // Inputs
  const [inputVal, setInputVal] = useState("Hello World");
  const [encodedVal, setEncodedVal] = useState("");
  const [error, setError] = useState("");

  const handleEncode = (mode: string, text: string) => {
    setError("");
    try {
      if (mode === "base32") {
        setEncodedVal(stringToBase32(text));
      } else if (mode === "hex") {
        setEncodedVal(stringToHex(text));
      } else if (mode === "binary") {
        setEncodedVal(stringToBinary(text));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Encoding failed");
      setEncodedVal("");
    }
  };

  const handleDecode = (mode: string, text: string) => {
    setError("");
    try {
      if (mode === "base32") {
        setEncodedVal(base32ToString(text));
      } else if (mode === "hex") {
        setEncodedVal(hexToString(text));
      } else if (mode === "binary") {
        setEncodedVal(binaryToHtml(text));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decoding failed. Please verify format structure.");
      setEncodedVal("");
    }
  };

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setEncodedVal(""); setError(""); }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="base32">Base32</TabsTrigger>
          <TabsTrigger value="hex">Hexadecimal</TabsTrigger>
          <TabsTrigger value="binary">Binary</TabsTrigger>
        </TabsList>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="encode-input" className="text-sm font-medium">Input Message / Ciphertext</label>
            <textarea
              id="encode-input"
              value={inputVal}
              onChange={(e) => { setInputVal(e.target.value); setEncodedVal(""); }}
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-sans shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder="Type message to encode or ciphertext to decode..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleEncode(activeTab, inputVal)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
            >
              Encode Output
            </button>
            <button
              onClick={() => handleDecode(activeTab, inputVal)}
              className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors focus-ring"
            >
              Decode Input
            </button>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          {encodedVal && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result Output</span>
                <button
                  onClick={() => handleCopy(encodedVal)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy Result
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[90px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
                value={encodedVal}
              />
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
