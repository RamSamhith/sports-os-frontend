'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getSessions, revokeSession, revokeAllSessions, type Session } from '@/lib/api/auth';
import { LogOut, Monitor, Smartphone, Globe, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device = 'Desktop';

  if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) device = 'Mobile';
  else if (ua.includes('iPad')) device = 'Tablet';

  return { browser, os, device };
}

export default function SettingsSessionPage() {
  const { profile, role, signOut } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    const res = await getSessions();
    if (res.ok) {
      setSessions(res.data.sessions);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  async function handleRevokeOne(sessionId: string) {
    setRevoking(sessionId);
    const res = await revokeSession(sessionId);
    if (res.ok) {
      toast.success('Session revoked');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } else {
      toast.error(res.error.message);
    }
    setRevoking(null);
  }

  async function handleRevokeAll() {
    setRevokingAll(true);
    const res = await revokeAllSessions();
    if (res.ok) {
      toast.success(`Revoked ${res.data.count} session(s)`);
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    } else {
      toast.error(res.error.message);
    }
    setRevokingAll(false);
  }

  function handleSignOut() {
    signOut();
    router.push('/welcome');
  }

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Sessions</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Manage your active sessions and devices.
        </p>
      </header>

      {/* Current Account */}
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

          <Button variant="destructive" onClick={handleSignOut} className="w-fit gap-2">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                {loading ? 'Loading...' : `${sessions.length} active session(s)`}
              </CardDescription>
            </div>
            {otherSessions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAll}
                disabled={revokingAll}
                className="gap-1.5"
              >
                {revokingAll ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                Revoke all others
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No active sessions found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((session) => {
                const parsed = parseUserAgent(session.userAgent);
                const Icon = parsed.device === 'Mobile' ? Smartphone : parsed.device === 'Tablet' ? Smartphone : Monitor;

                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{parsed.browser}</p>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-[10px]">Current</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {parsed.os} · {parsed.device}
                        {session.ipAddress && ` · ${session.ipAddress}`}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        Last active: {new Date(session.lastUsedAt).toLocaleString()}
                      </p>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeOne(session.id)}
                        disabled={revoking === session.id}
                        className="shrink-0 text-destructive hover:text-destructive"
                      >
                        {revoking === session.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <LogOut className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
