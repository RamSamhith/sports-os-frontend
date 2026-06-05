'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.main>
  );
}
