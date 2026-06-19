'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { GuestGuard } from '@/components/auth/guest-guard';

const STORAGE_KEY = 'sportsos:notifications';

interface NotificationState {
  emailNotifications: boolean;
  marketingUpdates: boolean;
  whatsappNotifications: boolean;
}

function readNotifications(): NotificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { emailNotifications: true, marketingUpdates: false, whatsappNotifications: true };
    const parsed = JSON.parse(raw);
    return {
      emailNotifications: !!parsed.emailNotifications,
      marketingUpdates: !!parsed.marketingUpdates,
      whatsappNotifications: !!parsed.whatsappNotifications,
    };
  } catch {
    return { emailNotifications: true, marketingUpdates: false, whatsappNotifications: true };
  }
}

function writeNotifications(state: NotificationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
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

export default function SettingsNotificationsPage() {
  const [settings, setSettings] = useState<NotificationState>({
    emailNotifications: true,
    marketingUpdates: false,
    whatsappNotifications: true,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readNotifications());
    setHydrated(true);
  }, []);

  function toggle(key: keyof NotificationState) {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      writeNotifications(next);
      return next;
    });
  }

  return (
    <GuestGuard actionLabel="Sign in to manage notifications">
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Choose how you want to be notified about updates and activity.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <CardDescription>Manage which emails you receive.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row
            label="Email notifications"
            description="General updates about your account and activity."
            checked={settings.emailNotifications}
            onCheckedChange={() => toggle('emailNotifications')}
            disabled={!hydrated}
          />
          <Row
            label="Marketing updates"
            description="News, tips, and promotional offers."
            checked={settings.marketingUpdates}
            onCheckedChange={() => toggle('marketingUpdates')}
            disabled={!hydrated}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp notifications</CardTitle>
          <CardDescription>Receive transactional messages via WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row
            label="WhatsApp notifications"
            description="Enquiry confirmations and booking updates."
            checked={settings.whatsappNotifications}
            onCheckedChange={() => toggle('whatsappNotifications')}
            disabled={!hydrated}
          />
        </CardContent>
      </Card>
    </div>
    </GuestGuard>
  );
}
