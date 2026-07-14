"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

const PROMPT_TEMPLATES = [
  {
    name: "Blog Post Writer",
    text: "Write a high-quality blog post about [TOPIC]. The target audience is [AUDIENCE] and the tone should be [TONE]. Focus on explaining technical concepts clearly.",
  },
  {
    name: "Code Reviewer",
    text: "Review the following [LANGUAGE] code for bugs, architectural efficiency, security vulnerabilities, and adherence to clean code standards:\n\n```[LANGUAGE]\n[PASTE_CODE]\n```",
  },
  {
    name: "Translator",
    text: "Translate the following text from [SOURCE_LANG] into [TARGET_LANG], keeping the tone, context, and idiomatic expressions intact:\n\n\"[TEXT_TO_TRANSLATE]\"",
  },
  {
    name: "Text Summarizer",
    text: "Summarize the text below in [LENGTH] bullet points, focusing on the core insights and omitting minor details:\n\n\"[TEXT]\"",
  },
  {
    name: "Technical Q&A",
    text: "You are a technical expert. Explain the concept of [CONCEPT] to someone with a [BACKGROUND] background. Use simple analogies where appropriate.",
  },
];

export function PromptStudioTool() {
  const [activeTab, setActiveTab] = useState("formatter");

  // Input States
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // Token Estimator States
  const [wordsCount, setWordsCount] = useState(0);
  const [charsCount, setCharsCount] = useState(0);
  const [tokensEstimate, setTokensEstimate] = useState(0);
  const [costEstimate, setCostEstimate] = useState(0);

  // Template States
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_TEMPLATES[0].text);

  const handleInputChange = (val: string) => {
    setInputText(val);
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    const tokens = Math.round(words * 1.3);
    setWordsCount(words);
    setCharsCount(val.length);
    setTokensEstimate(tokens);
    setCostEstimate((tokens / 1000) * 0.0015); // GPT-3.5 scale pricing
  };

  // Formatting operations
  const formatPrompt = (mode: string) => {
    let result = inputText;
    if (mode === "system-header") {
      result = `[SYSTEM]\nYou are a helpful assistant.\n\n[USER]\n${inputText}`;
    } else if (mode === "code-fence") {
      result = `Here is the code block:\n\n\`\`\`\n${inputText}\n\`\`\``;
    } else if (mode === "clean") {
      result = inputText
        .replace(/\n\s*\n+/g, "\n\n") // remove extra newlines
        .replace(/[ \t]+/g, " ") // normalize spacing
        .trim();
    }
    setOutputText(result);
  };

  // Markdown builder operations
  const insertMarkdown = (syntax: string) => {
    let tag = "";
    if (syntax === "h1") tag = "# ";
    else if (syntax === "h2") tag = "## ";
    else if (syntax === "bold") tag = "**text**";
    else if (syntax === "italic") tag = "*text*";
    else if (syntax === "list") tag = "- ";
    else if (syntax === "code") tag = "`code`";

    setInputText(inputText + tag);
    handleInputChange(inputText + tag);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-5 text-[10px] sm:text-xs">
          <TabsTrigger value="formatter">Formatter</TabsTrigger>
          <TabsTrigger value="token">Token Counter</TabsTrigger>
          <TabsTrigger value="cleaner">Cleaner</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>

        {/* ── Formatter ── */}
        <TabsContent value="formatter" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="fmt-inp" className="text-xs font-semibold text-muted-foreground uppercase">Enter Prompt</label>
            <textarea
              id="fmt-inp"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-xs shadow-sm focus:outline-none"
              placeholder="Enter your system rules, data variables, or custom text..."
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => formatPrompt("system-header")}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition"
            >
              Add Role Headers
            </button>
            <button
              onClick={() => formatPrompt("code-fence")}
              className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/90 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition"
            >
              Wrap Code Fence
            </button>
            <button
              onClick={() => formatPrompt("clean")}
              className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/90 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition"
            >
              Normalize Text
            </button>
          </div>

          {outputText && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Formatted Output</span>
                <button
                  onClick={() => handleCopy(outputText)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy Prompt
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[120px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
                value={outputText}
              />
            </div>
          )}
        </TabsContent>

        {/* ── Token Estimator ── */}
        <TabsContent value="token" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="tkn-inp" className="text-xs font-semibold text-muted-foreground uppercase">Enter Prompt Text</label>
            <textarea
              id="tkn-inp"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-xs shadow-sm focus:outline-none"
              placeholder="Paste prompt to estimate token volume..."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-4 text-xs font-mono">
            <div className="border bg-card p-3 rounded-xl text-center">
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">Words</span>
              <span className="text-base font-bold text-primary block mt-1">{wordsCount}</span>
            </div>
            <div className="border bg-card p-3 rounded-xl text-center">
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">Characters</span>
              <span className="text-base font-bold text-primary block mt-1">{charsCount}</span>
            </div>
            <div className="border bg-card p-3 rounded-xl text-center">
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">Est. Tokens</span>
              <span className="text-base font-bold text-primary block mt-1">{tokensEstimate}</span>
            </div>
            <div className="border bg-card p-3 rounded-xl text-center">
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">Est. Cost</span>
              <span className="text-base font-bold text-primary block mt-1">${costEstimate.toFixed(5)}</span>
            </div>
          </div>
        </TabsContent>

        {/* ── Cleaner ── */}
        <TabsContent value="cleaner" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="cln-inp" className="text-xs font-semibold text-muted-foreground uppercase">Messy Prompt</label>
            <textarea
              id="cln-inp"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-xs shadow-sm focus:outline-none"
              placeholder="Paste prompt with redundant formatting or extra spacing..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => formatPrompt("clean")}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition"
            >
              Clean & Format
            </button>
          </div>

          {outputText && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clean Output</span>
                <button
                  onClick={() => handleCopy(outputText)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition"
                >
                  Copy Prompt
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[120px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
                value={outputText}
              />
            </div>
          )}
        </TabsContent>

        {/* ── Templates ── */}
        <TabsContent value="templates" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="tmpl-select" className="text-xs font-semibold text-muted-foreground uppercase">Select Template</label>
            <select
              id="tmpl-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none font-sans"
            >
              {PROMPT_TEMPLATES.map((tmpl, idx) => (
                <option key={idx} value={tmpl.text}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">Template View</span>
              <button
                onClick={() => handleCopy(selectedTemplate)}
                className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
              >
                Copy Template
              </button>
            </div>
            <textarea
              readOnly
              className="flex min-h-[140px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all"
              value={selectedTemplate}
            />
          </div>
        </TabsContent>

        {/* ── Markdown Builder ── */}
        <TabsContent value="markdown" className="pt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {["h1", "h2", "bold", "italic", "list", "code"].map((tag) => (
              <button
                key={tag}
                onClick={() => insertMarkdown(tag)}
                className="bg-secondary/60 hover:bg-secondary px-3 py-1 rounded text-xs font-semibold uppercase transition"
              >
                + {tag}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <textarea
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex min-h-[150px] w-full rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-xs shadow-sm focus:outline-none font-mono"
              placeholder="Construct your markdown prompt here..."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
