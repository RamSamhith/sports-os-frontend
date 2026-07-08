'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface HoverLiftProps extends React.HTMLAttributes<HTMLDivElement> {
  lift?: number;
  scale?: number;
  as?: 'div' | 'article' | 'li' | 'a';
}

export function HoverLift({
  children,
  className,
  lift = 4,
  scale = 1.01,
  as = 'div',
  ...props
}: HoverLiftProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      whileHover={reduced ? undefined : { y: -lift, scale }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
      className={cn('will-change-transform', className)}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
