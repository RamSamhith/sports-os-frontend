'use client';

import * as React from 'react';
import { X, Loader2 } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { SportGrid } from '@/components/sports/sport-grid';
import { EmptyState } from '@/components/feedback/empty-state';
import { Inbox } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { listSports } from '@/lib/api/sports';
import type { Sport } from '@/types/domain/sport';

export function SportsListing() {
  const { query, setQuery, debouncedQuery } = useSearchQuery();
  const [allSports, setAllSports] = React.useState<Sport[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await listSports({ status: 'published', limit: 100 });
      if (cancelled) return;
      if (res.ok) setAllSports(res.data.items);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSports;
    return allSports.filter((s) => {
      const haystack = [s.name, s.category, ...(s.description ? [s.description] : [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, allSports]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <SearchInput
            value=""
            onValueChange={() => {}}
            label="Search sports"
            placeholder="Search sports by name or category…"
            size="lg"
          />
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

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
        {filtered.length} of {allSports.length} sports
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" />}
          title="No sports found"
          description="Try a different name or category."
          action={
            <Button size="sm" variant="outline" onClick={() => setQuery('')}>
              <X className="h-3.5 w-3.5" /> Clear search
            </Button>
          }
        />
      ) : (
        <SportGrid sports={filtered} onClear={() => setQuery('')} />
      )}
    </div>
  );
}
