/**
 * Motion tokens for Framer Motion.
 * Mirrors CSS custom properties in app/tokens.css.
 *
 * SportsOS motion identity:
 * - Trajectory-inspired: elements move with directional momentum
 * - Deceleration: fast start, confident stop (like an athlete)
 * - Consistent: every interaction feels like the same product
 */

import type { Transition, Variants } from 'framer-motion';

export const ease = {
  standard: [0.2, 0, 0, 1] as [number, number, number, number],
  emphasized: [0.3, 0, 0, 1] as [number, number, number, number],
  decelerate: [0, 0, 0, 1] as [number, number, number, number],
  accelerate: [0.3, 0, 1, 1] as [number, number, number, number],
  /** Athletic deceleration — fast start, confident stop. Like a sprinter crossing the line. */
  athletic: [0.1, 0.6, 0.2, 1] as [number, number, number, number],
  /** Premium snap — quick settle with subtle overshoot. */
  snap: [0.2, 1.2, 0.3, 1] as [number, number, number, number],
};

export const duration = {
  micro: 0.12,
  fast: 0.18,
  standard: 0.24,
  slow: 0.36,
  page: 0.48,
};

export const transition = {
  micro: { duration: duration.micro, ease: ease.standard } satisfies Transition,
  fast: { duration: duration.fast, ease: ease.standard } satisfies Transition,
  standard: { duration: duration.standard, ease: ease.standard } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.standard } satisfies Transition,
  page: { duration: duration.page, ease: ease.standard } satisfies Transition,
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.standard, ease: ease.standard },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.standard, ease: ease.standard } },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.standard, ease: ease.standard },
  },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: duration.standard, ease: ease.standard } },
};

export const heroRevealVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: ease.emphasized },
  },
};

// ─── SportsOS Identity Tokens ────────────────────────────────────────────────

/** Athletic spring — confident, fast-settling. Used for card interactions. */
export const spring = {
  athletic: { type: 'spring' as const, stiffness: 380, damping: 28 },
  snap: { type: 'spring' as const, stiffness: 480, damping: 24 },
  smooth: { type: 'spring' as const, stiffness: 260, damping: 26 },
} satisfies Record<string, Transition>;

/**
 * Trajectory-inspired card interaction.
 * Elements lift with slight forward momentum, like a ball in flight.
 */
export const cardHoverVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -3,
    scale: 1.005,
    transition: { duration: duration.fast, ease: ease.athletic },
  },
};

export const cardTapVariants: Variants = {
  tap: { scale: 0.99, y: 0, transition: { duration: duration.micro, ease: ease.standard } },
};

/**
 * Momentum reveal — decelerating entrance from a direction.
 * Feels like an object sliding into frame with momentum.
 */
export const momentumRevealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: ease.athletic },
  },
};

/**
 * Stagger container for card grids — slightly faster than page stagger.
 */
export const cardStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

/**
 * Compare tray entrance — slides up from below with momentum.
 */
export const traySlideVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: ease.athletic },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: { duration: 0.2, ease: ease.accelerate },
  },
};

/**
 * Chip entrance/exit for compare tray items.
 */
export const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, x: -8 },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.25, ease: ease.snap },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    x: 8,
    transition: { duration: 0.15, ease: ease.accelerate },
  },
};
