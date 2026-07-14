"use client";

import { useState } from "react";
import { convertCaseExtended, type CaseType } from "@/src/logic/case-converter-extended";

export function CaseConverterExtendedTool() {
  const [text, setText] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("title");

  const result = convertCaseExtended(text, activeCase);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  const caseModes: { label: string; value: CaseType; example: string }[] = [
    { label: "Title Case", value: "title", example: "Title Case Example" },
    { label: "Sentence case", value: "sentence", example: "Sentence case example." },
    { label: "camelCase", value: "camel", example: "camelCaseExample" },
    { label: "PascalCase", value: "pascal", example: "PascalCaseExample" },
    { label: "snake_case", value: "snake", example: "snake_case_example" },
    { label: "kebab-case", value: "kebab", example: "kebab-case-example" },
    { label: "CONSTANT_CASE", value: "constant", example: "CONSTANT_CASE_EXAMPLE" },
    { label: "tOgGlE cAsE", value: "toggle", example: "tOgGlE cAsE eXaMpLe" },
    { label: "aLtErNaTiNg CaSe", value: "alternating", example: "aLtErNaTiNg CaSe ExAmPlE" }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="case-input" className="text-sm font-medium">Source Text</label>
        <textarea
          id="case-input"
          className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-sans shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter text to convert case here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Convert To</span>
        <div className="flex flex-wrap gap-2">
          {caseModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setActiveCase(mode.value)}
              className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all ${
                activeCase === mode.value
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-secondary/40 border-border hover:bg-secondary text-muted-foreground"
              }`}
              title={`Example: ${mode.example}`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Converted Text</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            className="flex min-h-[120px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-sans shadow-sm focus-visible:outline-none select-all"
            value={result}
          />
        </div>
      )}
    </div>
  );
}
