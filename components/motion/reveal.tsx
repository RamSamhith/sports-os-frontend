'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.2, 0, 0, 1] },
  },
};

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer';
}

export function Reveal({ children, className, delay = 0, y = 16, as = 'div', ...props }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={reduced ? undefined : variants}
      transition={{ delay, duration: 0.48, ease: [0.2, 0, 0, 1] }}
      className={cn(className)}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
