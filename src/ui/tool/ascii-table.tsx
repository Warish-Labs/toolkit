"use client";

import { useState } from "react";
import { getAsciiTable, generateAsciiArt } from "@/src/logic/ascii-utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function AsciiTableTool() {
  const [activeTab, setActiveTab] = useState("table");

  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const tableData = getAsciiTable();

  const filteredTable = tableData.filter(row => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      row.dec.toString().includes(q) ||
      row.hex.toLowerCase().includes(q) ||
      row.oct.includes(q) ||
      row.char.toLowerCase().includes(q) ||
      row.desc.toLowerCase().includes(q)
    );
  });

  // Art state
  const [artText, setArtText] = useState("TOOL");
  const asciiArt = generateAsciiArt(artText);

  const handleCopyArt = () => {
    if (!asciiArt) return;
    navigator.clipboard.writeText(asciiArt);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">ASCII Reference Table</TabsTrigger>
          <TabsTrigger value="art">ASCII Art Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search table by character, description, decimal, hex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead className="bg-muted/40 font-sans text-muted-foreground uppercase tracking-wider text-[10px] sticky top-0 border-b border-border/60">
                  <tr>
                    <th className="p-3 pl-4">Decimal</th>
                    <th className="p-3">Hex</th>
                    <th className="p-3">Octal</th>
                    <th className="p-3">Character</th>
                    <th className="p-3 pr-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTable.map((row) => (
                    <tr key={row.dec} className="hover:bg-muted/30">
                      <td className="p-3 pl-4 font-semibold text-foreground">{row.dec}</td>
                      <td className="p-3 text-muted-foreground">{row.hex}</td>
                      <td className="p-3 text-muted-foreground">{row.oct}</td>
                      <td className="p-3 text-primary font-bold">{row.char}</td>
                      <td className="p-3 font-sans text-muted-foreground">{row.desc}</td>
                    </tr>
                  ))}
                  {filteredTable.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground font-sans">
                        No ASCII matching terms found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="art" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="art-input" className="text-sm font-medium">Text Input (Letters & Numbers only)</label>
            <input
              id="art-input"
              type="text"
              placeholder="e.g. TEXT"
              value={artText}
              onChange={(e) => setArtText(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono uppercase shadow-sm focus:outline-none"
            />
          </div>

          {asciiArt && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ASCII Art Output</span>
                <button
                  onClick={handleCopyArt}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy Art
                </button>
              </div>
              <pre className="p-4 border border-border/60 rounded-xl bg-card text-[9px] sm:text-xs font-mono overflow-x-auto whitespace-pre leading-none font-bold text-primary select-all">
                {asciiArt}
              </pre>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
