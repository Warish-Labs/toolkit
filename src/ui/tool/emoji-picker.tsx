"use client";

import { useState } from "react";
import { getEmojiGroups, searchEmojis } from "@/src/logic/emoji-picker";

export function EmojiPickerTool() {
  const [searchQuery, setSearchQuery] = useState("");
  const emojiGroups = getEmojiGroups();
  const searchResults = searchEmojis(searchQuery);

  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const handleCopy = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopiedEmoji(char);
    setTimeout(() => setCopiedEmoji(null), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search emojis by name or keywords (e.g. smile, fruit, hot)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
        />
      </div>

      {searchQuery.trim() !== "" ? (
        <div className="space-y-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Results ({searchResults.length})</span>
          <div className="grid gap-3 grid-cols-4 sm:grid-cols-8 md:grid-cols-10">
            {searchResults.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleCopy(emoji.char)}
                className="flex flex-col items-center justify-center p-3 border rounded-xl bg-card hover:bg-muted/40 transition-colors gap-1.5"
                title={emoji.name}
              >
                <span className="text-2xl">{emoji.char}</span>
                <span className="text-[9px] text-muted-foreground truncate max-w-full">{emoji.name}</span>
              </button>
            ))}
            {searchResults.length === 0 && (
              <p className="col-span-full text-center text-xs text-muted-foreground py-4">No matching emojis found.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {emojiGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block border-b border-border/40 pb-1.5">{group.category}</span>
              <div className="grid gap-3 grid-cols-4 sm:grid-cols-8 md:grid-cols-10">
                {group.emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopy(emoji.char)}
                    className="flex flex-col items-center justify-center p-3 border rounded-xl bg-card hover:bg-muted/40 transition-colors gap-1.5"
                    title={emoji.name}
                  >
                    <span className="text-2xl">{emoji.char}</span>
                    <span className="text-[9px] text-muted-foreground truncate max-w-full">{emoji.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {copiedEmoji && (
        <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-primary/20 animate-fade-in flex items-center gap-2">
          <span className="text-lg">{copiedEmoji}</span> Copied to clipboard!
        </div>
      )}
    </div>
  );
}
