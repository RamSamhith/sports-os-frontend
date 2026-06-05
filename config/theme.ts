export const themeConfig = {
  defaultTheme: 'dark' as const,
  themes: ['dark', 'light', 'system'] as const,
  storageKey: 'sportsos-theme',
} as const;

export type ThemeName = (typeof themeConfig.themes)[number];
