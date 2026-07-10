import type { Tool, FAQ } from "@/src/types";
import { SITE_CONFIG } from "@/src/constants/site";

export function getSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "description": SITE_CONFIG.description,
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.company.name,
      "url": SITE_CONFIG.company.url,
    },
  };
}

export function getToolSchema(tool: Tool) {
  const toolUrl = `${SITE_CONFIG.url}/tools/${tool.slug}`;

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": toolUrl,
      "name": tool.name,
      "url": toolUrl,
      "description": tool.description,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "creator": {
        "@type": "Organization",
        "name": SITE_CONFIG.company.name,
        "url": SITE_CONFIG.company.url,
      },
    },
  ];

  // Add Breadcrumb Schema
  schemas.push(
    getBreadcrumbSchema([
      { name: "Home", item: SITE_CONFIG.url },
      { name: "Tools", item: `${SITE_CONFIG.url}/tools` },
      { name: tool.name, item: toolUrl },
    ])
  );

  // Add FAQ Schema if present
  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push(getFAQSchema(tool.faqs));
  }

  return schemas;
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item,
    })),
  };
}

export function getFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function getItemListSchema(title: string, items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": item.url,
      "name": item.name,
    })),
  };
}
