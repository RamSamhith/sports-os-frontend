'use client';

import { MotionConfig } from 'framer-motion';
import * as React from 'react';

/**
 * Wraps the app to honor `prefers-reduced-motion` at the Framer Motion layer.
 * Place this high in the tree (we mount it in the root layout).
 */
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
