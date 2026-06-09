'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const STORAGE_KEY = 'sportsos:motion';

interface MotionState {
  reducedMotion: boolean;
}

function readMotion(): MotionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { reducedMotion: false };
    const parsed = JSON.parse(raw);
    return { reducedMotion: !!parsed.reducedMotion };
  } catch {
    return { reducedMotion: false };
  }
}

function writeMotion(state: MotionState) {
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

export default function SettingsMotionPage() {
  const [settings, setSettings] = useState<MotionState>({ reducedMotion: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readMotion());
    setHydrated(true);
  }, []);

  function toggleReducedMotion() {
    setSettings((prev) => {
      const next = { reducedMotion: !prev.reducedMotion };
      writeMotion(next);
      if (next.reducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Motion</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Control animations and motion effects throughout the interface.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Reduce motion for users who are sensitive to animations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Row
            label="Reduce motion"
            description="Minimise animations and transitions across the app."
            checked={settings.reducedMotion}
            onCheckedChange={toggleReducedMotion}
            disabled={!hydrated}
          />
        </CardContent>
      </Card>
    </div>
  );
}
