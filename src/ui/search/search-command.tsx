"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/src/ui/shared/command";
import { getAllTools } from "@/src/data/tools";
import { getAllCategories } from "@/src/data/categories";
import { SEARCH_FUSE_OPTIONS } from "@/src/constants/site";
import { FolderOpen, Loader2 } from "lucide-react";
import { getIcon } from "@/src/lib/icons";
import { useDebouncedValue } from "@/src/lib/use-debounced-value";

// ─── Unified searchable entry type ───────────────────────────────────────────
type SearchEntry =
  | {
      type: "tool";
      slug: string;
      name: string;
      description: string;
      keywords: string[];
      category: string;
      icon: string;
    }
  | {
      type: "category";
      slug: string;
      name: string;
      description: string;
      icon: string;
      toolCount: number;
    };

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Debounce the query — input stays instant, search fires after ~220 ms pause
  const debouncedQuery = useDebouncedValue(query, 220);
  const isPending = query !== debouncedQuery;

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      // Small delay so the closing animation finishes before clearing
      const t = setTimeout(() => setQuery(""), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ─── Data ────────────────────────────────────────────────────────────────
  const tools = useMemo(() => getAllTools(), []);
  const categories = useMemo(() => getAllCategories(), []);

  // Tool count per category — computed once
  const toolCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tools) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    return counts;
  }, [tools]);

  // Build ONE combined Fuse index — rebuilt only when data changes (never per keystroke)
  const combinedEntries = useMemo<SearchEntry[]>(() => {
    const toolEntries: SearchEntry[] = tools.map((t) => ({
      type: "tool",
      slug: t.slug,
      name: t.name,
      description: t.description,
      keywords: t.keywords ?? [],
      category: t.category,
      icon: t.icon,
    }));
    const catEntries: SearchEntry[] = categories.map((c) => ({
      type: "category",
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      toolCount: toolCountByCategory[c.slug] ?? 0,
    }));
    return [...toolEntries, ...catEntries];
  }, [tools, categories, toolCountByCategory]);

  const fuse = useMemo(
    () =>
      new Fuse<SearchEntry>(combinedEntries, {
        ...(SEARCH_FUSE_OPTIONS as unknown as IFuseOptions<SearchEntry>),
        keys: [
          { name: "name",        weight: 0.60 },
          { name: "keywords",    weight: 0.25 },
          { name: "description", weight: 0.15 },
        ],
      }),
    [combinedEntries]
  );

  // ─── Search — only fires on debouncedQuery changes ───────────────────────
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return { tools: [], categories: [] };
    const all = fuse.search(debouncedQuery, { limit: 10 });
    return {
      tools:      all.filter((r) => r.item.type === "tool"),
      categories: all.filter((r) => r.item.type === "category"),
    };
  }, [fuse, debouncedQuery]);

  const hasResults = results.tools.length > 0 || results.categories.length > 0;

  // ─── ⌘K / Ctrl+K global shortcut ─────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = useCallback(
    (href: string) => {
      onOpenChange(false);
      setQuery("");
      router.push(href);
    },
    [router, onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Search tools and categories…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim() === "" ? (
          /* ── Empty-query browse state (unchanged) ── */
          <>
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => handleSelect("/tools")}>
                <span>All Tools</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/categories")}>
                <span>All Categories</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Categories">
              {categories.map((cat) => {
                const Icon = getIcon(cat.icon);
                return (
                  <CommandItem
                    key={cat.slug}
                    onSelect={() => handleSelect(`/categories/${cat.slug}`)}
                  >
                    <Icon className="mr-2 h-4 w-4 shrink-0" />
                    <span>{cat.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : (
          /* ── Active-query results state ── */
          <>
            {/* Pending indicator — shown while debounce hasn't fired yet */}
            {isPending && (
              <div className="flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground border-b border-border/40">
                <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                <span>Searching…</span>
              </div>
            )}

            {/* Tools group */}
            {results.tools.length > 0 && (
              <CommandGroup heading="Tools">
                {results.tools.map(({ item }) => {
                  if (item.type !== "tool") return null;
                  const Icon = getIcon(item.icon);
                  return (
                    <CommandItem
                      key={item.slug}
                      onSelect={() => handleSelect(`/tools/${item.slug}`)}
                    >
                      <Icon className="mr-2 h-4 w-4 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{item.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Categories group */}
            {results.categories.length > 0 && (
              <>
                {results.tools.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Categories">
                  {results.categories.map(({ item }) => {
                    if (item.type !== "category") return null;
                    const Icon = getIcon(item.icon);
                    return (
                      <CommandItem
                        key={item.slug}
                        onSelect={() => handleSelect(`/categories/${item.slug}`)}
                      >
                        <Icon className="mr-2 h-4 w-4 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{item.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.toolCount} tool{item.toolCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}

            {/* No results — only shown when debounce settled and nothing matched */}
            {!isPending && !hasResults && (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-4">
                  <p className="text-sm text-muted-foreground">
                    No results for &ldquo;{debouncedQuery}&rdquo;
                  </p>
                  <button
                    onClick={() => handleSelect("/categories")}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Browse categories
                  </button>
                </div>
              </CommandEmpty>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
