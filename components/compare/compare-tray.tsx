'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/hooks/use-compare';
import { cn } from '@/lib/utils/cn';
import { academiesById, academiesBySlug } from '@/data/academies';
import { coachesById, coachesBySlug } from '@/data/coaches';
import { sportsById, sportsBySlug } from '@/data/sports';

function lookup(entityType: 'academy' | 'coach' | 'sport', id: string) {
  if (entityType === 'academy') return academiesById(id) ?? academiesBySlug(id);
  if (entityType === 'coach') return coachesById(id) ?? coachesBySlug(id);
  return sportsById(id) ?? sportsBySlug(id);
}

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
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (items.length === 0) return null;

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
    <div
      className={cn(
        'atmosphere-tray border-border bg-card/95 fixed inset-x-3 bottom-safe left-0 right-0 z-[var(--z-sticky)] mx-auto mb-3 flex max-w-3xl items-center gap-3 rounded-2xl border p-3 shadow-[var(--shadow-xl)] backdrop-blur-xl',
      )}
      role="region"
      aria-label="Compare tray"
    >
      <div className="flex flex-1 items-center gap-2 overflow-x-auto min-w-0">
        {items.map((item) => {
          const entity = lookup(item.entityType, item.id);
          const meta = extras[`${item.entityType}:${item.id}`];
          const label = meta?.label ?? entity?.name ?? item.id;
          const sublabel =
            meta?.sublabel ??
            (entity && 'location' in entity && entity.location
              ? `${entity.location.city}`
              : (entity && 'category' in entity && entity.category) || '');
          return (
            <span
              key={`${item.entityType}-${item.id}`}
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
                className="text-muted-foreground hover:text-foreground grid h-11 w-11 shrink-0 place-items-center rounded-md transition-colors hover:bg-foreground/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          );
        })}
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
    </div>
  );
}
