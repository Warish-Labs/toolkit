"use client";

import { useState } from "react";
import { Textarea } from "@/src/ui/shared/textarea";
import { Button } from "@/src/ui/shared/button";
import { Label } from "@/src/ui/shared/label";
import { convertCase, type CaseType } from "@/src/logic/case-converter";
import { Clipboard, Check } from "lucide-react";

const caseOptions: { value: CaseType; label: string }[] = [
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "titleCase", label: "Title Case" },
  { value: "sentenceCase", label: "Sentence case" },
  { value: "camelCase", label: "camelCase" },
  { value: "pascalCase", label: "PascalCase" },
  { value: "snakeCase", label: "snake_case" },
  { value: "kebabCase", label: "kebab-case" },
  { value: "constantCase", label: "CONSTANT_CASE" },
];

export function CaseConverterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (type: CaseType) => {
    setText(convertCase(text, type));
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="case-input">Text to Convert</Label>
          <div className="flex gap-2">
            {text && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-xs gap-1">
                {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 text-xs">
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="case-input"
          rows={8}
          placeholder="Type or paste your text here to convert its case..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Conversion Formats</Label>
        <div className="flex flex-wrap gap-2">
          {caseOptions.map((opt) => (
            <Button
              key={opt.value}
              variant="outline"
              size="sm"
              onClick={() => handleConvert(opt.value)}
              disabled={!text}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
