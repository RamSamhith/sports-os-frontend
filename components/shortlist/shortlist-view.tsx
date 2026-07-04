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
import { getAcademyById } from '@/lib/api/academies';
import type { Academy } from '@/types/domain/academy';

interface ShortlistViewProps {
  entityType: 'academy';
}

export function ShortlistView({ entityType }: ShortlistViewProps) {
  const { items, remove, clear, populatedData } = useShortlist();
  const [resolvedItems, setResolvedItems] = React.useState<Array<{ id: string; data: Academy }>>([]);
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
      const results: Array<{ id: string; data: Academy }> = [];

      for (const id of currentIds) {
        const key = `${entityType}:${id}`;

        if (populatedData?.[key]) {
          results.push({ id, data: populatedData[key] as unknown as Academy });
          continue;
        }

        try {
          const res = await getAcademyById(id);
          if (!cancelled && res.ok) results.push({ id, data: res.data });
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
        title="No academies saved"
        description="Save academies you're interested in. They'll appear here for easy comparison."
        action={
          <Button asChild>
            <Link href="/academies">
              <Search className="mr-2 h-4 w-4" />
              Browse Academies
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
        title="Some academies couldn't be loaded"
        description="They may have been removed. Try browsing again."
        action={
          <Button asChild>
            <Link href="/academies">
              <Search className="mr-2 h-4 w-4" />
              Browse Academies
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
          {resolvedItems.length} saved {resolvedItems.length === 1 ? 'academy' : 'academies'}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive gap-1.5 min-h-[44px]"
          onClick={() => {
            clear();
            toast('Cleared all saved academies');
          }}
          aria-label="Clear all saved academies"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </Button>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resolvedItems.map((item) => (
          <div key={item.id} className="relative">
            <AcademyCardPlaceholder academy={item.data as Academy} />
          </div>
        ))}
      </div>
    </div>
  );
}
