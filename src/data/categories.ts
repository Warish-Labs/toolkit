import type { Category } from '@/src/types';

export const categories: Category[] = [
  {
    name: 'Calculators',
    slug: 'calculators',
    description: 'Quick, accurate calculators for everyday math and finance.',
    longDescription: 'A collection of powerful calculators designed to help you with everyday calculations. From age and BMI to percentage computations, these tools run entirely in your browser for instant results.',
    icon: 'calculator',
    color: 'text-blue-500',
    order: 1,
  },
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Essential utilities for developers — format, encode, generate, and debug.',
    longDescription: 'A curated set of developer utilities for common tasks like JSON formatting, Base64 encoding, UUID generation, and hash computation. All processing happens locally in your browser — your code never leaves your machine.',
    icon: 'code',
    color: 'text-emerald-500',
    order: 2,
  },
  {
    name: 'Text Tools',
    slug: 'text-tools',
    description: 'Analyze, transform, and format text instantly.',
    longDescription: 'Transform and analyze text with ease. Count words and characters, convert text case, and more — all processed locally in your browser for maximum privacy.',
    icon: 'type',
    color: 'text-violet-500',
    order: 3,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategories(): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}
