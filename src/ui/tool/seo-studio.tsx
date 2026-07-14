"use client";

import { useState } from "react";
import { generateRobotsTxt, generateSchemaJsonLd, type RobotsTxtConfig, type SchemaConfig } from "@/src/logic/seo-studio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function SeoStudioTool() {
  const [activeTab, setActiveTab] = useState("meta");

  // Meta States
  const [metaTitle, setMetaTitle] = useState("My Awesome Website Title");
  const [metaDesc, setMetaDesc] = useState("Discover incredible web tools and modern client-side utilities built for developers.");
  const [metaUrl, setMetaUrl] = useState("https://mywebsite.com");
  const [metaImage, setMetaImage] = useState("https://mywebsite.com/og-image.jpg");

  const metaHtml = `<!-- Primary Meta Tags -->\n<title>${metaTitle}</title>\n<meta name="title" content="${metaTitle}">\n<meta name="description" content="${metaDesc}">\n<link rel="canonical" href="${metaUrl}">\n\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website">\n<meta property="og:url" content="${metaUrl}">\n<meta property="og:title" content="${metaTitle}">\n<meta property="og:description" content="${metaDesc}">\n<meta property="og:image" content="${metaImage}">\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image">\n<meta property="twitter:url" content="${metaUrl}">\n<meta property="twitter:title" content="${metaTitle}">\n<meta property="twitter:description" content="${metaDesc}">\n<meta property="twitter:image" content="${metaImage}">`;

  // Robots.txt States
  const [robotsUa, setRobotsUa] = useState("*");
  const [robotsDisallow, setRobotsDisallow] = useState("/admin, /api");
  const [robotsSitemap, setRobotsSitemap] = useState("https://mywebsite.com/sitemap.xml");

  const robotsConfig: RobotsTxtConfig = {
    userAgent: robotsUa,
    allowPaths: ["/"],
    disallowPaths: robotsDisallow.split(',').map(p => p.trim()).filter(p => p),
    sitemapUrl: robotsSitemap
  };

  const robotsOutput = generateRobotsTxt(robotsConfig);

  // Schema States
  const [schemaType, setSchemaType] = useState<"Article" | "Organization" | "Product" | "LocalBusiness">("Article");
  const [schemaName, setSchemaName] = useState("Creative Agency Inc.");
  const [schemaDesc, setSchemaDesc] = useState("A professional creative agency specializing in modern brand identity.");
  const [schemaAddress, setSchemaAddress] = useState("123 Main St, New York");
  const [schemaSku, setSchemaSku] = useState("PROD-4001");

  const schemaConfig: SchemaConfig = {
    type: schemaType,
    name: schemaName,
    url: metaUrl,
    description: schemaDesc,
    address: schemaAddress,
    sku: schemaSku
  };

  const schemaOutput = generateSchemaJsonLd(schemaConfig);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meta">Meta Tag Preview</TabsTrigger>
          <TabsTrigger value="robots">Robots & Sitemap</TabsTrigger>
          <TabsTrigger value="schema">Schema Generator</TabsTrigger>
        </TabsList>

        {/* ── Meta Tags & Preview ── */}
        <TabsContent value="meta" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input controls */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="meta-title-input" className="text-xs font-semibold text-muted-foreground uppercase block">Page Title</label>
                <input id="meta-title-input" type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="meta-desc-input" className="text-xs font-semibold text-muted-foreground uppercase block">Meta Description</label>
                <textarea id="meta-desc-input" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="flex min-h-[70px] w-full rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-xs shadow-sm focus-visible:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="meta-url-input" className="text-xs font-semibold text-muted-foreground uppercase block">Canonical URL</label>
                <input id="meta-url-input" type="text" value={metaUrl} onChange={(e) => setMetaUrl(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
              </div>
            </div>

            {/* Google preview card */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase block">Google SERP Snippet Preview</span>
              <div className="border border-border/60 bg-card p-5 rounded-2xl space-y-1 text-left leading-relaxed">
                <span className="text-[10px] text-muted-foreground truncate block">{metaUrl}</span>
                <span className="text-[#1a0dab] dark:text-[#8ab4f8] text-sm font-semibold hover:underline cursor-pointer block leading-tight">{metaTitle}</span>
                <span className="text-xs text-[#4d5156] dark:text-[#bdc1c6] block pt-1">{metaDesc}</span>
              </div>
            </div>
          </div>

          {/* Code output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HTML Header Tags</span>
              <button onClick={() => handleCopy(metaHtml)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy Tags</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-[10px] font-mono leading-relaxed select-all overflow-x-auto whitespace-pre max-h-[250px]">
              {metaHtml}
            </pre>
          </div>
        </TabsContent>

        {/* ── Robots.txt & Sitemap ── */}
        <TabsContent value="robots" className="pt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3 items-end">
            <div className="space-y-1.5">
              <label htmlFor="robots-ua-input" className="text-xs font-semibold text-muted-foreground uppercase block">User Agent</label>
              <input id="robots-ua-input" type="text" value={robotsUa} onChange={(e) => setRobotsUa(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="robots-disallow-input" className="text-xs font-semibold text-muted-foreground uppercase block">Disallowed (comma separated)</label>
              <input id="robots-disallow-input" type="text" value={robotsDisallow} onChange={(e) => setRobotsDisallow(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="robots-sitemap-input" className="text-xs font-semibold text-muted-foreground uppercase block">Sitemap URL</label>
              <input id="robots-sitemap-input" type="text" value={robotsSitemap} onChange={(e) => setRobotsSitemap(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">robots.txt output</span>
              <button onClick={() => handleCopy(robotsOutput)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy Robots.txt</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {robotsOutput}
            </pre>
          </div>
        </TabsContent>

        {/* ── Schema Generator ── */}
        <TabsContent value="schema" className="pt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3 items-end">
            <div className="space-y-1.5">
              <label htmlFor="schema-type-select" className="text-xs font-semibold text-muted-foreground uppercase block">Schema Type</label>
              <select
                id="schema-type-select"
                value={schemaType}
                onChange={(e) => setSchemaType(e.target.value as any)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              >
                <option value="Article">Article</option>
                <option value="Organization">Organization</option>
                <option value="Product">Product</option>
                <option value="LocalBusiness">Local Business</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="schema-name-input" className="text-xs font-semibold text-muted-foreground uppercase block">Name / Headline</label>
              <input id="schema-name-input" type="text" value={schemaName} onChange={(e) => setSchemaName(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
            {schemaType === "LocalBusiness" && (
              <div className="space-y-1.5">
                <label htmlFor="schema-addr-input" className="text-xs font-semibold text-muted-foreground uppercase block">Street Address</label>
                <input id="schema-addr-input" type="text" value={schemaAddress} onChange={(e) => setSchemaAddress(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
              </div>
            )}
            {schemaType === "Product" && (
              <div className="space-y-1.5">
                <label htmlFor="schema-sku-input" className="text-xs font-semibold text-muted-foreground uppercase block">Product SKU</label>
                <input id="schema-sku-input" type="text" value={schemaSku} onChange={(e) => setSchemaSku(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JSON-LD Schema Tag</span>
              <button onClick={() => handleCopy(schemaOutput)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy Schema</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all overflow-x-auto whitespace-pre max-h-[300px]">
              {schemaOutput}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
