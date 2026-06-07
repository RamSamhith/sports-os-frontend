/**
 * SportsOS Theme System — single source of truth.
 *
 * Four themes only. Each one is a distinct premium product, not a
 * colour swap. The UI exposes a single cycle button — no dropdown.
 */
export const themeNames = ['midnight-ice', 'emerald-gold', 'ember-orange', 'monochrome-mist'] as const;

export type ThemeName = (typeof themeNames)[number];

export interface ThemeMeta {
  id: ThemeName;
  label: string;
  description: string;
  icon: 'Snowflake' | 'Crown' | 'Flame' | 'Image';
  accessibility: boolean;
  /** Quick tags for the settings card. */
  tags: ReadonlyArray<string>;
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  'midnight-ice': {
    id: 'midnight-ice',
    label: 'Midnight Ice',
    description: 'Premium sports analytics. Cold, technical, elegant.',
    icon: 'Snowflake',
    accessibility: false,
    tags: ['Tech', 'Cool', 'Default'],
  },
  'emerald-gold': {
    id: 'emerald-gold',
    label: 'Emerald Gold',
    description: 'Elite sports academy club. Luxurious, prestigious, calm.',
    icon: 'Crown',
    accessibility: false,
    tags: ['Luxury', 'Club'],
  },
  'ember-orange': {
    id: 'ember-orange',
    label: 'Ember Orange',
    description: 'High-performance competition. Energetic, bold, powerful.',
    icon: 'Flame',
    accessibility: false,
    tags: ['Energy', 'Sport'],
  },
  'monochrome-mist': {
    id: 'monochrome-mist',
    label: 'Monochrome Mist',
    description: 'Editorial sports magazine. Minimal, elegant, timeless.',
    icon: 'Image',
    accessibility: true,
    tags: ['Editorial', 'A11y'],
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
