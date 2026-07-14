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
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-WWDB0JP071',
};

export const READING_SPEED_WPM = 200;
export const SEARCH_DEBOUNCE_MS = 220;
export const SEARCH_FUSE_OPTIONS = {
  keys: [
    { name: 'name',        weight: 0.60 },
    { name: 'keywords',    weight: 0.25 },
    { name: 'description', weight: 0.15 },
  ],
  threshold: 0.42,       // 0 = exact-only, 1 = match anything; 0.42 is forgiving but still relevant
  distance: 200,          // how far into the string a match can be
  ignoreLocation: true,   // don't penalise matches deep in the string
  minMatchCharLength: 2,
  includeScore: true,
} as const;

