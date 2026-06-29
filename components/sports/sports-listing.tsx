'use client';

import * as React from 'react';
import { X, Loader2, AlertTriangle, Trophy } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { SportGrid } from '@/components/sports/sport-grid';
import { EmptyState } from '@/components/feedback/empty-state';
import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { listSports } from '@/lib/api/sports';
import type { Sport } from '@/types/domain/sport';

export function SportsListing({ hideSearch = false }: { hideSearch?: boolean } = {}) {
  const { query, setQuery, debouncedQuery } = useSearchQuery();
  const [allSports, setAllSports] = React.useState<Sport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSports = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSports({ status: 'published', limit: 100 });
      if (res.ok) setAllSports(res.data.items);
      else setError(res.error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sports');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSports();
  }, [loadSports]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSports;
    return allSports.filter((s) => {
      const haystack = [s.name, s.category, s.shortDescription ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, allSports]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {!hideSearch && (
          <div>
            <SearchInput
              value=""
              onValueChange={() => {}}
              label="Search sports"
              placeholder="Search sports by name or category…"
              size="lg"
            />
          </div>
        )}
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        {!hideSearch && (
          <div>
            <SearchInput
              value=""
              onValueChange={() => {}}
              label="Search sports"
              placeholder="Search sports by name or category…"
              size="lg"
            />
          </div>
        )}
        <div className="border-border/40 bg-card/40 mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <div className="bg-destructive/10 grid h-16 w-16 place-items-center rounded-full">
            <AlertTriangle className="h-7 w-7 text-destructive/60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Unable to load sports</h3>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={loadSports} className="mt-1">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (allSports.length === 0 && !loading) {
    return (
      <div className="flex flex-col gap-4">
        {!hideSearch && (
          <div>
            <SearchInput
              value=""
              onValueChange={() => {}}
              label="Search sports"
              placeholder="Search sports by name or category…"
              size="lg"
            />
          </div>
        )}
        <div className="border-border/40 bg-card/40 mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <div className="bg-primary/10 grid h-16 w-16 place-items-center rounded-full">
            <Trophy className="h-7 w-7 text-primary/60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Sports catalog coming soon</h3>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">
              We&apos;re building a comprehensive sports directory. In the meantime, explore our academies to find the right sport for you.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/academies">Browse academies</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/search">Search everything</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!hideSearch && (
        <div>
          <SearchInput
            value={query}
            onValueChange={setQuery}
            label="Search sports"
            placeholder="Search sports by name or category…"
            size="lg"
          />
        </div>
      )}

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
