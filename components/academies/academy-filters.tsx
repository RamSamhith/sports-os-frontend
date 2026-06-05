'use client';

import * as React from 'react';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { Checkbox } from '@/components/ui/checkbox';
import { academyFilterFacilities, academyFilterLevels } from '@/lib/constants/filters';
import { Separator } from '@/components/ui/separator';

export function AcademyFilters() {
  return (
    <FilterDrawer>
      <div>
        <h3 className="text-sm font-semibold">Facilities</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {academyFilterFacilities.map((f) => (
            <label key={f.value} className="flex items-center gap-2 text-sm">
              <Checkbox />
              {f.label}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold">Training level</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {academyFilterLevels.map((l) => (
            <label key={l.value} className="flex items-center gap-2 text-sm">
              <Checkbox />
              {l.label}
            </label>
          ))}
        </div>
      </div>
    </FilterDrawer>
  );
}
