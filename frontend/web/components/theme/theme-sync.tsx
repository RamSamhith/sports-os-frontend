'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { themeNames } from '@/config/theme';

const lightThemes = ['alpine-light'];

/**
 * Syncs data-theme attribute and style.colorScheme with the current theme.
 * Runs on every theme change to keep browser-native elements in sync.
 */
export function ThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.style.colorScheme = lightThemes.includes(resolvedTheme) ? 'light' : 'dark';
  }, [resolvedTheme]);

  return null;
}
