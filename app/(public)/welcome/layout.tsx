import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Join SportsOS — the premium platform for athletes and parents to find academies, explore sports, and compare options.',
  openGraph: {
    title: `Welcome · ${siteConfig.name}`,
    description: 'Join SportsOS — the premium platform for athletes and parents to find academies, explore sports, and compare options.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Welcome · ${siteConfig.name}`,
    description: 'Join SportsOS — the premium platform for athletes and parents to find academies, explore sports, and compare options.',
  },
};

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
