'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

export interface FilterChip {
  key: string;
  label: string;
  /** Shared layout id used to animate between filter drawer and chip row. */
  layoutId?: string;
  onRemove?: () => void;
}

export function FilterChips({
  chips,
  onClearAll,
  className,
}: {
  chips: FilterChip[];
  onClearAll?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (!chips.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {chips.map((chip) => {
        const inner = (
          <>
            {chip.label}
            {chip.onRemove ? (
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label}`}
                className="text-muted-foreground hover:text-foreground -mr-1 ml-0.5 grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-foreground/10"
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </>
        );
        const baseClass =
          'border-border/60 bg-card/70 hover:border-foreground/30 hover:bg-card/90 motion-press inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs';
        return chip.layoutId ? (
          <motion.span
            key={chip.key}
            layoutId={chip.layoutId}
            className={baseClass}
          >
            {inner}
          </motion.span>
        ) : (
          <motion.span
            key={chip.key}
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 4 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className={baseClass}
          >
            {inner}
          </motion.span>
        );
      })}
      {onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
