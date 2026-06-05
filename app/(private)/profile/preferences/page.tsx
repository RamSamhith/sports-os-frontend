import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function PreferencesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Sport interests, location, and goals.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>City</Label>
          <Input placeholder="Bengaluru" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Default radius (km)</Label>
          <Input type="number" min={1} max={50} placeholder="5" />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
