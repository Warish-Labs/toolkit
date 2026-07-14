"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Copy, Download, Share2, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/src/ui/shared/button";
import { Badge } from "@/src/ui/shared/badge";
import { Card, CardContent } from "@/src/ui/shared/card";
import { Separator } from "@/src/ui/shared/separator";
import type { Tool } from "@/src/types";
import { getCategoryBySlug } from "@/src/data/categories";
import { getToolBySlug } from "@/src/data/tools";

import { getIcon } from "@/src/lib/icons";

interface ToolLayoutProps {
  tool: Tool;
  children: ReactNode;
  output?: string;
}

export function ToolLayout({ tool, children, output }: ToolLayoutProps) {
  const category = getCategoryBySlug(tool.category);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: tool.name,
        text: tool.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const relatedTools = (tool.relatedTools ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean) as Tool[];

  return (
    <div className="container-content py-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link href={`/categories/${category.slug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-foreground font-medium">{tool.name}</span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{tool.h1 || tool.name}</h1>
        <p className="mt-2 text-muted-foreground text-lg leading-relaxed">{tool.intro || tool.description}</p>
      </div>

      <Separator />

      {/* Tool Component */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>

      {/* Actions */}
      {output !== undefined && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1.5 h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      )}

      <Separator />

      {/* Privacy note */}
      {tool.executionType === "client" && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 shrink-0 text-green-500" />
          <span>Processed locally in your browser — nothing is uploaded.</span>
        </div>
      )}

      {/* How to use */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">How to Use</h2>
          <ol className="mt-3 space-y-2 list-decimal list-inside text-muted-foreground">
            {tool.howToUse.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {/* FAQ */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-3 space-y-4">
            {tool.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">Related Tools</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((rt) => {
              const Icon = getIcon(rt.icon);
              return (
                <Link key={rt.slug} href={`/tools/${rt.slug}`}>
                  <Card className="group border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{rt.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{rt.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Category link */}
      {category && (
        <div className="pt-2">
          <Link
            href={`/categories/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Badge variant="secondary">{category.name}</Badge>
            <span>View all tools in this category</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
