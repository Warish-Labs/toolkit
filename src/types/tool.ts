export type ExecutionType = "client" | "server";

export interface Tool {
  /** Display name */
  name: string;
  /** URL-safe slug — also the registry key */
  slug: string;
  /** One-line description for cards and meta */
  description: string;
  /** Longer description for SEO and tool page */
  longDescription?: string;
  /** Category slug this tool belongs to */
  category: string;
  /** Searchable tags */
  tags: string[];
  /** SEO keywords */
  keywords: string[];
  /** Lucide icon name */
  icon: string;
  /** Where the tool logic runs (Phase 1 = all client) */
  executionType: ExecutionType;
  /** Whether this tool is featured on the homepage */
  isFeatured?: boolean;
  /** Whether this tool is new (show badge) */
  isNew?: boolean;
  /** Date added (ISO string) */
  dateAdded: string;
  /** FAQ entries for schema & page */
  faqs?: FAQ[];
  /** How-to-use steps */
  howToUse?: string[];
  /** Related tool slugs */
  relatedTools?: string[];
}

export interface Category {
  /** Display name */
  name: string;
  /** URL-safe slug */
  slug: string;
  /** One-line description */
  description: string;
  /** Longer description for SEO */
  longDescription?: string;
  /** Lucide icon */
  icon: string;
  /** Display color (Tailwind class) */
  color: string;
  /** Sort order */
  order: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}
