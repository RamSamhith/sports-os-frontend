'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/hooks/use-auth';

const STORAGE_KEY = 'sportsos:settings';

interface SettingsState {
  analytics: boolean;
  marketing: boolean;
  whatsapp: boolean;
}

function readSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { analytics: true, marketing: false, whatsapp: true };
    const parsed = JSON.parse(raw);
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      whatsapp: !!parsed.whatsapp,
    };
  } catch {
    return { analytics: true, marketing: false, whatsapp: true };
  }
}

function writeSettings(state: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [settings, setSettings] = useState<SettingsState>({
    analytics: true,
    marketing: false,
    whatsapp: true,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
    setHydrated(true);
  }, []);

  function toggle(key: keyof SettingsState) {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      writeSettings(next);
      return next;
    });
  }

  function handleSignOut() {
    signOut();
    router.push('/welcome');
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Privacy and consent.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row
            label="Analytics"
            description="Help us improve discovery."
            checked={settings.analytics}
            onCheckedChange={() => toggle('analytics')}
            disabled={!hydrated}
          />
          <Row
            label="Marketing"
            description="Receive updates and offers."
            checked={settings.marketing}
            onCheckedChange={() => toggle('marketing')}
            disabled={!hydrated}
          />
          <Row
            label="WhatsApp"
            description="Transactional confirmations."
            checked={settings.whatsapp}
            onCheckedChange={() => toggle('whatsapp')}
            disabled={!hydrated}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}
