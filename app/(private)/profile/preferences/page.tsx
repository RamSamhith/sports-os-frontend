'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { RADIUS_OPTIONS } from '@/lib/constants/radii';
import { CheckCircle2, Pencil } from 'lucide-react';

const STORAGE_KEY = 'sportsos:preferences';
const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'competitive', label: 'Competitive' },
] as const;

interface PreferencesState {
  city: string;
  radius: number;
  sports: string[];
  skillLevel: string;
  goals: string;
}

interface PreferencesErrors {
  city?: string;
}

function readPreferences(): PreferencesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { city: '', radius: 5, sports: [], skillLevel: '', goals: '' };
    const parsed = JSON.parse(raw);
    return {
      city: typeof parsed.city === 'string' ? parsed.city : '',
      radius: typeof parsed.radius === 'number' ? parsed.radius : 5,
      sports: Array.isArray(parsed.sports) ? parsed.sports.filter((s: unknown) => typeof s === 'string') : [],
      skillLevel: typeof parsed.skillLevel === 'string' ? parsed.skillLevel : '',
      goals: typeof parsed.goals === 'string' ? parsed.goals : '',
    };
  } catch {
    return { city: '', radius: 5, sports: [], skillLevel: '', goals: '' };
  }
}

function writePreferences(state: PreferencesState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export default function PreferencesPage() {
  const { role } = useAuth();
  const { athleteData, parentData } = useOnboarding();
  const [city, setCity] = useState('');
  const [radius, setRadius] = useState(5);
  const [sports, setSports] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [goals, setGoals] = useState('');
  const [errors, setErrors] = useState<PreferencesErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = readPreferences();
    // Merge onboarding data as defaults if preferences are empty
    const merged = {
      city: stored.city || athleteData?.location || parentData?.location || '',
      radius: stored.radius,
      sports: stored.sports.length > 0
        ? stored.sports
        : athleteData?.sportInterests || parentData?.sportInterests || [],
      skillLevel: stored.skillLevel || athleteData?.skillLevel || parentData?.skillLevel || '',
      goals: stored.goals || athleteData?.goals || '',
    };
    setCity(merged.city);
    setRadius(merged.radius);
    setSports(merged.sports);
    setSkillLevel(merged.skillLevel);
    setGoals(merged.goals);
    setHydrated(true);
  }, [athleteData, parentData]);

  function validate(): PreferencesErrors {
    const e: PreferencesErrors = {};
    if (!city.trim()) e.city = 'City is required';
    return e;
  }

  function validateField(field: string, value: string) {
    const e: PreferencesErrors = {};
    if (field === 'city' && !value.trim()) e.city = 'City is required';
    return e;
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateField(field, value);
    if (fieldErrors.city) {
      setErrors((prev) => ({ ...prev, city: fieldErrors.city }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.city;
        return next;
      });
    }
  }

  function handleChange(field: string, value: string) {
    if (field === 'city') setCity(value);
    setSaved(false);
    if (touched[field]) {
      const fieldErrors = validateField(field, value);
      if (fieldErrors.city) {
        setErrors((prev) => ({ ...prev, city: fieldErrors.city }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.city;
          return next;
        });
      }
    }
  }

  function toggleSport(slug: string) {
    setSports((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      setSaved(false);
      return next;
    });
  }

  function handleSave() {
    setTouched({ city: true });
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const prefs: PreferencesState = {
      city: city.trim(),
      radius,
      sports,
      skillLevel,
      goals: goals.trim(),
    };
    writePreferences(prefs);
    setSaved(true);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              {role === 'parent'
                ? 'Set preferences for your child.'
                : 'Set your sport and search preferences.'}
            </CardDescription>
          </div>
          <Link href="/onboarding/wizard?edit=true" prefetch={false}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit setup
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pref-city">City</Label>
            <Input
              id="pref-city"
              placeholder="Bengaluru"
              value={city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={(e) => handleBlur('city', e.target.value)}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'pref-city-error' : undefined}
              disabled={!hydrated}
            />
            {errors.city && (
              <p id="pref-city-error" role="alert" className="text-destructive text-xs">
                {errors.city}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pref-radius">Default radius</Label>
            <Select
              value={String(radius)}
              onValueChange={(v) => { setRadius(Number(v)); setSaved(false); }}
              disabled={!hydrated}
            >
              <SelectTrigger id="pref-radius" aria-label="Default radius">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RADIUS_OPTIONS.map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r} km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sports interests */}
        <div className="flex flex-col gap-2">
          <Label>Sport interests</Label>
          <div className="flex flex-wrap gap-2">
            {sportTaxonomy.map((s) => {
              const active = sports.includes(s.slug);
              return (
                <Badge
                  key={s.slug}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  aria-label={s.name}
                  tabIndex={0}
                  onClick={() => toggleSport(s.slug)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleSport(s.slug);
                    }
                  }}
                  className="cursor-pointer select-none"
                >
                  {s.name}
                </Badge>
              );
            })}
          </div>
          {sports.length === 0 && (
            <p className="text-muted-foreground text-xs">Select at least one sport.</p>
          )}
        </div>

        {/* Skill Level */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pref-skill-level">Skill level</Label>
          <Select
            value={skillLevel}
            onValueChange={(v) => { setSkillLevel(v); setSaved(false); }}
            disabled={!hydrated}
          >
            <SelectTrigger id="pref-skill-level" aria-label="Skill level">
              <SelectValue placeholder="Select your skill level" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            Helps us suggest better matches for you.
          </p>
        </div>

        {/* Goals */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pref-goals">Goals</Label>
          <Input
            id="pref-goals"
            placeholder="e.g. Join a weekend football team"
            value={goals}
            onChange={(e) => { setGoals(e.target.value); setSaved(false); }}
            disabled={!hydrated}
          />
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-success flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={!hydrated}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
