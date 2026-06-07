/**
 * SportsOS Theme System — single source of truth.
 *
 * Four themes only. Each one is a *different product*, not a colour swap.
 * Cycle: Midnight Ice → Ember Orange → Graphite Titanium → Alpine Light.
 */
export const themeNames = [
  'midnight-ice',
  'ember-orange',
  'graphite-titanium',
  'alpine-light',
] as const;

export type ThemeName = (typeof themeNames)[number];

export interface ThemeMeta {
  id: ThemeName;
  label: string;
  description: string;
  icon: 'Snowflake' | 'Flame' | 'Gem' | 'Sun';
  accessibility: boolean;
  tags: ReadonlyArray<string>;
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  'midnight-ice': {
    id: 'midnight-ice',
    label: 'Midnight Ice',
    description: 'Premium sports platform. Slow aurora, soft blue drift.',
    icon: 'Snowflake',
    accessibility: false,
    tags: ['Default', 'Tech'],
  },
  'ember-orange': {
    id: 'ember-orange',
    label: 'Ember Orange',
    description: 'Competition, performance, athlete mindset. Stadium energy.',
    icon: 'Flame',
    accessibility: false,
    tags: ['Sport', 'Energy'],
  },
  'graphite-titanium': {
    id: 'graphite-titanium',
    label: 'Graphite Titanium',
    description: 'Executive, luxury, premium software. Metallic sweep.',
    icon: 'Gem',
    accessibility: false,
    tags: ['Luxury', 'Metallic'],
  },
  'alpine-light': {
    id: 'alpine-light',
    label: 'Alpine Light',
    description: 'Professional, premium, minimal. Genuinely bright daylight.',
    icon: 'Sun',
    accessibility: true,
    tags: ['Light', 'A11y'],
  },
};

export const themeList: readonly ThemeMeta[] = themeNames.map((id) => themeMeta[id]);

export const themeCycle: readonly ThemeName[] = themeNames;

export function nextTheme(current: ThemeName): ThemeName {
  const i = themeCycle.indexOf(current);
  return themeCycle[(i + 1) % themeCycle.length];
}

export const themeConfig = {
  defaultTheme: 'midnight-ice' as ThemeName,
  themes: themeNames,
  storageKey: 'sportsos-theme',
  enableSystem: true,
} as const;
