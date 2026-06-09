'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { LogOut } from 'lucide-react';

export default function SettingsSessionPage() {
  const { profile, role, signOut } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Session</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Manage your active session and sign out.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your current session details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{profile.name || 'No name set'}</p>
            <p className="text-muted-foreground text-xs">{profile.email || 'No email set'}</p>
            {role && (
              <p className="text-muted-foreground text-xs capitalize">Role: {role}</p>
            )}
          </div>

          <Button variant="destructive" onClick={signOut} className="w-fit gap-2">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
