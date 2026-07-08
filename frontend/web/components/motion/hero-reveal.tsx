'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';
import { heroRevealVariants } from './constants';
import { cn } from '@/lib/utils/cn';

export interface HeroRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  as?: 'div' | 'section' | 'header';
}

export function HeroReveal({ children, className, delay = 0, as = 'div', ...props }: HeroRevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      initial={reduced ? { opacity: 0 } : 'hidden'}
      animate={reduced ? { opacity: 1 } : 'show'}
      variants={reduced ? undefined : heroRevealVariants}
      transition={{ delay, duration: 0.6, ease: [0.3, 0, 0, 1] }}
      className={cn(className)}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
