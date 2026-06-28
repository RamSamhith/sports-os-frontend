'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

export function SharedLayout({
  children,
  layoutId,
}: {
  children: React.ReactNode;
  layoutId: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: 'spring', stiffness: 380, damping: 30, duration: reduced ? 0 : undefined }}
    >
      {children}
    </motion.div>
  );
}
