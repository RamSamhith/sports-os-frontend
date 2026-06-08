'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { SportGrid } from '@/components/sports/sport-grid';
import { sports } from '@/data/sports';

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

export function SportsListing() {
  const { query, setQuery, debouncedQuery } = useSearchQuery();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sports;
    return sports.filter((s) => {
      const haystack = [s.name, s.category, ...(s.description ? [s.description] : [])]
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
          label="Search sports"
          placeholder="Search sports by name or category…"
          size="lg"
        />
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
