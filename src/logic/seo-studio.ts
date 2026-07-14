// SEO & Schema Templates Generator

export interface RobotsTxtConfig {
  userAgent: string;
  allowPaths: string[];
  disallowPaths: string[];
  sitemapUrl: string;
}

export function generateRobotsTxt(config: RobotsTxtConfig): string {
  const lines: string[] = [];
  lines.push(`User-agent: ${config.userAgent || '*'}`);

  config.allowPaths.forEach(p => {
    if (p.trim()) lines.push(`Allow: ${p.trim()}`);
  });

  config.disallowPaths.forEach(p => {
    if (p.trim()) lines.push(`Disallow: ${p.trim()}`);
  });

  if (config.sitemapUrl.trim()) {
    lines.push(`Sitemap: ${config.sitemapUrl.trim()}`);
  }

  return lines.join('\n');
}

export interface SchemaConfig {
  type: 'Article' | 'Organization' | 'Product' | 'LocalBusiness';
  name: string;
  url: string;
  description: string;
  image?: string;
  // Extra variables for LocalBusiness/Product
  address?: string;
  priceRange?: string;
  sku?: string;
}

export function generateSchemaJsonLd(config: SchemaConfig): string {
  const base: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': config.type,
    name: config.name,
    url: config.url,
    description: config.description
  };

  if (config.image) {
    base.image = config.image;
  }

  if (config.type === 'LocalBusiness') {
    base.address = {
      '@type': 'PostalAddress',
      streetAddress: config.address || ''
    };
    base.priceRange = config.priceRange || '$$';
  } else if (config.type === 'Product') {
    base.sku = config.sku || '';
    base.offers = {
      '@type': 'Offer',
      url: config.url,
      priceCurrency: 'USD',
      price: '19.99',
      availability: 'https://schema.org/InStock'
    };
  }

  return `<script type="application/ld+json">\n${JSON.stringify(base, null, 2)}\n</script>`;
}
