import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { themeConfig } from '@/config/theme';
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
import { OfflineProvider } from '@/components/providers/offline-provider';
import { CommandPaletteProvider } from '@/components/command/command-palette-provider';
import { Atmosphere } from '@/components/theme/atmosphere';
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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#070B14' },
    { media: '(prefers-color-scheme: light)', color: '#F7F8FA' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Pre-hydration script — sets the theme class on <html> *before* first paint.
 * Reads the value from localStorage, falls back to the OS preference, and
 * finally to the default theme. Inline + synchronous, so it blocks paint
 * by a few microseconds and eliminates the flash of incorrect theme.
 */
const themeBootstrap = `
(function () {
  try {
    var storageKey = ${JSON.stringify(themeConfig.storageKey)};
    var themes = ${JSON.stringify(themeConfig.themes)};
    var defaultTheme = ${JSON.stringify(themeConfig.defaultTheme)};
    var stored = localStorage.getItem(storageKey);
    var resolved = stored;
    if (!resolved || (resolved !== 'system' && themes.indexOf(resolved) === -1)) {
      resolved = defaultTheme;
    }
    if (resolved === 'system') {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = prefersDark ? 'midnight-ice' : 'alpine-light';
    }
    var root = document.documentElement;
    var classes = root.classList;
    for (var i = classes.length - 1; i >= 0; i--) {
      var c = classes[i];
      if (themes.indexOf(c) !== -1 || c === 'system') classes.remove(c);
    }
    classes.add(resolved);
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = 'dark';
  } catch (e) {
    document.documentElement.classList.add(${JSON.stringify(themeConfig.defaultTheme)});
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body className={`${inter.variable} ${geistDisplay.variable} ${geistMono.variable} font-sans`}>
        {/* Dynamic, per-theme atmospheric background. Three layered
            divs — each theme gives them distinct motion (ice drift,
            gold sweep, stadium glow, mist fog). */}
        <Atmosphere />
        <ThemeProvider>
          <OfflineProvider>
            <CommandPaletteProvider>
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
            </CommandPaletteProvider>
          </OfflineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
