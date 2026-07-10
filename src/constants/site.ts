export const SITE_CONFIG = {
  name: 'Toolkit',
  tagline: 'by WarishLabs',
  description: 'A fast, private, browser-first utility platform. Free online tools that run entirely in your browser — your data never leaves your device.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.warishlabs.in',
  company: {
    name: 'WarishLabs',
    url: 'https://warishlabs.in',
    contactUrl: 'https://warishlabs.in/contact',
  },
  social: {
    twitter: '@warishlabs',
  },
};

export const READING_SPEED_WPM = 200;
export const SEARCH_DEBOUNCE_MS = 150;
export const SEARCH_FUSE_OPTIONS = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 },
    { name: 'keywords', weight: 0.1 },
  ],
  threshold: 0.3,
  includeMatches: true,
  minMatchCharLength: 2,
} as const;
