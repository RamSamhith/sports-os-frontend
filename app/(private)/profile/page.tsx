import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Welcome back.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Use the sidebar to manage personal info, children, preferences, saved items, and enquiries.
      </CardContent>
    </Card>
  );
}
