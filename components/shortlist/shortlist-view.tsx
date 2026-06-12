'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';
import { EmptyState } from '@/components/feedback/empty-state';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';

type Supported = 'academy' | 'coach';

interface ShortlistViewProps {
  entityType: Supported;
}

export function ShortlistView({ entityType }: ShortlistViewProps) {
  const { items, remove, extras, populatedData } = useShortlist();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const ids = items
    .filter((it) => it.itemType === entityType)
    .map((it) => it.itemId);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/30 h-40 rounded-xl border border-dashed"
          />
        ))}
      </div>
    );
  }

  const pluralLabel = entityType === 'academy' ? 'Academies' : 'Coaches';

  if (ids.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title={`No ${pluralLabel.toLowerCase()} saved`}
        description="Saved items appear here. Tap the bookmark on a card to add."
        action={
          <Button asChild>
            <Link href={entityType === 'academy' ? '/academies' : '/coaches'}>
              Browse {pluralLabel}
            </Link>
          </Button>
        }
      />
    );
  }

  // Build list of items: try populated data first, then static data
  const resolvedItems: Array<{ id: string; data: Academy | Coach }> = [];
  for (const id of ids) {
    const popKey = `${entityType}:${id}`;
    const pop = populatedData?.[popKey];
    if (pop) {
      resolvedItems.push({ id, data: pop as unknown as Academy | Coach });
    } else {
      const staticItem = entityType === 'academy'
        ? academies.find((a) => a.id === id)
        : coaches.find((c) => c.id === id);
      if (staticItem) resolvedItems.push({ id, data: staticItem });
    }
  }

  if (resolvedItems.length === 0 && ids.length > 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title={`No saved ${pluralLabel.toLowerCase()} found`}
        description="Saved items may have been removed. Try browsing again."
        action={
          <Button asChild>
            <Link href={entityType === 'academy' ? '/academies' : '/coaches'}>
              Browse {pluralLabel}
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {resolvedItems.length} saved {resolvedItems.length === 1 ? entityType : pluralLabel}
        </p>
        <Button
          variant="ghost"
          size="icon-touch"
          onClick={() => {
            for (const item of resolvedItems) remove(entityType, item.id);
            toast(`Cleared all saved ${pluralLabel.toLowerCase()}`);
          }}
          aria-label={`Clear all saved ${pluralLabel.toLowerCase()}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resolvedItems.map((item) => (
          <div key={item.id} className="relative">
            {entityType === 'academy' ? (
              <AcademyCardPlaceholder academy={item.data as Academy} />
            ) : (
              <CoachCardPlaceholder coach={item.data as Coach} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
