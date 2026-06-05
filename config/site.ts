export const siteConfig = {
  name: 'SportsOS',
  tagline: "India's Sports Discovery Ecosystem",
  description:
    'Discover, compare, evaluate, and shortlist sports academies, coaches, and pathways across India.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sportsos.example.com',
  locale: 'en_IN',
  twitter: '@sportsos',
  organization: {
    name: 'SportsOS',
    logo: '/icons/logo.svg',
    sameAs: [],
  },
} as const;

export type SiteConfig = typeof siteConfig;
