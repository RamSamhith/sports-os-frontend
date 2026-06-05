import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusPill } from './status-pill';

export function LeadDetail() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Lead</CardTitle>
          <CardDescription>Lead header placeholder.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <StatusPill status="new" />
            <span className="text-muted-foreground text-xs">Source: academy_detail</span>
          </div>
          <p>Lead body placeholder — details will be wired in a later phase.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Append-only activity log.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">No activity yet.</CardContent>
      </Card>
    </div>
  );
}
