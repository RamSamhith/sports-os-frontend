'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

export interface FilterChip {
  key: string;
  label: string;
  onRemove?: () => void;
}

export function FilterChips({ chips, onClearAll, className }: { chips: FilterChip[]; onClearAll?: () => void; className?: string }) {
  if (!chips.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {chips.map((chip) => (
        <motion.span
          key={chip.key}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          className="border-border/60 bg-card/60 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs"
        >
          {chip.label}
          {chip.onRemove ? (
            <button
              type="button"
              onClick={chip.onRemove}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${chip.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </motion.span>
      ))}
      {onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
