'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

/**
 * PageTransition — wraps the page in a subtle fade + lift on mount.
 *
 * - 200 ms duration with standard deceleration curve.
 * - 12 px upward translate, fades from 0 → 1.
 * - Route enter only (no exit animation).
 * - Cancels under `prefers-reduced-motion`.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
