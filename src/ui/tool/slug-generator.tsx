"use client";

import { useState } from "react";
import { generateSlug } from "@/src/logic/slug-generator";

export function SlugGeneratorTool() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState(0);

  const result = generateSlug(text, {
    separator,
    lowercase,
    removeStopWords,
    maxLength
  });

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="slug-text" className="text-sm font-medium">Source Text</label>
        <textarea
          id="slug-text"
          className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-sans shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. Next.js 15 App Router & SEO Best Practices!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <div className="space-y-1.5">
          <label htmlFor="slug-separator" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Separator</label>
          <select
            id="slug-separator"
            value={separator}
            onChange={(e) => setSeparator(e.target.value as '-' | '_')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value="-">Dash (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="slug-max-length" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max Length (0 = None)</label>
          <input
            id="slug-max-length"
            type="number"
            min={0}
            value={maxLength}
            onChange={(e) => setMaxLength(Math.max(0, Number(e.target.value)))}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input
            id="slug-lowercase"
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="slug-lowercase" className="text-xs font-medium cursor-pointer">Lowercase</label>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input
            id="slug-remove-stop-words"
            type="checkbox"
            checked={removeStopWords}
            onChange={(e) => setRemoveStopWords(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="slug-remove-stop-words" className="text-xs font-medium cursor-pointer">Strip Stopwords</label>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Slug</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center h-10 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 text-xs font-mono select-all">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
