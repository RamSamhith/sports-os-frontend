export interface NavItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/', description: 'Back to homepage' },
  { label: 'Academies', href: '/academies', description: 'Find sports academies near you' },
  { label: 'Sports', href: '/sports', description: 'Explore sports and pathways' },
];

export const footerNav = {
  discover: [
    { label: 'Academies', href: '/academies' },
    { label: 'Sports', href: '/sports' },
    { label: 'Compare', href: '/compare' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Trust', href: '/trust' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ],
} as const;
