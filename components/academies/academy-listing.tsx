'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Badge } from '@/components/ui/badge';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { FilterGroup } from '@/components/filters/filter-group';
import { Separator } from '@/components/ui/separator';
import { AcademyGrid } from '@/components/academies/academy-grid';
import { academyFilterFacilities, academyFilterLevels, verificationStatuses } from '@/lib/constants/filters';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { getAcademies } from '@/lib/api/academies';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import { searchSubmitEvent } from '@/lib/analytics/events';
import type { Academy } from '@/types/domain/academy';

const sportOptions = sportTaxonomy.map((s) => ({
  value: s.slug,
  label: s.name,
  count: 0,
}));

const facilityOptions = academyFilterFacilities.map((f) => ({
  value: f.value,
  label: f.label,
  count: 0,
}));

const levelOptions = academyFilterLevels.map((l) => ({
  value: l.value,
  label: l.label,
  count: 0,
}));

const statusOptions = verificationStatuses.map((s) => ({
  value: s.value,
  label: s.label,
  count: 0,
}));

function readListFromParams(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AcademyListing() {
  const { query, setQuery, debouncedQuery } = useSearchQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useAnalytics();

  const [allAcademies, setAllAcademies] = React.useState<Academy[]>([]);
  const [results, setResults] = React.useState<Academy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState(0);

  const [sports, setSports] = React.useState<string[]>(() => readListFromParams(searchParams, 'sport'));
  const [facilities, setFacilities] = React.useState<string[]>(() => readListFromParams(searchParams, 'facility'));
  const [levels, setLevels] = React.useState<string[]>(() => readListFromParams(searchParams, 'level'));
  const [statuses, setStatuses] = React.useState<string[]>(() => readListFromParams(searchParams, 'status'));

  // Fetch all academies on mount for filter counts
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await getAcademies({ pageSize: 100 });
      if (cancelled) return;
      if (res.ok) {
        setAllAcademies(res.data.items);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Fetch filtered results when search or filters change
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getAcademies({
        search: debouncedQuery || undefined,
        sport: sports.length ? sports.join(',') : undefined,
        facility: facilities.length ? facilities.join(',') : undefined,
        level: levels.length ? levels.join(',') : undefined,
        status: statuses.length ? statuses.join(',') : undefined,
        pageSize: 100,
      });
      if (cancelled) return;
      if (res.ok) {
        setResults(res.data.items);
        setTotal(res.data.pagination.total);
        // Fire analytics on search
        if (debouncedQuery) {
          track(searchSubmitEvent({
            query: debouncedQuery,
            resultsCount: res.data.pagination.total,
            filters: {
              sport: sports.length ? sports : undefined,
              facility: facilities.length ? facilities : undefined,
              level: levels.length ? levels : undefined,
              status: statuses.length ? statuses : undefined,
            },
          }));
        }
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedQuery, sports, facilities, levels, statuses, track]);

  const dynamicSportOptions = React.useMemo(() =>
    sportOptions.map((o) => ({
      ...o,
      count: allAcademies.filter((a) => a.sportsOffered.includes(o.value)).length,
    })),
    [allAcademies]
  );

  const dynamicFacilityOptions = React.useMemo(() =>
    facilityOptions.map((o) => ({
      ...o,
      count: allAcademies.filter((a) => a.facilities.includes(o.value as never)).length,
    })),
    [allAcademies]
  );

  const dynamicLevelOptions = React.useMemo(() =>
    levelOptions.map((o) => ({
      ...o,
      count: allAcademies.filter((a) => a.trainingLevels.includes(o.value as never)).length,
    })),
    [allAcademies]
  );

  const dynamicStatusOptions = React.useMemo(() =>
    statusOptions.map((o) => ({
      ...o,
      count: allAcademies.filter((a) => a.verificationStatus === o.value).length,
    })),
    [allAcademies]
  );

  const appliedCount =
    sports.length + facilities.length + levels.length + statuses.length + (query ? 1 : 0);

  const clearAll = () => {
    setQuery('');
    setSports([]);
    setFacilities([]);
    setLevels([]);
    setStatuses([]);
    router.replace(`/academies`, { scroll: false });
  };

  const removeQueryChip = () => {
    setQuery('');
  };
  const removeSport = (s: string) => setSports((prev) => prev.filter((x) => x !== s));
  const removeFacility = (s: string) => setFacilities((prev) => prev.filter((x) => x !== s));
  const removeLevel = (s: string) => setLevels((prev) => prev.filter((x) => x !== s));
  const removeStatus = (s: string) => setStatuses((prev) => prev.filter((x) => x !== s));

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sports.length) params.set('sport', sports.join(','));
    else params.delete('sport');
    if (facilities.length) params.set('facility', facilities.join(','));
    else params.delete('facility');
    if (levels.length) params.set('level', levels.join(','));
    else params.delete('level');
    if (statuses.length) params.set('status', statuses.join(','));
    else params.delete('status');
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sports, facilities, levels, statuses]);

  const chips: Array<{ key: string; label: string; layoutId?: string; onRemove: () => void }> = [];
  if (query) {
    chips.push({ key: 'q', label: `"${query}"`, onRemove: removeQueryChip });
  }
  for (const s of sports) {
    const opt = dynamicSportOptions.find((o) => o.value === s);
    chips.push({
      key: `sport-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-sport-${s}`,
      onRemove: () => removeSport(s),
    });
  }
  for (const s of facilities) {
    const opt = dynamicFacilityOptions.find((o) => o.value === s);
    chips.push({
      key: `facility-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-facility-${s}`,
      onRemove: () => removeFacility(s),
    });
  }
  for (const s of levels) {
    const opt = dynamicLevelOptions.find((o) => o.value === s);
    chips.push({
      key: `level-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-level-${s}`,
      onRemove: () => removeLevel(s),
    });
  }
  for (const s of statuses) {
    const opt = dynamicStatusOptions.find((o) => o.value === s);
    chips.push({
      key: `status-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-status-${s}`,
      onRemove: () => removeStatus(s),
    });
  }

  if (loading && results.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <SearchInput
          value=""
          onValueChange={() => {}}
          label="Search academies"
          placeholder="Search academies by name, city, or sport…"
          size="lg"
          disabled
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading academies…</span>
        </div>
      </div>
    );
  }

  if (error && results.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <SearchInput
          value=""
          onValueChange={() => {}}
          label="Search academies"
          placeholder="Search academies by name, city, or sport…"
          size="lg"
          disabled
        />
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive/40" />
          <div>
            <p className="text-foreground font-medium">Failed to load academies</p>
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
            label="Search academies"
            placeholder="Search academies by name, city, or sport…"
            size="lg"
          />
        </div>
        <FilterDrawer
          appliedCount={sports.length + facilities.length + levels.length + statuses.length}
          onClear={() => {
            setSports([]);
            setFacilities([]);
            setLevels([]);
            setStatuses([]);
          }}
        >
          <FilterGroup
            title="Sport"
            options={dynamicSportOptions}
            selected={sports}
            onChange={setSports}
            maxHeight="200px"
            layoutIdPrefix="filter-sport"
          />
          <Separator />
          <FilterGroup
            title="Facility"
            options={dynamicFacilityOptions}
            selected={facilities}
            onChange={setFacilities}
            layoutIdPrefix="filter-facility"
          />
          <Separator />
          <FilterGroup
            title="Training level"
            options={dynamicLevelOptions}
            selected={levels}
            onChange={setLevels}
            layoutIdPrefix="filter-level"
          />
          <Separator />
          <FilterGroup
            title="Verification"
            options={dynamicStatusOptions}
            selected={statuses}
            onChange={setStatuses}
            layoutIdPrefix="filter-status"
          />
        </FilterDrawer>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <Badge
              key={c.key}
              variant="secondary"
              className="gap-1 pr-1"
              data-layout-id={c.layoutId}
            >
              {c.label}
              <button
                onClick={c.onRemove}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove filter ${c.label}`}
              >
                <X className="h-3 w-3" />
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
        {results.length} of {total || allAcademies.length} academies
      </p>

      <AcademyGrid
        academies={results}
        onClear={() => {
          setQuery('');
          setSports([]);
          setFacilities([]);
          setLevels([]);
          setStatuses([]);
        }}
      />
    </div>
  );
}
