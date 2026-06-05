'use client';

import { FilterDrawer } from '@/components/filters/filter-drawer';
import { Checkbox } from '@/components/ui/checkbox';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { Separator } from '@/components/ui/separator';

export function CoachFilters() {
  return (
    <FilterDrawer>
      <div>
        <h3 className="text-sm font-semibold">Sport</h3>
        <div className="mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-auto pr-1">
          {sportTaxonomy.map((s) => (
            <label key={s.slug} className="flex items-center gap-2 text-sm">
              <Checkbox />
              {s.name}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold">Experience</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><Checkbox /> 1–5 yrs</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox /> 5–10 yrs</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox /> 10+ yrs</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox /> Elite</label>
        </div>
      </div>
    </FilterDrawer>
  );
}
