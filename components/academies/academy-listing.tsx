'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { FilterGroup } from '@/components/filters/filter-group';
import { Separator } from '@/components/ui/separator';
import { AcademyGrid } from '@/components/academies/academy-grid';
import { academyFilterFacilities, academyFilterLevels, verificationStatuses } from '@/lib/constants/filters';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { academies } from '@/data/academies';

const sportOptions = sportTaxonomy.map((s) => ({
  value: s.slug,
  label: s.name,
  count: academies.filter((a) => a.sportsOffered.includes(s.slug)).length,
}));

const facilityOptions = academyFilterFacilities.map((f) => ({
  value: f.value,
  label: f.label,
  count: academies.filter((a) => a.facilities.includes(f.value as never)).length,
}));

const levelOptions = academyFilterLevels.map((l) => ({
  value: l.value,
  label: l.label,
  count: academies.filter((a) => a.trainingLevels.includes(l.value as never)).length,
}));

const statusOptions = verificationStatuses.map((s) => ({
  value: s.value,
  label: s.label,
  count: academies.filter((a) => a.verificationStatus === s.value).length,
}));

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function readListFromParams(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AcademyListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL once
  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');
  const debouncedQuery = useDebounced(query, 250);

  const [sports, setSports] = React.useState<string[]>(() => readListFromParams(searchParams, 'sport'));
  const [facilities, setFacilities] = React.useState<string[]>(() => readListFromParams(searchParams, 'facility'));
  const [levels, setLevels] = React.useState<string[]>(() => readListFromParams(searchParams, 'level'));
  const [statuses, setStatuses] = React.useState<string[]>(() => readListFromParams(searchParams, 'status'));

  // Apply debounced query to URL (search input)
  React.useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if ((debouncedQuery || '') === current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set('q', debouncedQuery);
    else params.delete('q');
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const appliedCount =
    sports.length + facilities.length + levels.length + statuses.length + (debouncedQuery ? 1 : 0);

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

  // Sync filter changes to URL (filter changes are immediate, not debounced)
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

  // Apply filters
  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return academies.filter((a) => {
      if (sports.length && !sports.some((s) => a.sportsOffered.includes(s))) return false;
      if (facilities.length && !facilities.every((f) => a.facilities.includes(f as never))) return false;
      if (levels.length && !levels.some((l) => a.trainingLevels.includes(l as never))) return false;
      if (statuses.length && !statuses.includes(a.verificationStatus)) return false;
      if (q) {
        const haystack = [
          a.name,
          a.description,
          a.location.city,
          a.location.state,
          ...a.sportsOffered,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [debouncedQuery, sports, facilities, levels, statuses]);

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (debouncedQuery) {
    chips.push({ key: 'q', label: `“${debouncedQuery}”`, onRemove: removeQueryChip });
  }
  for (const s of sports) {
    const opt = sportOptions.find((o) => o.value === s);
    chips.push({ key: `sport-${s}`, label: opt?.label ?? s, onRemove: () => removeSport(s) });
  }
  for (const s of facilities) {
    const opt = facilityOptions.find((o) => o.value === s);
    chips.push({ key: `facility-${s}`, label: opt?.label ?? s, onRemove: () => removeFacility(s) });
  }
  for (const s of levels) {
    const opt = levelOptions.find((o) => o.value === s);
    chips.push({ key: `level-${s}`, label: opt?.label ?? s, onRemove: () => removeLevel(s) });
  }
  for (const s of statuses) {
    const opt = statusOptions.find((o) => o.value === s);
    chips.push({ key: `status-${s}`, label: opt?.label ?? s, onRemove: () => removeStatus(s) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search academies by name, city, or sport…"
            className="h-11 pl-10 text-sm"
            aria-label="Search academies"
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
        <FilterDrawer
          appliedCount={appliedCount - (debouncedQuery ? 1 : 0)}
          onClear={() => {
            setSports([]);
            setFacilities([]);
            setLevels([]);
            setStatuses([]);
          }}
        >
          <FilterGroup title="Sport" options={sportOptions} selected={sports} onChange={setSports} maxHeight="200px" />
          <Separator />
          <FilterGroup title="Facility" options={facilityOptions} selected={facilities} onChange={setFacilities} />
          <Separator />
          <FilterGroup title="Training level" options={levelOptions} selected={levels} onChange={setLevels} />
          <Separator />
          <FilterGroup title="Verification" options={statusOptions} selected={statuses} onChange={setStatuses} />
        </FilterDrawer>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <Badge key={c.key} variant="secondary" className="gap-1 pr-1">
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
          {appliedCount > 1 ? (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          ) : null}
        </div>
      ) : null}

      <p className="text-muted-foreground text-sm">
        {filtered.length} of {academies.length} academies
      </p>

      <AcademyGrid academies={filtered} />
    </div>
  );
}
