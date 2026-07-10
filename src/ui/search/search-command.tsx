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
import { FolderOpen } from "lucide-react";
import type { Tool } from "@/src/types";
import { getIcon } from "@/src/lib/icons";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const tools = useMemo(() => getAllTools(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const fuse = useMemo(() => new Fuse(tools, SEARCH_FUSE_OPTIONS as unknown as IFuseOptions<Tool>), [tools]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 8 });
  }, [fuse, query]);

  // ⌘K / Ctrl+K global shortcut
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
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim() === "" ? (
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
        ) : results.length > 0 ? (
          <CommandGroup heading="Tools">
            {results.map(({ item }) => {
              const Icon = getIcon(item.icon);
              return (
                <CommandItem
                  key={item.slug}
                  onSelect={() => handleSelect(`/tools/${item.slug}`)}
                >
                  <Icon className="mr-2 h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ) : (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm text-muted-foreground">
                No tools found for &ldquo;{query}&rdquo;
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
      </CommandList>
    </CommandDialog>
  );
}
