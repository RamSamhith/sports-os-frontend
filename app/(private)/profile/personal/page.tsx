import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function PersonalPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Keep your details up to date.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Full name</Label>
          <Input placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Phone</Label>
          <Input type="tel" placeholder="+91…" />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
