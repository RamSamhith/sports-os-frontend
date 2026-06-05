import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusPill } from './status-pill';

const columns: Array<{ key: string; label: string }> = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'trial_scheduled', label: 'Trial scheduled' },
  { key: 'converted', label: 'Converted' },
  { key: 'lost', label: 'Lost' },
];

export function LeadBoard() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {columns.map((c) => (
        <Card key={c.key} className="bg-card/40">
          <CardHeader className="p-3">
            <CardTitle className="text-xs">
              <span className="text-muted-foreground tracking-widest uppercase">{c.label}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-3 pt-0">
            <div className="border-border/40 bg-background/40 rounded-md border p-3 text-xs">
              <p className="font-medium">Lead preview</p>
              <p className="text-muted-foreground mt-1">Empty state placeholder.</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusPill status={c.key as 'new'} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
