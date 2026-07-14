"use client";

import { useState } from "react";
import { inspectUnicode } from "@/src/logic/unicode-inspector";

export function UnicodeInspectorTool() {
  const [text, setText] = useState("");
  const results = inspectUnicode(text);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="unicode-input" className="text-sm font-medium">Text Input</label>
        <input
          id="unicode-input"
          type="text"
          placeholder="e.g. Hello World! 👋"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
        />
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Unicode Character breakdown</span>
          
          <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead className="bg-muted/40 font-sans text-muted-foreground uppercase tracking-wider text-[10px] sticky top-0 border-b border-border/60">
                  <tr>
                    <th className="p-3 pl-4">Character</th>
                    <th className="p-3">Code Point</th>
                    <th className="p-3">Decimal</th>
                    <th className="p-3">Hex</th>
                    <th className="p-3 pr-4">HTML Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="p-3 pl-4 text-primary font-sans text-lg font-bold select-all">{row.char}</td>
                      <td className="p-3 font-semibold text-foreground">{row.codePoint}</td>
                      <td className="p-3 text-muted-foreground">{row.decCode}</td>
                      <td className="p-3 text-muted-foreground">{row.hexCode}</td>
                      <td className="p-3 text-muted-foreground pr-4 select-all">{row.htmlEntity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
