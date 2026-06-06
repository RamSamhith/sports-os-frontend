/**
 * Motion tokens for Framer Motion.
 * Mirrors CSS custom properties in app/tokens.css.
 */

import type { Transition, Variants } from 'framer-motion';

export const ease = {
  standard: [0.2, 0, 0, 1] as [number, number, number, number],
  emphasized: [0.3, 0, 0, 1] as [number, number, number, number],
  decelerate: [0, 0, 0, 1] as [number, number, number, number],
  accelerate: [0.3, 0, 1, 1] as [number, number, number, number],
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
