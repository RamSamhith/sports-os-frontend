'use client';

import { useState } from 'react';
import { ShortlistView } from './shortlist-view';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ShortlistTabs() {
  const [tab, setTab] = useState<'academy' | 'coach'>('academy');

  return (
    <>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'academy' | 'coach')}>
        <TabsList>
          <TabsTrigger value="academy">Academies</TabsTrigger>
          <TabsTrigger value="coach">Coaches</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">
        <ShortlistView entityType={tab} />
      </div>
    </>
  );
}
