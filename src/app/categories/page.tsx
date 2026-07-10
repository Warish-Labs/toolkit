import Link from "next/link";
import { getAllCategories } from "@/src/data/categories";
import { getToolsByCategory } from "@/src/data/tools";
import { Card, CardContent } from "@/src/ui/shared/card";
import { Badge } from "@/src/ui/shared/badge";
import { getItemListSchema, getBreadcrumbSchema } from "@/src/lib/seo";
import { SITE_CONFIG } from "@/src/constants/site";
import { getIcon } from "@/src/lib/icons";

export const metadata = {
  title: "Categories",
  description: "Browse utility categories on Toolkit. Find developer utilities, calculators, and text tools.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  // SEO schema
  const itemListSchema = getItemListSchema(
    "All Categories",
    categories.map((c) => ({ name: c.name, url: `${SITE_CONFIG.url}/categories/${c.slug}` }))
  );

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: SITE_CONFIG.url },
    { name: "Categories", item: `${SITE_CONFIG.url}/categories` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-content py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse utilities grouped by functional category.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = getIcon(cat.icon);
            const categoryTools = getToolsByCategory(cat.slug);
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group focus-ring rounded-xl">
                <Card className="h-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10 bg-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${cat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary">{categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{cat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
