'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { CoachGrid } from '@/components/coaches/coach-grid';
import { coaches } from '@/data/coaches';

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useSearchQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');
  const debouncedQuery = useDebounced(query, 150);

  React.useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if ((debouncedQuery || '') === current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set('q', debouncedQuery);
    else params.delete('q');
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return { query, setQuery, debouncedQuery };
}

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
