"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";
import { convertJsonToYaml, convertYamlToJson } from "@/src/logic/json-yaml";

export function JsonYamlConverterTool() {
  const [activeTab, setActiveTab] = useState("json2yaml");
  
  // JSON to YAML
  const [jsonInput, setJsonInput] = useState("");
  const [yamlResult, setYamlResult] = useState("");

  // YAML to JSON
  const [yamlInput, setYamlInput] = useState("");
  const [jsonResult, setJsonResult] = useState("");

  const [error, setError] = useState("");

  const handleJsonToYaml = () => {
    setError("");
    try {
      const res = convertJsonToYaml(jsonInput);
      setYamlResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error converting to YAML");
      setYamlResult("");
    }
  };

  const handleYamlToJson = () => {
    setError("");
    try {
      const res = convertYamlToJson(yamlInput);
      setJsonResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error converting to JSON");
      setJsonResult("");
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setError(""); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json2yaml">JSON to YAML</TabsTrigger>
          <TabsTrigger value="yaml2json">YAML to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json2yaml" className="space-y-4 pt-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">JSON Data Input</span>
            <textarea
              className="flex min-h-[160px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder='e.g.&#10;{&#10;  "name": "Toolkit",&#10;  "features": ["Speed", "Privacy"]&#10;}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
          </div>

          <button
            onClick={handleJsonToYaml}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert JSON to YAML
          </button>

          {yamlResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">YAML Result</span>
                <button
                  onClick={() => handleCopy(yamlResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[160px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none"
                value={yamlResult}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="yaml2json" className="space-y-4 pt-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">YAML Data Input</span>
            <textarea
              className="flex min-h-[160px] w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder='e.g.&#10;name: Toolkit&#10;features:&#10;  - Speed&#10;  - Privacy'
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
            />
          </div>

          <button
            onClick={handleYamlToJson}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Convert YAML to JSON
          </button>

          {jsonResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JSON Result</span>
                <button
                  onClick={() => handleCopy(jsonResult)}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[160px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none"
                value={jsonResult}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
