'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
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

  const [sports, setSports] = React.useState<string[]>(() => readListFromParams(searchParams, 'sport'));
  const [facilities, setFacilities] = React.useState<string[]>(() => readListFromParams(searchParams, 'facility'));
  const [levels, setLevels] = React.useState<string[]>(() => readListFromParams(searchParams, 'level'));
  const [statuses, setStatuses] = React.useState<string[]>(() => readListFromParams(searchParams, 'status'));

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

  // Apply filters using IMMEDIATE query for instant feedback
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
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
  }, [query, sports, facilities, levels, statuses]);

  const chips: Array<{ key: string; label: string; layoutId?: string; onRemove: () => void }> = [];
  if (query) {
    chips.push({ key: 'q', label: `“${query}”`, onRemove: removeQueryChip });
  }
  for (const s of sports) {
    const opt = sportOptions.find((o) => o.value === s);
    chips.push({
      key: `sport-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-sport-${s}`,
      onRemove: () => removeSport(s),
    });
  }
  for (const s of facilities) {
    const opt = facilityOptions.find((o) => o.value === s);
    chips.push({
      key: `facility-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-facility-${s}`,
      onRemove: () => removeFacility(s),
    });
  }
  for (const s of levels) {
    const opt = levelOptions.find((o) => o.value === s);
    chips.push({
      key: `level-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-level-${s}`,
      onRemove: () => removeLevel(s),
    });
  }
  for (const s of statuses) {
    const opt = statusOptions.find((o) => o.value === s);
    chips.push({
      key: `status-${s}`,
      label: opt?.label ?? s,
      layoutId: `filter-status-${s}`,
      onRemove: () => removeStatus(s),
    });
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
            options={sportOptions}
            selected={sports}
            onChange={setSports}
            maxHeight="200px"
            layoutIdPrefix="filter-sport"
          />
          <Separator />
          <FilterGroup
            title="Facility"
            options={facilityOptions}
            selected={facilities}
            onChange={setFacilities}
            layoutIdPrefix="filter-facility"
          />
          <Separator />
          <FilterGroup
            title="Training level"
            options={levelOptions}
            selected={levels}
            onChange={setLevels}
            layoutIdPrefix="filter-level"
          />
          <Separator />
          <FilterGroup
            title="Verification"
            options={statusOptions}
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
          {appliedCount > 1 ? (
            <Button variant="ghost" className="min-h-[44px] min-w-[44px]" onClick={clearAll}>
              Clear all
            </Button>
          ) : null}
        </div>
      ) : null}

      <p className="text-muted-foreground text-sm">
        {filtered.length} of {academies.length} academies
      </p>

      <AcademyGrid
        academies={filtered}
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
