'use client';

import * as React from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { CoachGrid } from '@/components/coaches/coach-grid';
import { EmptyState } from '@/components/feedback/empty-state';
import { Inbox } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { getCoaches } from '@/lib/api/coaches';
import type { Coach } from '@/types/domain/coach';

export function CoachesListing() {
  const { query, setQuery, debouncedQuery } = useSearchQuery();
  const [coaches, setCoaches] = React.useState<Coach[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getCoaches({ pageSize: 100 });
      if (cancelled) return;
      if (res.ok) {
        setCoaches(res.data.items);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
  }, [query, coaches]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <SearchInput
          value=""
          onValueChange={() => {}}
          label="Search coaches"
          placeholder="Search coaches by name, city, or sport…"
          size="lg"
          disabled
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading coaches…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <SearchInput
          value=""
          onValueChange={() => {}}
          label="Search coaches"
          placeholder="Search coaches by name, city, or sport…"
          size="lg"
          disabled
        />
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive/40" />
          <div>
            <p className="text-foreground font-medium">Failed to load coaches</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
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
