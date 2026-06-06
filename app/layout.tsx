import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LocationProvider } from '@/components/providers/location-provider';
import { ShortlistProvider } from '@/components/providers/shortlist-provider';
import { CompareProvider } from '@/components/providers/compare-provider';
import { AnalyticsProvider } from '@/components/providers/analytics-provider';
import { ConsentBanner } from '@/components/providers/consent-banner';
import { WebVitalsReporter } from '@/lib/monitoring/web-vitals';
import { Toaster } from '@/components/ui/toaster';
import { MotionConfigProvider } from '@/components/motion/motion-config';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistDisplay = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  keywords: [
    'sports',
    'academies',
    'coaches',
    'India',
    'sports discovery',
    'athlete development',
  ],
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
  },
  twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistDisplay.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider>
          <MotionConfigProvider>
            <AuthProvider>
              <LocationProvider>
                <ShortlistProvider>
                  <CompareProvider>
                    <AnalyticsProvider>
                      {children}
                      <ConsentBanner />
                      <Toaster />
                      <WebVitalsReporter />
                    </AnalyticsProvider>
                  </CompareProvider>
                </ShortlistProvider>
              </LocationProvider>
            </AuthProvider>
          </MotionConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
