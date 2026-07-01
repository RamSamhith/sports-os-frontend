'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LocationPicker } from '@/components/ui/location-picker';
import { getMyCoach, updateCoach } from '@/lib/api/coaches';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { ArrowLeft } from 'lucide-react';
import { parseLocationInput } from '@/lib/utils/location-parser';

export default function CoachEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coachId, setCoachId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyCoach();
        if (!cancelled && res.ok && res.data) {
          const c = res.data;
          setCoachId(c.id);
          setName(c.name);
          setBio(c.bio ?? '');
          setLocation(c.location.city);
          setSports(c.sportsCoached);
          setSpecialization(c.specialization);
          setExperienceYears(String(c.experienceYears));
          setPhone(c.contact.phone ?? '');
          setEmail(c.contact.email ?? '');
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function toggleSport(slug: string) {
    setSports((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  }

  function toggleSpecialization(slug: string) {
    setSpecialization((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  }

  async function handleSave() {
    if (!coachId) return;
    setSaving(true);
    try {
      const locationData = parseLocationInput(location);
      const res = await updateCoach(coachId, {
        name: name.trim(),
        bio: bio.trim() || undefined,
        location: locationData,
        sportsCoached: sports,
        specialization: specialization,
        experienceYears: Number(experienceYears) || 0,
        contact: {
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        },
      });
      if (res.ok) {
        router.push('/profile/coach');
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!coachId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-sm">No coach profile found.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-lg font-bold">Edit Coach Profile</h1>
          <p className="text-muted-foreground text-sm">Update your coaching profile.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coach-name">Name</Label>
            <Input id="coach-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coach-bio">Bio</Label>
            <Textarea id="coach-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coach-location">Location</Label>
            <LocationPicker value={location} onChange={setLocation} placeholder="e.g. Bengaluru" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coach-experience">Years of experience</Label>
            <Input
              id="coach-experience"
              type="text"
              inputMode="numeric"
              value={experienceYears}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val === '' || (Number(val) >= 0 && Number(val) <= 50)) setExperienceYears(val);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sports Coached</CardTitle>
          <CardDescription>Select the sports you coach.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sportTaxonomy.map((s) => {
              const active = sports.includes(s.slug);
              return (
                <Badge
                  key={s.slug}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => toggleSport(s.slug)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleSport(s.slug); }
                  }}
                  className="cursor-pointer select-none"
                >
                  {s.name}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specialization</CardTitle>
          <CardDescription>What are your areas of expertise?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sportTaxonomy.map((s) => {
              const active = specialization.includes(s.slug);
              return (
                <Badge
                  key={s.slug}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => toggleSpecialization(s.slug)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleSpecialization(s.slug); }
                  }}
                  className="cursor-pointer select-none"
                >
                  {s.name}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coach-phone">Phone</Label>
            <Input id="coach-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coach-email">Email</Label>
            <Input id="coach-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || !name.trim()} className="flex-1">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
