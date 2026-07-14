"use client";

import { useState } from "react";
import { textToMorse, morseToText } from "@/src/logic/morse-converter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function MorseConverterTool() {
  const [activeTab, setActiveTab] = useState("encode");

  // Encode text to morse
  const [textToEncode, setTextToEncode] = useState("");
  const morseResult = textToMorse(textToEncode);

  // Decode morse to text
  const [morseToDecode, setMorseToDecode] = useState("");
  const textResult = morseToText(morseToDecode);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Text to Morse</TabsTrigger>
          <TabsTrigger value="decode">Morse to Text</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="morse-plain" className="text-sm font-medium">Plain Text</label>
            <textarea
              id="morse-plain"
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-sans shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder="Type message to convert to morse code..."
              value={textToEncode}
              onChange={(e) => setTextToEncode(e.target.value)}
            />
          </div>

          {morseResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Morse Code Output</span>
                <button
                  onClick={() => handleCopy(morseResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[100px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all tracking-wider"
                value={morseResult}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="decode" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="morse-code" className="text-sm font-medium">Morse Code (. and - separated by spaces, word separator /)</label>
            <textarea
              id="morse-code"
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none tracking-wider"
              placeholder="e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -.."
              value={morseToDecode}
              onChange={(e) => setMorseToDecode(e.target.value)}
            />
          </div>

          {textResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plain Text Output</span>
                <button
                  onClick={() => handleCopy(textResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[100px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-sans shadow-sm focus-visible:outline-none select-all uppercase"
                value={textResult}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
