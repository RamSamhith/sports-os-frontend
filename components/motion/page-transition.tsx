'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

/**
 * PageTransition — wraps the page in a subtle fade + lift on mount.
 *
 * - 420 ms duration with a luxe ease curve.
 * - 12 px upward translate, fades from 0 → 1.
 * - Cancels under `prefers-reduced-motion`.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
  );
}
