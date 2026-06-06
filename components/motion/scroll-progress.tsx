'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export function ScrollProgress({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30, restDelta: 0.001 });

  if (reduced) return null;

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className={cn('bg-primary fixed top-0 right-0 left-0 z-[var(--z-sticky)] h-0.5', className)}
      aria-hidden
    />
  );
}
