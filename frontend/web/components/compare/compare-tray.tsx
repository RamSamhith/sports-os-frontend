'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/hooks/use-compare';
import { cn } from '@/lib/utils/cn';
import { traySlideVariants, chipVariants } from '@/components/motion/constants';

function getCompareLabel(items: Array<{ entityType: string; id: string }>): string {
  if (items.length === 0) return 'Compare Selected';
  const types = items.map((i) => i.entityType);
  const allSame = types.every((t) => t === types[0]);
  if (allSame) {
    const typeLabels: Record<string, string> = {
      academy: 'Academies',
      coach: 'Coaches',
      sport: 'Sports',
    };
    return `Compare ${items.length} ${typeLabels[types[0]] ?? 'Items'}`;
  }
  return `Compare ${items.length} Items`;
}

export function CompareTray() {
  const { items, remove, clear, minItems, extras } = useCompare();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isComparePage = pathname === '/compare';
  const canCompare = items.length >= minItems;
  const compareLabel = getCompareLabel(items);

  const handleCompare = () => {
    if (canCompare) {
      router.push('/compare');
    }
  };

  const handleClearAll = () => {
    clear();
    toast('Cleared compare tray');
  };

  return (
    <AnimatePresence>
      {items.length > 0 && !isComparePage && (
        <motion.div
          variants={reduced ? undefined : traySlideVariants}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'show'}
          exit={reduced ? undefined : 'exit'}
          className={cn(
            'atmosphere-tray border-border bg-card fixed inset-x-3 bottom-safe z-[var(--z-sticky)] mx-auto mb-3 flex max-w-3xl items-center gap-3 rounded-2xl border p-3 shadow-[var(--shadow-xl)]',
          )}
          role="region"
          aria-label="Compare tray"
        >
          <div className="flex flex-1 items-center gap-2 overflow-x-auto min-w-0">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const meta = extras[`${item.entityType}:${item.id}`];
                const label = meta?.label ?? item.id;
                const sublabel = meta?.sublabel ?? '';
                return (
                  <motion.span
                    key={`${item.entityType}-${item.id}`}
                    variants={reduced ? undefined : chipVariants}
                    initial={reduced ? undefined : 'hidden'}
                    animate={reduced ? undefined : 'show'}
                    exit={reduced ? undefined : 'exit'}
                    layout={!reduced}
                    className="bg-muted/60 flex h-12 shrink-0 items-center gap-1 rounded-md pl-3 pr-1 text-xs"
                  >
                    <span className="flex max-w-[10rem] flex-col truncate">
                      <span className="truncate font-medium">{label}</span>
                      {sublabel ? (
                        <span className="text-muted-foreground truncate text-[10px]">{sublabel}</span>
                      ) : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        remove(item.entityType, item.id);
                        toast(`Removed ${label} from compare`);
                      }}
                      aria-label={`Remove ${label} from compare`}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none grid h-11 w-11 shrink-0 place-items-center rounded-md transition-colors hover:bg-foreground/10"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              className="min-h-[48px] px-4 text-sm"
              onClick={handleClearAll}
              aria-label="Clear all compare items"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant={canCompare ? 'default' : 'outline'}
              className="min-h-[48px] px-6 text-sm font-medium"
              onClick={handleCompare}
              disabled={!canCompare}
              aria-label={canCompare ? compareLabel : `Add at least ${minItems} items to compare (you have ${items.length})`}
              aria-disabled={!canCompare}
            >
              {compareLabel} →
              {!canCompare && <span className="opacity-70"> ({Math.max(0, minItems - items.length)} more needed)</span>}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
