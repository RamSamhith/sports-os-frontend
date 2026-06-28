import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {['Funnel', 'Discovery', 'Trust', 'Leads'].map((section) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{section}</CardTitle>
            <CardDescription>Operational dashboard placeholder.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Charts will be wired in a later phase.</CardContent>
        </Card>
      ))}
    </div>
  );
}
