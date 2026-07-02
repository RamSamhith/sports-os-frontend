'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, Search } from 'lucide-react';
import { ShortlistSkeleton } from '@/components/feedback/skeletons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { EmptyState } from '@/components/feedback/empty-state';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';
import { getAcademyById } from '@/lib/api/academies';
import { getCoachById } from '@/lib/api/coaches';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';

type Supported = 'academy' | 'coach';

interface ShortlistViewProps {
  entityType: Supported;
}

export function ShortlistView({ entityType }: ShortlistViewProps) {
  const { items, remove, clear, populatedData } = useShortlist();
  const [resolvedItems, setResolvedItems] = React.useState<Array<{ id: string; data: Academy | Coach }>>([]);
  const [loading, setLoading] = React.useState(true);

  const entityItems = items.filter((it) => it.itemType === entityType);
  const idsKey = entityItems.map((it) => it.itemId).join(',');

  React.useEffect(() => {
    const currentIds = idsKey ? idsKey.split(',') : [];

    if (currentIds.length === 0) {
      setResolvedItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function resolveAll() {
      const results: Array<{ id: string; data: Academy | Coach }> = [];

      for (const id of currentIds) {
        const key = `${entityType}:${id}`;

        if (populatedData?.[key]) {
          results.push({ id, data: populatedData[key] as unknown as Academy | Coach });
          continue;
        }

        try {
          if (entityType === 'academy') {
            const res = await getAcademyById(id);
            if (!cancelled && res.ok) results.push({ id, data: res.data });
          } else {
            const res = await getCoachById(id);
            if (!cancelled && res.ok) results.push({ id, data: res.data });
          }
        } catch { /* skip */ }
      }

      if (!cancelled) {
        setResolvedItems(results);
        setLoading(false);
      }
    }
    resolveAll();
    return () => { cancelled = true; };
  }, [idsKey, entityType, populatedData]);

  const pluralLabel = entityType === 'academy' ? 'Academies' : 'Coaches';

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <ShortlistSkeleton />
      </div>
    );
  }

  if (entityItems.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title={`No ${pluralLabel.toLowerCase()} saved`}
        description="Save academies and coaches you're interested in. They'll appear here for easy comparison."
        action={
          <Button asChild>
            <Link href={entityType === 'academy' ? '/academies' : '/coaches'}>
              <Search className="mr-2 h-4 w-4" />
              Browse {pluralLabel}
            </Link>
          </Button>
        }
      />
    );
  }

  if (resolvedItems.length === 0 && entityItems.length > 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title={`Some ${pluralLabel.toLowerCase()} couldn't be loaded`}
        description="They may have been removed. Try browsing again."
        action={
          <Button asChild>
            <Link href={entityType === 'academy' ? '/academies' : '/coaches'}>
              <Search className="mr-2 h-4 w-4" />
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
          size="sm"
          className="text-muted-foreground hover:text-destructive gap-1.5 min-h-[44px]"
          onClick={() => {
            clear();
            toast(`Cleared all saved ${pluralLabel.toLowerCase()}`);
          }}
          aria-label={`Clear all saved ${pluralLabel.toLowerCase()}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
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
