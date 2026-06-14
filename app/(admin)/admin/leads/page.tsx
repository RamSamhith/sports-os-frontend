'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/empty-state';

const columns: Array<{ key: string; label: string }> = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'trial_scheduled', label: 'Trial scheduled' },
  { key: 'converted', label: 'Converted' },
  { key: 'lost', label: 'Lost' },
];

export default function AdminLeadsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {columns.map((c) => (
          <Card key={c.key} className="bg-card/40">
            <CardHeader className="p-3">
              <CardTitle className="text-xs">
                <span className="text-muted-foreground tracking-widest uppercase">{c.label}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-3 pt-0">
              <EmptyState title="No leads" className="border-none p-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
