import type { NavItem } from '@/src/types';

export const mainNav: NavItem[] = [
  { label: 'Tools', href: '/tools' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
];

export const footerNav = {
  product: [
    { label: 'All Tools', href: '/tools' },
    { label: 'Categories', href: '/categories' },
    { label: 'About', href: '/about' },
  ] as NavItem[],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ] as NavItem[],
  company: [
    { label: 'WarishLabs', href: 'https://warishlabs.in', external: true },
    { label: 'Contact', href: 'https://warishlabs.in/contact', external: true },
  ] as NavItem[],
};
