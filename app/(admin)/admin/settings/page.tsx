import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Feature flags and platform settings.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Row label="Enable AI search" />
        <Row label="Enable notifications" />
        <Row label="Maintenance mode" />
      </CardContent>
    </Card>
  );
}

function Row({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{label}</p>
      <Switch />
    </div>
  );
}
