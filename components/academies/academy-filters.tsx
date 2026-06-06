'use client';

import * as React from 'react';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { FilterGroup } from '@/components/filters/filter-group';
import { Separator } from '@/components/ui/separator';
import { academyFilterFacilities, academyFilterLevels, verificationStatuses } from '@/lib/constants/filters';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { academies } from '@/data/academies';

const facilityCount = (value: string) =>
  academies.filter((a) => a.facilities.includes(value as never)).length;
const levelCount = (value: string) =>
  academies.filter((a) => a.trainingLevels.includes(value as never)).length;
const statusCount = (value: string) =>
  academies.filter((a) => a.verificationStatus === value).length;
const sportCount = (value: string) =>
  academies.filter((a) => a.sportsOffered.includes(value)).length;

const sportOptions = sportTaxonomy.map((s) => ({
  value: s.slug,
  label: s.name,
  count: sportCount(s.slug),
}));

const facilityOptions = academyFilterFacilities.map((f) => ({
  value: f.value,
  label: f.label,
  count: facilityCount(f.value),
}));

const levelOptions = academyFilterLevels.map((l) => ({
  value: l.value,
  label: l.label,
  count: levelCount(l.value),
}));

const statusOptions = verificationStatuses.map((s) => ({
  value: s.value,
  label: s.label,
  count: statusCount(s.value),
}));

export function AcademyFilters() {
  const [facilities, setFacilities] = React.useState<string[]>([]);
  const [levels, setLevels] = React.useState<string[]>([]);
  const [sports, setSports] = React.useState<string[]>([]);
  const [statuses, setStatuses] = React.useState<string[]>([]);
  const [applied, setApplied] = React.useState({
    facilities: [] as string[],
    levels: [] as string[],
    sports: [] as string[],
    statuses: [] as string[],
  });

  const draftCount = facilities.length + levels.length + sports.length + statuses.length;
  const appliedCount =
    applied.facilities.length + applied.levels.length + applied.sports.length + applied.statuses.length;

  const onApply = () => {
    setApplied({ facilities, levels, sports, statuses });
  };
  const onClear = () => {
    setFacilities([]);
    setLevels([]);
    setSports([]);
    setStatuses([]);
    setApplied({ facilities: [], levels: [], sports: [], statuses: [] });
  };

  return (
    <FilterDrawer appliedCount={appliedCount} onApply={onApply} onClear={onClear}>
      <FilterGroup
        title="Sport"
        options={sportOptions}
        selected={sports}
        onChange={setSports}
        maxHeight="180px"
      />
      <Separator />
      <FilterGroup
        title="Facility"
        options={facilityOptions}
        selected={facilities}
        onChange={setFacilities}
      />
      <Separator />
      <FilterGroup
        title="Training level"
        options={levelOptions}
        selected={levels}
        onChange={setLevels}
      />
      <Separator />
      <FilterGroup
        title="Verification"
        options={statusOptions}
        selected={statuses}
        onChange={setStatuses}
      />
      <p className="text-muted-foreground text-xs">
        {draftCount === 0
          ? 'No filters selected'
          : `${draftCount} filter${draftCount === 1 ? '' : 's'} in this drawer. Tap Apply to update results.`}
      </p>
    </FilterDrawer>
  );
}
