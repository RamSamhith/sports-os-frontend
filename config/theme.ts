/**
 * SportsOS Theme System — single source of truth.
 *
 * Four themes only. The UI exposes them as a flat list. `system` is a
 * separate *mode* (resolves to one of the four) and is not counted as a
 * 5th theme — keeping the design-system manageable.
 */
export const themeNames = ['midnight', 'ivory', 'arena', 'focus'] as const;

export type ThemeName = (typeof themeNames)[number];

export interface ThemeMeta {
  id: ThemeName;
  label: string;
  /** Tagline shown in the cycle button tooltip. */
  description: string;
  /** Lucide icon name (resolved by the switcher). */
  icon: 'Moon' | 'Sun' | 'Trophy' | 'Focus';
  /** Whether this theme is intended for long-reading / a11y. */
  accessibility: boolean;
  /** Color stops for the per-theme atmospheric background. */
  atmosphere: ReadonlyArray<{ color: string; at: string }>;
  /** "Pause point" for the cycle. Each click advances to the next theme. */
  cycleIndex: number;
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    description: 'Oxford blue, deep navy, ice-blue accents. The default SportsOS experience.',
    icon: 'Moon',
    accessibility: false,
    atmosphere: [
      { color: 'hsl(217 60% 22% / 0.55)', at: '15% 0%' },
      { color: 'hsl(220 70% 10% / 0.30)', at: '85% 5%' },
      { color: 'hsl(199 80% 30% / 0.18)', at: '50% 100%' },
    ],
    cycleIndex: 0,
  },
  ivory: {
    id: 'ivory',
    label: 'Ivory',
    description: 'Warm ivory, sand, soft navy. Elegant, editorial, reading-friendly.',
    icon: 'Sun',
    accessibility: false,
    atmosphere: [
      { color: 'hsl(40 55% 88% / 0.55)', at: '0% 0%' },
      { color: 'hsl(35 35% 82% / 0.40)', at: '100% 20%' },
      { color: 'hsl(220 30% 60% / 0.18)', at: '50% 100%' },
    ],
    cycleIndex: 1,
  },
  arena: {
    id: 'arena',
    label: 'Arena',
    description: 'Deep emerald, championship gold, soft cream. The SportsOS signature.',
    icon: 'Trophy',
    accessibility: false,
    atmosphere: [
      { color: 'hsl(160 50% 16% / 0.55)', at: '10% 10%' },
      { color: 'hsl(40 65% 30% / 0.30)', at: '90% 5%' },
      { color: 'hsl(40 30% 90% / 0.18)', at: '50% 100%' },
    ],
    cycleIndex: 2,
  },
  focus: {
    id: 'focus',
    label: 'Focus',
    description: 'Warm stone, clay, soft brown. Calm, minimal, maximum readability.',
    icon: 'Focus',
    accessibility: true,
    atmosphere: [],
    cycleIndex: 3,
  },
};

export const themeList: readonly ThemeMeta[] = themeNames.map((id) => themeMeta[id]);

/** Cycle order — one click advances to the next. */
export const themeCycle: readonly ThemeName[] = themeNames;

/** Advance from one theme to the next in the cycle (wraps). */
export function nextTheme(current: ThemeName): ThemeName {
  const i = themeCycle.indexOf(current);
  return themeCycle[(i + 1) % themeCycle.length];
}

export const themeConfig = {
  defaultTheme: 'midnight' as ThemeName,
  /** All four themes must be present as CSS classes. */
  themes: themeNames,
  storageKey: 'sportsos-theme',
  enableSystem: true,
} as const;
