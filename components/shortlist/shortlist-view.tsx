'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { ShortlistSkeleton } from '@/components/feedback/skeletons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { EmptyState } from '@/components/feedback/empty-state';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';
import { getAcademy } from '@/lib/api/academies';
import { getCoach } from '@/lib/api/coaches';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';

type Supported = 'academy' | 'coach';

interface ShortlistViewProps {
  entityType: Supported;
}

export function ShortlistView({ entityType }: ShortlistViewProps) {
  const { items, remove } = useShortlist();
  const [resolvedItems, setResolvedItems] = React.useState<Array<{ id: string; data: Academy | Coach }>>([]);
  const [loading, setLoading] = React.useState(true);

  const ids = items.filter((it) => it.itemType === entityType).map((it) => it.itemId);
  const idsKey = ids.join(',');

  React.useEffect(() => {
    if (ids.length === 0) {
      setResolvedItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function resolveAll() {
      const results: Array<{ id: string; data: Academy | Coach }> = [];
      // Fetch all items in parallel
      const fetches = ids.map(async (id) => {
        try {
          if (entityType === 'academy') {
            const res = await getAcademy(id);
            if (!cancelled && res.ok) results.push({ id, data: res.data });
          } else {
            const res = await getCoach(id);
            if (!cancelled && res.ok) results.push({ id, data: res.data });
          }
        } catch { /* skip */ }
      });
      await Promise.all(fetches);
      if (!cancelled) {
        setResolvedItems(results);
        setLoading(false);
      }
    }
    resolveAll();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, entityType]);

  const pluralLabel = entityType === 'academy' ? 'Academies' : 'Coaches';

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <ShortlistSkeleton />
      </div>
    );
  }

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
        <Button variant="ghost" size="icon-touch" onClick={() => { for (const item of resolvedItems) remove(entityType, item.id); toast(`Cleared all saved ${pluralLabel.toLowerCase()}`); }} aria-label={`Clear all saved ${pluralLabel.toLowerCase()}`}>
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
