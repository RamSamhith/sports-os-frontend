'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';
import { fadeUpVariants, staggerContainerVariants } from './constants';
import { cn } from '@/lib/utils/cn';

export function StaggerContainer({
  children,
  className,
  delay = 0,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={reduced ? undefined : staggerContainerVariants}
      transition={{ delayChildren: delay }}
      className={cn(className)}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { as?: 'div' | 'li' | 'article' | 'section' }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      variants={reduced ? undefined : fadeUpVariants}
      className={cn(className)}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
