'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';
import { SportCard } from '@/components/sports/sport-card';
import { EmptyState } from '@/components/feedback/empty-state';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';
import type { ShortlistItemType } from '@/types/domain/shortlist';

type Supported = 'academy' | 'coach' | 'sport';

interface ShortlistViewProps {
  entityType: Supported;
}

export function ShortlistView({ entityType }: ShortlistViewProps) {
  const { items, remove, clear, extras } = useShortlist();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const ids = items
    .filter((it) => it.itemType === entityType)
    .map((it) => it.itemId);

  if (!mounted) {
    // Render a placeholder grid that matches the eventual layout to avoid CLS.
    return (
      <div
        aria-hidden
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
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

  if (ids.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title={`No ${entityType === 'sport' ? 'sports' : `${entityType}es`} saved`}
        description="Saved items appear here. Tap the bookmark on a card to add."
        action={
          <Button asChild>
            <Link
              href={
                entityType === 'academy'
                  ? '/academies'
                  : entityType === 'coach'
                    ? '/coaches'
                    : '/sports'
              }
            >
              Browse {entityType === 'sport' ? 'sports' : `${entityType}es`}
            </Link>
          </Button>
        }
      />
    );
  }

  if (entityType === 'academy') {
    const items = ids
      .map((id) => academies.find((a) => a.id === id))
      .filter((a): a is (typeof academies)[number] => Boolean(a));
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {items.length} saved academy{items.length === 1 ? '' : 's'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              for (const a of items) remove('academy', a.id);
              toast('Cleared all saved academies');
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <div key={a.id} className="relative">
              <AcademyCardPlaceholder academy={a} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entityType === 'coach') {
    const items = ids
      .map((id) => coaches.find((c) => c.id === id))
      .filter((c): c is (typeof coaches)[number] => Boolean(c));
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {items.length} saved coach{items.length === 1 ? '' : 'es'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              for (const c of items) remove('coach', c.id);
              toast('Cleared all saved coaches');
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <div key={c.id} className="relative">
              <CoachCardPlaceholder coach={c} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // sports
  const sportItems = ids
    .map((id) => sports.find((s) => s.id === id))
    .filter((s): s is (typeof sports)[number] => Boolean(s));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {sportItems.length} saved sport{sportItems.length === 1 ? '' : 's'}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            for (const s of sportItems) remove('sport', s.id);
            toast('Cleared all saved sports');
          }}
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear all
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {sportItems.map((s) => (
          <div key={s.id} className="relative">
            <SportCard sport={s} />
          </div>
        ))}
      </div>
    </div>
  );
}
