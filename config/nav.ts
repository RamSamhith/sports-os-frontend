export interface NavItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export const primaryNav: NavItem[] = [
  { label: 'Discover', href: '/discover', description: 'Explore the sports ecosystem' },
  { label: 'Academies', href: '/academies', description: 'Find sports academies near you' },
  { label: 'Coaches', href: '/coaches', description: 'Discover verified coaches' },
  { label: 'Sports', href: '/sports', description: 'Explore sports and pathways' },
];

export const footerNav = {
  discover: [
    { label: 'Academies', href: '/academies' },
    { label: 'Coaches', href: '/coaches' },
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
