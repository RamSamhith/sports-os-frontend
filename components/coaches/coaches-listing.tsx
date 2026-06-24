'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, AlertTriangle } from 'lucide-react';
import { FullPageSkeleton, CoachCardSkeleton } from '@/components/feedback/skeletons';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { FilterGroup } from '@/components/filters/filter-group';
import { Separator } from '@/components/ui/separator';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';
import { EmptyState } from '@/components/feedback/empty-state';
import { Inbox } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { getCoaches } from '@/lib/api/coaches';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { trackSearch } from '@/lib/analytics/events';
import type { Coach } from '@/types/domain/coach';

const PAGE_SIZE = 12;

const sportOptions = sportTaxonomy.map((s) => ({
  value: s.slug,
  label: s.name,
  count: 0,
}));

const experienceRanges = [
  { value: '0-3', label: '0–3 years' },
  { value: '4-7', label: '4–7 years' },
  { value: '8-12', label: '8–12 years' },
  { value: '13-50', label: '13+ years' },
];

function readListFromParams(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CoachesListing() {
  const { query, setQuery, debouncedQuery } = useSearchQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allCoaches, setAllCoaches] = React.useState<Coach[]>([]);
  const [results, setResults] = React.useState<Coach[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const [sports, setSports] = React.useState<string[]>(() => readListFromParams(searchParams, 'sport'));
  const [cities, setCities] = React.useState<string[]>(() => readListFromParams(searchParams, 'city'));
  const [experience, setExperience] = React.useState<string[]>(() => readListFromParams(searchParams, 'experience'));

  // Fetch all coaches on mount for filter counts
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await getCoaches({ pageSize: 200 });
      if (cancelled) return;
      if (res.ok) {
        setAllCoaches(res.data.items);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Fetch filtered results when search or filters change (reset to page 1)
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setPage(1);
      setHasMore(true);
      const res = await getCoaches({
        search: debouncedQuery || undefined,
        sport: sports.length ? sports.join(',') : undefined,
        city: cities.length ? cities.join(',') : undefined,
        experienceYears: experience.length ? experience[0] : undefined,
        page: 1,
        pageSize: PAGE_SIZE,
      });
      if (cancelled) return;
      if (res.ok) {
        setResults(res.data.items);
        setTotal(res.data.pagination.total);
        setHasMore(res.data.items.length < (res.data.pagination.total ?? 0));
        if (debouncedQuery) {
          trackSearch(debouncedQuery, res.data.pagination.total, 'coaches');
        }
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedQuery, sports, cities, experience]);

  // Load more on intersection
  React.useEffect(() => {
    if (loading || !hasMore || loadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, loadingMore]);

  // Fetch next page when page increments
  React.useEffect(() => {
    if (page === 1 || loading) return;
    let cancelled = false;
    async function loadMore() {
      setLoadingMore(true);
      try {
        const res = await getCoaches({
          search: debouncedQuery || undefined,
          sport: sports.length ? sports.join(',') : undefined,
          city: cities.length ? cities.join(',') : undefined,
          experienceYears: experience.length ? experience[0] : undefined,
          page,
          pageSize: PAGE_SIZE,
        });
        if (cancelled) return;
        if (res.ok) {
          setResults((prev) => [...prev, ...res.data.items]);
          setHasMore(res.data.items.length === PAGE_SIZE);
        }
      } catch {
        // network error — stop infinite scroll
        if (!cancelled) setHasMore(false);
      } finally {
        if (!cancelled) setLoadingMore(false);
      }
    }
    loadMore();
    return () => { cancelled = true; };
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dynamic filter counts from all coaches
  const dynamicSportOptions = React.useMemo(() =>
    sportOptions.map((o) => ({
      ...o,
      count: allCoaches.filter((c) => c.sportsCoached.includes(o.value)).length,
    })),
    [allCoaches]
  );

  const dynamicCityOptions = React.useMemo(() => {
    const cityMap = new Map<string, number>();
    for (const c of allCoaches) {
      const city = c.location.city;
      cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
    }
    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ value: city, label: city, count }))
      .sort((a, b) => b.count - a.count);
  }, [allCoaches]);

  const dynamicExperienceOptions = React.useMemo(() =>
    experienceRanges.map((r) => {
      const [min, max] = r.value.split('-').map(Number);
      const count = allCoaches.filter((c) => c.experienceYears >= min && c.experienceYears <= max).length;
      return { ...r, count };
    }),
    [allCoaches]
  );

  const appliedCount = sports.length + cities.length + experience.length + (query ? 1 : 0);

  const clearAll = () => {
    setQuery('');
    setSports([]);
    setCities([]);
    setExperience([]);
    router.replace(`/coaches`, { scroll: false });
  };

  const removeQueryChip = () => setQuery('');
  const removeSport = (s: string) => setSports((prev) => prev.filter((x) => x !== s));
  const removeCity = (c: string) => setCities((prev) => prev.filter((x) => x !== c));
  const removeExperience = (e: string) => setExperience((prev) => prev.filter((x) => x !== e));

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sports.length) params.set('sport', sports.join(','));
    else params.delete('sport');
    if (cities.length) params.set('city', cities.join(','));
    else params.delete('city');
    if (experience.length) params.set('experience', experience.join(','));
    else params.delete('experience');
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sports, cities, experience]);

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (query) {
    chips.push({ key: 'q', label: `"${query}"`, onRemove: removeQueryChip });
  }
  for (const s of sports) {
    const opt = dynamicSportOptions.find((o) => o.value === s);
    chips.push({ key: `sport-${s}`, label: opt?.label ?? s, onRemove: () => removeSport(s) });
  }
  for (const c of cities) {
    const opt = dynamicCityOptions.find((o) => o.value === c);
    chips.push({ key: `city-${c}`, label: opt?.label ?? c, onRemove: () => removeCity(c) });
  }
  for (const e of experience) {
    const opt = dynamicExperienceOptions.find((o) => o.value === e);
    chips.push({ key: `exp-${e}`, label: opt?.label ?? e, onRemove: () => removeExperience(e) });
  }

  if (loading && results.length === 0) {
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
        <FullPageSkeleton />
      </div>
    );
  }

  if (error && results.length === 0) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            label="Search coaches"
            placeholder="Search coaches by name, city, or sport…"
            size="lg"
          />
        </div>
        <FilterDrawer
          appliedCount={sports.length + cities.length + experience.length}
          onClear={() => {
            setSports([]);
            setCities([]);
            setExperience([]);
          }}
        >
          <FilterGroup
            title="Sport"
            options={dynamicSportOptions}
            selected={sports}
            onChange={setSports}
            maxHeight="200px"
            layoutIdPrefix="filter-coach-sport"
          />
          <Separator />
          <FilterGroup
            title="City"
            options={dynamicCityOptions}
            selected={cities}
            onChange={setCities}
            maxHeight="200px"
            layoutIdPrefix="filter-coach-city"
          />
          <Separator />
          <FilterGroup
            title="Experience"
            options={dynamicExperienceOptions}
            selected={experience}
            onChange={setExperience}
            layoutIdPrefix="filter-coach-experience"
          />
        </FilterDrawer>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <Badge key={c.key} variant="secondary" className="gap-1 pr-1 min-h-[32px] flex items-center">
              {c.label}
              <button
                onClick={c.onRemove}
                className="text-muted-foreground hover:text-foreground p-1 -m-1 rounded"
                aria-label={`Remove filter ${c.label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
          {appliedCount > 0 ? (
            <Button size="sm" variant="outline" onClick={clearAll}>
              <X className="h-3.5 h-3.5" /> Clear all
            </Button>
          ) : null}
        </div>
      ) : null}

      <p className="text-muted-foreground text-sm">
        {results.length} of {total || allCoaches.length} coaches
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" />}
          title="No coaches found"
          description="Try a different name, city, or sport."
          action={
            <Button size="sm" variant="outline" onClick={clearAll}>
              <X className="h-3.5 h-3.5" /> Clear all
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((coach, i) => (
            <CoachCardPlaceholder key={coach.id} coach={coach} />
          ))}
          {loadingMore &&
            Array.from({ length: 3 }).map((_, i) => (
              <CoachCardSkeleton key={`loading-${i}`} />
            ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}
