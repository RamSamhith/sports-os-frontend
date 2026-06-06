'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CoachGrid } from '@/components/coaches/coach-grid';
import { coaches } from '@/data/coaches';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function CoachesListing() {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 250);

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
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
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coaches by name, city, or sport…"
          className="h-11 pl-10 text-base text-sm md:text-sm"
          aria-label="Search coaches"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <p className="text-muted-foreground text-sm">
        {filtered.length} of {coaches.length} coaches
      </p>

      {filtered.length === 0 ? (
        <div className="border-border/60 bg-card/40 mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm font-semibold">No coaches found</p>
          <p className="text-muted-foreground text-sm">
            Try a different name, city, or sport.
          </p>
          <Button size="sm" variant="outline" onClick={() => setQuery('')}>
            <X className="h-3.5 w-3.5" /> Clear search
          </Button>
        </div>
      ) : (
        <CoachGrid coaches={filtered} onClear={() => setQuery('')} />
      )}
    </div>
  );
}
