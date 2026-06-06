/**
 * SportsOS Theme System — single source of truth.
 *
 * Four themes only. The UI exposes them as a flat list. `system` is a
 * separate *mode* (resolves to dark or light) and is not counted as a
 * 5th theme — keeping the design-system manageable.
 */
export const themeNames = ['dark', 'light', 'arena', 'focus'] as const;

export type ThemeName = (typeof themeNames)[number];

export interface ThemeMeta {
  /** Theme id used in next-themes and CSS class names. */
  id: ThemeName;
  /** Human-readable name shown in the switcher. */
  label: string;
  /** Short description for tooltips and the settings page. */
  description: string;
  /** Lucide icon name (resolved by the switcher). */
  icon: 'Moon' | 'Sun' | 'Trophy' | 'Focus';
  /** Whether this theme is intended for long-reading / a11y. */
  accessibility: boolean;
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  dark: {
    id: 'dark',
    label: 'Dark',
    description: 'Premium, modern, high contrast. The default SportsOS experience.',
    icon: 'Moon',
    accessibility: false,
  },
  light: {
    id: 'light',
    label: 'Light',
    description: 'Clean, professional, parent- and school-friendly. Excellent outdoor readability.',
    icon: 'Sun',
    accessibility: false,
  },
  arena: {
    id: 'arena',
    label: 'Arena',
    description: 'Stadium atmosphere, elite training center. Energetic but restrained.',
    icon: 'Trophy',
    accessibility: false,
  },
  focus: {
    id: 'focus',
    label: 'Focus',
    description: 'Minimal distractions, maximum readability. Built for long reading sessions.',
    icon: 'Focus',
    accessibility: true,
  },
};

export const themeList: readonly ThemeMeta[] = themeNames.map((id) => themeMeta[id]);

export const themeConfig = {
  defaultTheme: 'dark' as ThemeName,
  /** All four themes must be present as CSS classes (.dark, .light, .arena, .focus). */
  themes: themeNames,
  storageKey: 'sportsos-theme',
  /** Whether to honour the OS preference when no explicit choice exists. */
  enableSystem: true,
} as const;
