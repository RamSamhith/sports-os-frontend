'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export function PressScale({
  children,
  className,
  scale = 0.98,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { scale?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileTap={reduced ? undefined : { scale }}
      transition={{ duration: 0.1, ease: [0.2, 0, 0, 1] }}
      className={cn('inline-flex', className)}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}
