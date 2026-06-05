import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Privacy and consent.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row label="Analytics" description="Help us improve discovery." />
          <Row label="Marketing" description="Receive updates and offers." />
          <Row label="WhatsApp" description="Transactional confirmations." />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button variant="destructive">Sign out</Button>
      </div>
    </div>
  );
}

function Row({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch />
    </div>
  );
}
