/**
 * SportsOS Theme System — single source of truth.
 *
 * Exactly four themes, no more. Each one is a *different product*,
 * not a colour swap. The UI exposes a single cycle button.
 */
export const themeNames = [
  'midnight-ice',
  'arctic-steel',
  'ember-orange',
  'alpine-light',
] as const;

export type ThemeName = (typeof themeNames)[number];

export interface ThemeMeta {
  id: ThemeName;
  label: string;
  description: string;
  icon: 'Snowflake' | 'Zap' | 'Flame' | 'Sun';
  accessibility: boolean;
  tags: ReadonlyArray<string>;
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  'midnight-ice': {
    id: 'midnight-ice',
    label: 'Midnight Ice',
    description: 'Premium flagship. Luxury, professional, modern, elite.',
    icon: 'Snowflake',
    accessibility: false,
    tags: ['Default', 'Luxury'],
  },
  'arctic-steel': {
    id: 'arctic-steel',
    label: 'Arctic Steel',
    description: 'Performance mode. Athletic, technology, speed, competition.',
    icon: 'Zap',
    accessibility: false,
    tags: ['Athletic', 'Speed'],
  },
  'ember-orange': {
    id: 'ember-orange',
    label: 'Ember Orange',
    description: 'Energy mode. Sports, action, competition, intensity.',
    icon: 'Flame',
    accessibility: false,
    tags: ['Energy', 'Sport'],
  },
  'alpine-light': {
    id: 'alpine-light',
    label: 'Alpine Light',
    description: 'Premium daylight. Apple-clean, Linear-crisp, Stripe-precise.',
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
