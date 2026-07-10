"use client";

import { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { SearchCommand } from "@/src/ui/search/search-command";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
