'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { themeConfig } from '@/config/theme';

/**
 * SportsOS ThemeProvider — wraps next-themes with our 4-theme config.
 *
 * When the theme changes, we toggle a `.theme-transitioning` class on
 * <html> for 300 ms so CSS can animate background, border, text, card,
 * and shadow properties smoothly.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class') {
          // Theme class changed — start transition window
          document.documentElement.classList.add('theme-transitioning');
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
          }, 350);
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
