'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { themeConfig } from '@/config/theme';

/**
 * SportsOS ThemeProvider — wraps next-themes with our 4-theme config.
 *
 * Hydration safety:
 *   - The pre-hydration script in app/layout.tsx sets the theme class on
 *     <html> before paint, so there is no flash of incorrect theme.
 *   - We pass `enableSystem` separately so that the OS preference resolves
 *     to one of our 4 themes (not to a "system" string the user has to
 *     map by hand).
 *   - We set `disableTransitionOnChange` so a theme switch doesn't fire
 *     transitions on every element.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={themeConfig.defaultTheme}
      enableSystem={themeConfig.enableSystem}
      storageKey={themeConfig.storageKey}
      themes={[...themeConfig.themes]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
