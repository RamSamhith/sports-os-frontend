'use client';

import * as React from 'react';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { FilterGroup } from '@/components/filters/filter-group';
import { Separator } from '@/components/ui/separator';
import { verificationStatuses } from '@/lib/constants/filters';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { coaches } from '@/data/coaches';

const statusCount = (value: string) =>
  coaches.filter((c) => c.verificationStatus === value).length;
const sportCount = (value: string) =>
  coaches.filter((c) => c.sportsCoached.includes(value)).length;

const sportOptions = sportTaxonomy.map((s) => ({
  value: s.slug,
  label: s.name,
  count: sportCount(s.slug),
}));

const statusOptions = verificationStatuses.map((s) => ({
  value: s.value,
  label: s.label,
  count: statusCount(s.value),
}));

const experienceOptions = [
  { value: '1-5', label: '1–5 yrs', count: coaches.filter((c) => c.experienceYears >= 1 && c.experienceYears <= 5).length },
  { value: '5-10', label: '5–10 yrs', count: coaches.filter((c) => c.experienceYears > 5 && c.experienceYears <= 10).length },
  { value: '10+', label: '10+ yrs', count: coaches.filter((c) => c.experienceYears > 10).length },
  { value: 'elite', label: 'Elite (15+)', count: coaches.filter((c) => c.experienceYears >= 15).length },
];

export function CoachFilters() {
  const [sports, setSports] = React.useState<string[]>([]);
  const [experience, setExperience] = React.useState<string[]>([]);
  const [statuses, setStatuses] = React.useState<string[]>([]);
  const [applied, setApplied] = React.useState({
    sports: [] as string[],
    experience: [] as string[],
    statuses: [] as string[],
  });

  const draftCount = sports.length + experience.length + statuses.length;
  const appliedCount = applied.sports.length + applied.experience.length + applied.statuses.length;

  const onApply = () => {
    setApplied({ sports, experience, statuses });
  };
  const onClear = () => {
    setSports([]);
    setExperience([]);
    setStatuses([]);
    setApplied({ sports: [], experience: [], statuses: [] });
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
        title="Experience"
        options={experienceOptions}
        selected={experience}
        onChange={setExperience}
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
