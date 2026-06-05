import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {['New leads', 'Enquiry volume', 'Verified academies', 'Pending verifications'].map((kpi) => (
        <Card key={kpi}>
          <CardHeader className="pb-2">
            <CardDescription>{kpi}</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">Last 7 days</CardContent>
        </Card>
      ))}
    </div>
  );
}
