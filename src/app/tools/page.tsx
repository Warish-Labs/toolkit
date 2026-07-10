"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { getAllTools } from "@/src/data/tools";
import { getAllCategories } from "@/src/data/categories";
import { Card, CardContent } from "@/src/ui/shared/card";
import { Badge } from "@/src/ui/shared/badge";
import { Input } from "@/src/ui/shared/input";
import { getItemListSchema } from "@/src/lib/seo";
import { SITE_CONFIG } from "@/src/constants/site";
import { Search } from "lucide-react";
import { getIcon } from "@/src/lib/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";

export default function ToolsHubPage() {
  const allTools = useMemo(() => getAllTools(), []);
  const categories = useMemo(() => getAllCategories(), []);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesQuery =
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [allTools, selectedCategory, query]);

  // Generate ItemList JSON-LD Schema
  const itemListSchema = getItemListSchema(
    "All Tools",
    filteredTools.map((t) => ({ name: t.name, url: `${SITE_CONFIG.url}/tools/${t.slug}` }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-content py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tools</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse, filter, and search across our entire suite of local web utilities.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Tools list */}
        {filteredTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const Icon = getIcon(tool.icon);
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group focus-ring rounded-xl">
                  <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="rounded-lg bg-muted p-2.5 shrink-0 text-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {tool.name}
                          {tool.isNew && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.2">New</Badge>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No tools found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}
