'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

interface StaggerListProps {
  children: React.ReactNode;
  /** Per-item delay (s). Default 0.05s = 50ms — visible but snappy. */
  step?: number;
  /** Initial delay (s). Default 0.05s. */
  delay?: number;
  /** Y offset for the entrance. Default 8. */
  yOffset?: number;
  className?: string;
}

const itemVariants = (yOffset: number) => ({
  hidden: { opacity: 0, y: yOffset },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0, 0, 1] },
  },
});

/**
 * StaggerList — fades-and-lifts each direct child in sequence.
 * Reduced motion collapses the stagger and the entrance is opacity only.
 */
export function StaggerList({
  children,
  step = 0.05,
  delay = 0.05,
  yOffset = 8,
  className,
}: StaggerListProps) {
  const reduced = useReducedMotion();
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : step,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };
  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants(yOffset)}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
