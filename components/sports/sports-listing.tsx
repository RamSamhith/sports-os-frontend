'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SportGrid } from '@/components/sports/sport-grid';
import { sports } from '@/data/sports';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function SportsListing() {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 250);

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return sports;
    return sports.filter((s) => {
      const haystack = [s.name, s.category, ...(s.description ? [s.description] : [])]
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
          placeholder="Search sports by name or category…"
          className="h-11 pl-10 text-base text-sm md:text-sm"
          aria-label="Search sports"
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
        {filtered.length} of {sports.length} sports
      </p>

      {filtered.length === 0 ? (
        <div className="border-border/60 bg-card/40 mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm font-semibold">No sports found</p>
          <p className="text-muted-foreground text-sm">Try a different name or category.</p>
          <Button size="sm" variant="outline" onClick={() => setQuery('')}>
            <X className="h-3.5 w-3.5" /> Clear search
          </Button>
        </div>
      ) : (
        <SportGrid sports={filtered} onClear={() => setQuery('')} />
      )}
    </div>
  );
}
