'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { CoachGrid } from '@/components/coaches/coach-grid';
import { EmptyState } from '@/components/feedback/empty-state';
import { Inbox } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { coaches } from '@/data/coaches';

export function CoachesListing() {
  const { query, setQuery, debouncedQuery } = useSearchQuery();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coaches;
    return coaches.filter((c) => {
      const haystack = [
        c.name,
        c.location.city,
        c.location.state,
        ...c.sportsCoached,
        ...c.specialization,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          label="Search coaches"
          placeholder="Search coaches by name, city, or sport…"
          size="lg"
        />
      </div>

      <p className="text-muted-foreground text-sm">
        {filtered.length} of {coaches.length} coaches
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" />}
          title="No coaches found"
          description="Try a different name, city, or sport."
          action={
            <Button size="sm" variant="outline" onClick={() => setQuery('')}>
              <X className="h-3.5 w-3.5" /> Clear search
            </Button>
          }
        />
      ) : (
        <CoachGrid coaches={filtered} onClear={() => setQuery('')} />
      )}
    </div>
  );
}
