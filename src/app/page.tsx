"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchCommand } from "@/src/ui/search/search-command";
import { getFeaturedTools, getNewTools, getAllTools } from "@/src/data/tools";
import { getAllCategories } from "@/src/data/categories";
import { homepageFaqs } from "@/src/data/faq";
import { getSiteSchema, getFAQSchema } from "@/src/lib/seo";
import { Card, CardContent } from "@/src/ui/shared/card";
import { Badge } from "@/src/ui/shared/badge";
import { Search, Shield, Zap, Sparkles, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { getIcon } from "@/src/lib/icons";
import { PageNetworkBackground } from "@/src/ui/layout/hero-network-background";

const HOME_CARD_LIMIT = 9;

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const categories = getAllCategories();
  const featuredTools = getFeaturedTools();
  const newTools = getNewTools();
  const allTools = getAllTools();

  // JSON-LD scripts
  const siteSchema = getSiteSchema();
  const faqSchema = getFAQSchema(homepageFaqs);

  // Limit cards to 9
  const visibleFeatured = featuredTools.slice(0, HOME_CARD_LIMIT);
  const visibleNew = newTools.slice(0, HOME_CARD_LIMIT);
  const visibleCategories = categories.slice(0, HOME_CARD_LIMIT);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      {/* Full-page animated node-network canvas — theme-aware */}
      <PageNetworkBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          {/* Dot-grid overlay */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="relative z-10 container-content text-center space-y-6 max-w-3xl">
            <Badge variant="outline" className="animate-fade-in border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary gap-1">
              <Sparkles className="h-3 w-3" />
              100% Client-Side &amp; Private
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Toolkit
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Fast, private, browser-first utility platform. No logs, no server uploads — everything runs entirely on your device.
            </p>

            {/* Hero Search Trigger */}
            <div className="pt-4 max-w-lg mx-auto">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center w-full gap-3 px-4 py-3 rounded-xl border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all text-left shadow-sm focus-ring"
              >
                <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm">Search across all tools...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Featured Categories */}
        <section className="py-12 border-t border-border/40 bg-muted/5 backdrop-blur-sm">
          <div className="container-content space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
                <p className="text-sm text-muted-foreground mt-1">Organized utility sets for developers, writers, and daily tasks.</p>
              </div>
              <Link href="/categories" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                All Categories <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCategories.map((cat) => {
                const Icon = getIcon(cat.icon);
                return (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group focus-ring rounded-xl">
                    <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6 space-y-4">
                        <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${cat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{cat.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {categories.length > HOME_CARD_LIMIT && (
              <div className="flex justify-center pt-2">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card/80 backdrop-blur-sm text-sm font-semibold text-foreground hover:bg-muted hover:border-foreground/20 transition-all"
                >
                  View All {categories.length} Categories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3. Popular Tools Grid */}
        <section className="py-16 backdrop-blur-sm">
          <div className="container-content space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Popular Tools</h2>
                <p className="text-sm text-muted-foreground mt-1">Most frequently used utilities running entirely on your machine.</p>
              </div>
              <Link href="/tools" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                View All Tools <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFeatured.map((tool) => {
                const Icon = getIcon(tool.icon);
                return (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group focus-ring rounded-xl">
                    <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card/80 backdrop-blur-sm">
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

            {featuredTools.length > HOME_CARD_LIMIT && (
              <div className="flex justify-center pt-2">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card/80 backdrop-blur-sm text-sm font-semibold text-foreground hover:bg-muted hover:border-foreground/20 transition-all"
                >
                  View All {featuredTools.length} Popular Tools <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 4. Newly Added Tools */}
        <section className="py-12 border-t border-border/40 bg-muted/5 backdrop-blur-sm">
          <div className="container-content space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Newly Added</h2>
                <p className="text-sm text-muted-foreground mt-1">Fresh tools added to the catalog recently.</p>
              </div>
              <Link href="/tools" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleNew.map((tool) => {
                const Icon = getIcon(tool.icon);
                return (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group focus-ring rounded-xl">
                    <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="rounded-lg bg-muted p-2.5 shrink-0 text-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {tool.name}
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.2 bg-primary/5 text-primary border-primary/10">New</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {newTools.length > HOME_CARD_LIMIT && (
              <div className="flex justify-center pt-2">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card/80 backdrop-blur-sm text-sm font-semibold text-foreground hover:bg-muted hover:border-foreground/20 transition-all"
                >
                  View All {newTools.length} New Tools <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 5. Privacy Callout */}
        <section className="py-16 bg-card/60 backdrop-blur-sm border-t border-b border-border/60">
          <div className="container-content max-w-4xl flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                <ShieldCheck className="h-5 w-5" />
                <span>Privacy-First Architecture</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Your data never leaves your computer.</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Toolkit is built using standard client-side JavaScript APIs. We do not transmit, analyze, or store any of your inputs on servers. It is all computed locally on your device, making it 100% private, secure, and compliant.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
              <div className="p-4 border border-border/60 rounded-xl text-center space-y-1 bg-card/80 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-yellow-500 mx-auto" />
                <span className="block text-xs font-semibold text-foreground">Instant Speed</span>
              </div>
              <div className="p-4 border border-border/60 rounded-xl text-center space-y-1 bg-card/80 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-blue-500 mx-auto" />
                <span className="block text-xs font-semibold text-foreground">100% Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Stats Strip */}
        <section className="py-10 border-b border-border/40 bg-muted/5 backdrop-blur-sm">
          <div className="container-content max-w-4xl">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-extrabold text-foreground">{allTools.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Live Tools</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Categories</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground">
                  <ShieldCheck className="h-7 w-7 inline-block text-primary" />
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">100% Private</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section className="py-16 backdrop-blur-sm">
          <div className="container-content max-w-3xl space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-sm text-muted-foreground mt-2">Have questions about how Toolkit works? We have answers.</p>
            </div>

            <div className="grid gap-6">
              {homepageFaqs.map((faq, i) => (
                <div key={i} className="space-y-1.5 p-5 border border-border/60 rounded-xl bg-card/80 backdrop-blur-sm">
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
