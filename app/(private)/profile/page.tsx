import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';

export default function ProfilePage() {
  const { role } = useAuth();
  const isParent = role === 'parent';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Welcome back.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {isParent
          ? 'Use the sidebar to manage personal info, children, preferences, saved items, and enquiries.'
          : 'Use the sidebar to manage personal info, preferences, saved items, and enquiries.'}
      </CardContent>
    </Card>
  );
}
