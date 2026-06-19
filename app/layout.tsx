import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { themeConfig } from '@/config/theme';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeSync } from '@/components/theme/theme-sync';
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
import { VersionCheck } from '@/components/providers/version-check';
import { ServiceWorkerRegistration } from '@/components/providers/sw-register';
import { UpdateBanner } from '@/components/providers/update-banner';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { FeedbackWidget } from '@/components/feedback/feedback-widget';
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
    { media: '(prefers-color-scheme: dark)', color: '#0B1020' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
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
    var lightThemes = ['alpine-light'];
    var root = document.documentElement;
    var classes = root.classList;
    for (var i = classes.length - 1; i >= 0; i--) {
      var c = classes[i];
      if (themes.indexOf(c) !== -1 || c === 'system') classes.remove(c);
    }
    classes.add(resolved);
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = lightThemes.indexOf(resolved) !== -1 ? 'light' : 'dark';
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
        {/* PWA Meta Tags */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#0B1020" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SportsOS" />
        <meta name="msapplication-TileColor" content="#0B1020" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
        <meta name="theme-color" content="#0B1020" />
      </head>
      <body className={`${inter.variable} ${geistDisplay.variable} ${geistMono.variable} font-sans`}>
        {/* Dynamic, per-theme atmospheric background. Three layered
            divs — each theme gives them distinct motion (ice drift,
            gold sweep, stadium glow, mist fog). */}
        <Atmosphere />
        <ThemeProvider>
          <ThemeSync />
          <VersionCheck />
          <ServiceWorkerRegistration />
          <OfflineProvider>
            <CommandPaletteProvider>
              <MotionConfigProvider>
                <AuthProvider>
                  <LocationProvider>
                    <ShortlistProvider>
                      <CompareProvider>
                        <AnalyticsProvider>
                          <PostHogProvider>
                            {children}
                            <ConsentBanner />
                            <Toaster />
                            <UpdateBanner />
                            <WebVitalsReporter />
                            <FeedbackWidget />
                          </PostHogProvider>
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
