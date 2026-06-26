'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { syncConsent } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

const STORAGE_KEY = 'sportsos:privacy';

interface PrivacyState {
  profileVisibility: boolean;
  analyticsConsent: boolean;
  personalizedRecommendations: boolean;
}

function readPrivacy(): PrivacyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profileVisibility: true, analyticsConsent: true, personalizedRecommendations: true };
    const parsed = JSON.parse(raw);
    return {
      profileVisibility: parsed.profileVisibility !== undefined ? !!parsed.profileVisibility : true,
      analyticsConsent: parsed.analyticsConsent !== undefined ? !!parsed.analyticsConsent : true,
      personalizedRecommendations: parsed.personalizedRecommendations !== undefined ? !!parsed.personalizedRecommendations : true,
    };
  } catch {
    return { profileVisibility: true, analyticsConsent: true, personalizedRecommendations: true };
  }
}

function writePrivacy(state: PrivacyState) {
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

export default function SettingsPrivacyPage() {
  const { isAuthenticated, isGuest } = useAuth();
  const [settings, setSettings] = useState<PrivacyState>({
    profileVisibility: true,
    analyticsConsent: true,
    personalizedRecommendations: true,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readPrivacy());
    setHydrated(true);
  }, []);

  async function toggle(key: keyof PrivacyState) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    writePrivacy(next);

    // Sync consent to backend if authenticated
    if (isAuthenticated && !isGuest) {
      const res = await syncConsent({
        analytics: next.analyticsConsent,
        marketing: false,
        whatsapp: true,
      });
      if (!res.ok) {
        toast.error('Failed to sync privacy settings');
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Privacy</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Control your data sharing, visibility, and personalisation settings.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>Control who can see your profile.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row
            label="Profile visibility"
            description="Allow academies to see your profile."
            checked={settings.profileVisibility}
            onCheckedChange={() => toggle('profileVisibility')}
            disabled={!hydrated}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & personalisation</CardTitle>
          <CardDescription>Manage how your data is used to improve your experience.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row
            label="Analytics consent"
            description="Help us improve discovery by sharing anonymous usage data."
            checked={settings.analyticsConsent}
            onCheckedChange={() => toggle('analyticsConsent')}
            disabled={!hydrated}
          />
          <Row
            label="Personalised recommendations"
            description="Get tailored suggestions based on your interests and activity."
            checked={settings.personalizedRecommendations}
            onCheckedChange={() => toggle('personalizedRecommendations')}
            disabled={!hydrated}
          />
        </CardContent>
      </Card>
    </div>
  );
}
