'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import { themeNames, type ThemeName } from '@/config/theme';

/**
 * Hydration-safe theme hook.
 *
 * Returns:
 *   - `mounted`: false on the server / first client render. UI that depends
 *     on the active theme should branch on this and render a stable
 *     placeholder until `mounted === true`. Prevents hydration mismatches.
 *   - `theme`: the user-selected theme (or 'system').
 *   - `resolvedTheme`: the theme that is actually applied to <html>.
 *   - `setTheme`: pass one of `themeNames` or 'system'.
 *
 * `activeTheme` is a convenience: the theme currently in effect.
 */
export function useThemeSafe() {
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const activeTheme: ThemeName = React.useMemo(() => {
    const value = mounted ? (resolvedTheme ?? theme) : undefined;
    return value && (themeNames as readonly string[]).includes(value)
      ? (value as ThemeName)
      : 'midnight-ice';
  }, [mounted, resolvedTheme, theme]);


  return { mounted, theme, resolvedTheme, setTheme, systemTheme, activeTheme };
}
