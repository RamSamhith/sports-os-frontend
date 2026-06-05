'use client';

import Link from 'next/link';
import { useCompare } from '@/lib/hooks/use-compare';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export function CompareTray() {
  const { items, remove, clear, maxItems } = useCompare();
  if (items.length === 0) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
        className={cn(
          'border-border/60 bg-card/90 fixed inset-x-3 bottom-3 z-[var(--z-sticky)] mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border p-3 shadow-xl backdrop-blur',
        )}
        role="region"
        aria-label="Compare tray"
      >
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {Array.from({ length: maxItems }).map((_, i) => {
            const item = items[i];
            if (!item) {
              return (
                <span
                  key={`empty-${i}`}
                  className="border-border/40 bg-muted/30 text-muted-foreground grid h-12 w-24 place-items-center rounded-md border border-dashed text-[10px] tracking-widest uppercase"
                >
                  Empty
                </span>
              );
            }
            return (
              <span
                key={`${item.entityType}-${item.id}`}
                className="bg-muted/50 flex h-12 items-center gap-2 rounded-md px-3 text-xs"
              >
                {item.entityType}/{item.id}
                <button
                  onClick={() => remove(item.entityType, item.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove from compare"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={clear}>
            Clear
          </Button>
          <Button size="sm" asChild>
            <Link href="/compare">Compare ({items.length})</Link>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
