'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { themeConfig } from '@/config/theme';

/**
 * SportsOS ThemeProvider — wraps next-themes with our 4-theme config.
 *
 * Theme transition animation is handled by the theme toggle button,
 * which adds/removes `.theme-transitioning` on <html> directly.
 * No MutationObserver needed — avoids infinite class-toggle loops.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={themeConfig.defaultTheme}
      enableSystem={themeConfig.enableSystem}
      storageKey={themeConfig.storageKey}
      themes={[...themeConfig.themes]}
    >
      {children}
    </NextThemesProvider>
  );
}
