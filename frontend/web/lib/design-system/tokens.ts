/**
 * Design system token references (mirrors of CSS custom properties).
 * Use these when a JS value is required (e.g. for canvas, framer-motion values,
 * conditional inline styles). The source of truth is `app/tokens.css`.
 */

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const radius = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  pill: '9999px',
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 hsl(0 0% 0% / 0.2)',
  sm: '0 1px 3px 0 hsl(0 0% 0% / 0.25), 0 1px 2px -1px hsl(0 0% 0% / 0.25)',
  md: '0 4px 6px -1px hsl(0 0% 0% / 0.3), 0 2px 4px -2px hsl(0 0% 0% / 0.3)',
  lg: '0 10px 15px -3px hsl(0 0% 0% / 0.35), 0 4px 6px -4px hsl(0 0% 0% / 0.3)',
  xl: '0 20px 25px -5px hsl(0 0% 0% / 0.4), 0 8px 10px -6px hsl(0 0% 0% / 0.35)',
  glow: '0 0 40px hsl(199 89% 56% / 0.25)',
} as const;

export const motion = {
  ease: {
    standard: [0.2, 0, 0, 1] as [number, number, number, number],
    emphasized: [0.3, 0, 0, 1] as [number, number, number, number],
    decelerate: [0, 0, 0, 1] as [number, number, number, number],
    accelerate: [0.3, 0, 1, 1] as [number, number, number, number],
  },
  duration: {
    micro: 0.12,
    fast: 0.18,
    standard: 0.24,
    slow: 0.36,
    page: 0.48,
  },
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 100,
  overlay: 200,
  drawer: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
} as const;

export const breakpoints = {
  xs: 320,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  '3xl': 1680,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const layout = {
  contentMax: 1440,
  contentNarrow: 960,
  contentProse: 720,
  navbarHeight: 64,
  sectionY: 96,
} as const;
