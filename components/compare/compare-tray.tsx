'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/hooks/use-compare';
import { cn } from '@/lib/utils/cn';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';

function lookup(entityType: 'academy' | 'coach' | 'sport', id: string) {
  if (entityType === 'academy') return academies.find((a) => a.id === id);
  if (entityType === 'coach') return coaches.find((c) => c.id === id);
  return sports.find((s) => s.id === id);
}

export function CompareTray() {
  const { items, remove, clear, maxItems, extras } = useCompare();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;
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
                  className="border-border/40 bg-muted/30 text-muted-foreground grid h-12 w-28 shrink-0 place-items-center rounded-md border border-dashed text-[10px] tracking-widest uppercase"
                >
                  Empty
                </span>
              );
            }
            const entity = lookup(item.entityType, item.id);
            const meta = extras[`${item.entityType}:${item.id}`];
            const label = meta?.label ?? entity?.name ?? entity?.name ?? item.id;
            const sublabel =
              meta?.sublabel ??
              (entity && 'location' in entity && entity.location
                ? `${entity.location.city}`
                : (entity && 'category' in entity && entity.category) || '');
            return (
              <span
                key={`${item.entityType}-${item.id}`}
                className="bg-muted/50 flex h-12 shrink-0 items-center gap-2 rounded-md px-3 text-xs"
              >
                <span className="flex max-w-[10rem] flex-col truncate">
                  <span className="truncate font-medium">{label}</span>
                  {sublabel ? (
                    <span className="text-muted-foreground truncate text-[10px]">{sublabel}</span>
                  ) : null}
                </span>
                <button
                  onClick={() => {
                    remove(item.entityType, item.id);
                    toast(`Removed ${label} from compare`);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${label} from compare`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              clear();
              toast('Cleared compare tray');
            }}
          >
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
