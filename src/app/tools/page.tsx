"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getAllTools } from "@/src/data/tools";
import { getAllCategories } from "@/src/data/categories";
import { Card, CardContent } from "@/src/ui/shared/card";
import { Badge } from "@/src/ui/shared/badge";
import { Input } from "@/src/ui/shared/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { getItemListSchema } from "@/src/lib/seo";
import { SITE_CONFIG } from "@/src/constants/site";
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { getIcon } from "@/src/lib/icons";

// Helper component to highlight matched search terms
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  // Escape regex special characters
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-foreground font-semibold rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function ToolsHubContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allTools = useMemo(() => getAllTools(), []);
  const categories = useMemo(() => getAllCategories(), []);

  // Sync state with URL Search Parameters
  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("c") || "all";
  const urlSort = searchParams.get("s") || "featured";
  const urlPage = parseInt(searchParams.get("p") || "1", 10);

  // Local inputs state
  const [searchVal, setSearchVal] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);

  // Debounce search query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchVal);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchVal]);

  // Sync local states when URL changes (e.g. forward/back buttons or chip clicks)
  useEffect(() => {
    setSearchVal(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [urlQuery]);

  // General URL state updater
  const updateParams = (updates: { q?: string; c?: string; s?: string; p?: number }) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (updates.q !== undefined) {
      if (updates.q) nextParams.set("q", updates.q);
      else nextParams.delete("q");
    }
    if (updates.c !== undefined) {
      if (updates.c !== "all") nextParams.set("c", updates.c);
      else nextParams.delete("c");
    }
    if (updates.s !== undefined) {
      if (updates.s !== "featured") nextParams.set("s", updates.s);
      else nextParams.delete("s");
    }
    if (updates.p !== undefined) {
      if (updates.p > 1) nextParams.set("p", updates.p.toString());
      else nextParams.delete("p");
    }

    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (catSlug: string) => {
    updateParams({ c: catSlug, p: 1 });
  };

  const handleSortChange = (sortOption: string) => {
    updateParams({ s: sortOption, p: 1 });
  };

  const handlePageChange = (pageNum: number) => {
    updateParams({ p: pageNum });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    const nextParams = new URLSearchParams();
    router.replace(pathname, { scroll: false });
  };

  // Filter & Rank Tools
  const processedTools = useMemo(() => {
    let result = [...allTools];

    // 1. Filter by category
    if (urlCategory !== "all") {
      result = result.filter((t) => t.category === urlCategory);
    }

    // 2. Filter by search query
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter((t) => {
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.keywords && t.keywords.some((k) => k.toLowerCase().includes(q))) ||
          (t.tags && t.tags.some((tg) => tg.toLowerCase().includes(q)))
        );
      });

      // Prioritize exact/starts-with title matches first
      result.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aExact = aName === q;
        const bExact = bName === q;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts = aName.startsWith(q);
        const bStarts = bName.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        const aContains = aName.includes(q);
        const bContains = bName.includes(q);
        if (aContains && !bContains) return -1;
        if (!aContains && bContains) return 1;

        return 0;
      });
    } else {
      // Apply standard sorting options if not searching
      if (urlSort === "featured") {
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      } else if (urlSort === "newest") {
        result.sort((a, b) => new Date(b.dateAdded || "").getTime() - new Date(a.dateAdded || "").getTime());
      } else if (urlSort === "oldest") {
        result.sort((a, b) => new Date(a.dateAdded || "").getTime() - new Date(b.dateAdded || "").getTime());
      } else if (urlSort === "az") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (urlSort === "za") {
        result.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    return result;
  }, [allTools, urlCategory, debouncedQuery, urlSort]);

  // Pagination parameters
  const itemsPerPage = 12;
  const totalItems = processedTools.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Make sure page doesn't exceed total page bounds
  const activePage = Math.min(urlPage, totalPages);

  const paginatedTools = useMemo(() => {
    const startIdx = (activePage - 1) * itemsPerPage;
    return processedTools.slice(startIdx, startIdx + itemsPerPage);
  }, [processedTools, activePage, itemsPerPage]);

  // Generate dynamic sitemap schema
  const itemListSchema = getItemListSchema(
    "All Tools",
    processedTools.map((t) => ({ name: t.name, url: `${SITE_CONFIG.url}/tools/${t.slug}` }))
  );

  const hasActiveFilters = debouncedQuery !== "" || urlCategory !== "all" || urlSort !== "featured" || urlPage > 1;

  // Build pagination buttons array (smart sliding windows)
  const paginationRange = useMemo(() => {
    const range = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      let start = Math.max(1, activePage - 2);
      let end = Math.min(totalPages, activePage + 2);
      if (start === 1) {
        end = maxVisible;
      } else if (end === totalPages) {
        start = totalPages - maxVisible + 1;
      }
      for (let i = start; i <= end; i++) range.push(i);
    }
    return range;
  }, [totalPages, activePage]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-content py-12 space-y-8">
        {/* Header Title */}
        <div className="space-y-2">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs text-primary gap-1">
            <Sparkles className="h-3 w-3" />
            Toolkit Sandbox
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">All Tools</h1>
          <p className="text-sm text-muted-foreground">
            Explore our curated, local utility toolbox. Clean formatting, math projections, and offline scripts running entirely in your browser.
          </p>
        </div>
        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 border border-border/40 p-4 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4 flex-1 items-start lg:items-center">
            {/* Search input with live text state */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools by title, keywords, or tags..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  updateParams({ q: e.target.value, p: 1 });
                }}
                className="pl-9 text-xs w-full bg-background"
              />
              {searchVal && (
                <button
                  onClick={() => {
                    setSearchVal("");
                    updateParams({ q: "", p: 1 });
                  }}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
 
            {/* Category Select Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Category:</span>
              <Select value={urlCategory} onValueChange={(val) => handleCategoryChange(val || "all")}>
                <SelectTrigger className="w-full sm:w-[200px] text-xs bg-background">
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
 
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Sort By:</span>
              <Select value={urlSort} onValueChange={(val) => { if (val) handleSortChange(val); }}>
                <SelectTrigger className="w-full sm:w-[150px] text-xs bg-background">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="newest">Newest Added</SelectItem>
                  <SelectItem value="oldest">Oldest Added</SelectItem>
                  <SelectItem value="az">A–Z Alphabetical</SelectItem>
                  <SelectItem value="za">Z–A Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
 
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 justify-center py-2 shrink-0"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Results Header Info */}
        <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2">
          {debouncedQuery.trim() ? (
            <p>
              Showing <span className="font-semibold text-foreground">{totalItems}</span> results for &quot;
              <span className="font-semibold text-foreground">{debouncedQuery}</span>&quot;
              {urlCategory !== "all" && (
                <>
                  {" "}
                  in <span className="font-semibold text-foreground">{categories.find((c) => c.slug === urlCategory)?.name}</span>
                </>
              )}
            </p>
          ) : (
            <p>
              Showing <span className="font-semibold text-foreground">{Math.min(totalItems, itemsPerPage * activePage)}</span> of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> tools
              {urlCategory !== "all" && (
                <>
                  {" "}
                  in <span className="font-semibold text-foreground">{categories.find((c) => c.slug === urlCategory)?.name}</span>
                </>
              )}
            </p>
          )}
        </div>

        {/* Tools Grid */}
        {paginatedTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedTools.map((tool) => {
              const Icon = getIcon(tool.icon);
              const toolCat = categories.find((c) => c.slug === tool.category);
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group focus-ring rounded-xl">
                  <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="rounded-lg bg-muted p-2.5 shrink-0 text-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                            <Highlight text={tool.name} query={debouncedQuery} />
                          </h3>
                          {tool.isNew && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.1 bg-primary/5 text-primary border-primary/10 shrink-0">New</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          <Highlight text={tool.description} query={debouncedQuery} />
                        </p>
                        <div className="pt-1">
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0.2 text-muted-foreground border-border/60 bg-muted/10">
                            {toolCat?.name || tool.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl space-y-3 bg-muted/5">
            <p className="text-muted-foreground text-sm font-medium">No tools matches your criteria.</p>
            <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
              We couldn&apos;t find any tools matching your filters. Try checking your spelling or clearing active search keywords.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-xs font-semibold hover:bg-secondary/80 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 pt-6">
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium bg-background hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="hidden sm:flex gap-1">
              {paginationRange.map((pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => handlePageChange(pageIdx)}
                  className={`h-8 w-8 text-xs font-medium rounded-lg transition-colors ${
                    activePage === pageIdx
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background hover:bg-muted"
                  }`}
                >
                  {pageIdx}
                </button>
              ))}
            </div>

            <div className="sm:hidden text-xs text-muted-foreground">
              Page {activePage} of {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium bg-background hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function ToolsHubPage() {
  return (
    <Suspense fallback={<div className="container-content py-20 text-center text-xs text-muted-foreground">Loading tools ledger...</div>}>
      <ToolsHubContent />
    </Suspense>
  );
}
