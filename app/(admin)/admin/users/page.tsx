import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Read-only user directory.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">User table will be wired in a later phase.</CardContent>
    </Card>
  );
}
