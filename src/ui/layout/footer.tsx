import Link from "next/link";
import { Logo } from "./logo";
import { footerNav } from "@/src/data/nav";
import { getAllCategories } from "@/src/data/categories";
import { SITE_CONFIG } from "@/src/constants/site";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="container-content py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Logo variant="rounded" showWordmark width={28} height={28} />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-3 space-y-2">
              {footerNav.product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Categories</h3>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/categories"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2">
              {footerNav.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={SITE_CONFIG.company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {SITE_CONFIG.company.name}
            </a>
            . All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with privacy in mind — your data never leaves your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
