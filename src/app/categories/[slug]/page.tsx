import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getAllCategories } from "@/src/data/categories";
import { getToolsByCategory } from "@/src/data/tools";
import { Card, CardContent } from "@/src/ui/shared/card";
import { Badge } from "@/src/ui/shared/badge";
import { getBreadcrumbSchema, getItemListSchema } from "@/src/lib/seo";
import { SITE_CONFIG } from "@/src/constants/site";
import type { Metadata } from "next";
import { getIcon } from "@/src/lib/icons";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  const url = `${SITE_CONFIG.url}/categories/${category.slug}`;

  return {
    title: category.name,
    description: category.longDescription || category.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.name} | ${SITE_CONFIG.name}`,
      description: category.description,
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${SITE_CONFIG.name}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(slug);

  // SEO schemas
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: SITE_CONFIG.url },
    { name: "Categories", item: `${SITE_CONFIG.url}/categories` },
    { name: category.name, item: `${SITE_CONFIG.url}/categories/${category.slug}` },
  ]);

  const itemListSchema = getItemListSchema(
    `${category.name} Tools`,
    categoryTools.map((t) => ({ name: t.name, url: `${SITE_CONFIG.url}/tools/${t.slug}` }))
  );

  const categoryIcon = getIcon(category.icon);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-content py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between border-b border-border/40 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${category.color}`}>
                {React.createElement(categoryIcon, { className: "h-5 w-5" })}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{category.longDescription || category.description}</p>
          </div>
          <Badge variant="secondary" className="self-start md:self-center px-3 py-1">
            {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
          </Badge>
        </div>

        {/* Tools list */}
        {categoryTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => {
              const toolIcon = getIcon(tool.icon);
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group focus-ring rounded-xl">
                  <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="rounded-lg bg-muted p-2.5 shrink-0 text-foreground">
                        {React.createElement(toolIcon, { className: "h-5 w-5" })}
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
            <p className="text-muted-foreground text-sm">No tools implemented in this category yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
