'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';
import { fadeInVariants, fadeUpVariants } from './constants';
import { cn } from '@/lib/utils/cn';

export function FadeIn({
  children,
  className,
  y = 0,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { y?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={reduced ? fadeInVariants : { ...fadeUpVariants, hidden: { opacity: 0, y } }}
      transition={{ duration: 0.36, ease: [0.2, 0, 0, 1] }}
      className={cn(className)}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}
