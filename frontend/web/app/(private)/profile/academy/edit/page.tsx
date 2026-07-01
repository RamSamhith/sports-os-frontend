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
import { getMyAcademy, updateAcademy } from '@/lib/api/academies';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { ArrowLeft } from 'lucide-react';
import { parseLocationInput } from '@/lib/utils/location-parser';
import type { Facility, TrainingLevel } from '@/types/domain/academy';

const FACILITY_OPTIONS: { label: string; value: Facility }[] = [
  { label: 'Indoor Court', value: 'indoor' },
  { label: 'Outdoor Court', value: 'outdoor' },
  { label: 'Gym / Fitness Center', value: 'gym' },
  { label: 'Swimming Pool', value: 'physio' },
  { label: 'Artificial Turf', value: 'ground' },
  { label: 'Track & Field', value: 'ground' },
  { label: 'Shooting Range', value: 'equipment' },
  { label: 'Archery Range', value: 'equipment' },
  { label: 'Recovery Room', value: 'physio' },
  { label: 'Cafeteria', value: 'changing_room' },
  { label: 'Parking', value: 'parking' },
  { label: 'Hostel / Dormitory', value: 'changing_room' },
];

const TRAINING_LEVELS: { value: TrainingLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Professional' },
];

export default function AcademyEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [academyId, setAcademyId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [trainingLevels, setTrainingLevels] = useState<TrainingLevel[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyAcademy();
        if (!cancelled && res.ok && res.data) {
          const a = res.data;
          setAcademyId(a.id);
          setName(a.name);
          setDescription(a.description ?? '');
          setLocation(a.location.city);
          setSports(a.sportsOffered);
          setFacilities(a.facilities);
          setTrainingLevels(a.trainingLevels);
          setPhone(a.contact.phone ?? '');
          setEmail(a.contact.email ?? '');
          setWebsite(a.contact.website ?? '');
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

  async function handleSave() {
    if (!academyId) return;
    setSaving(true);
    try {
      const locationData = parseLocationInput(location);
      const res = await updateAcademy(academyId, {
        name: name.trim(),
        description: description.trim() || undefined,
        location: locationData,
        sportsOffered: sports,
        facilities: facilities,
        trainingLevels: trainingLevels,
        contact: {
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          website: website.trim() || undefined,
        },
      });
      if (res.ok) {
        router.push('/profile/academy');
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

  if (!academyId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-sm">No academy profile found.</div>
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
          <h1 className="text-lg font-bold">Edit Academy</h1>
          <p className="text-muted-foreground text-sm">Update your academy profile.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="academy-name">Academy name</Label>
            <Input id="academy-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="academy-desc">Description</Label>
            <Textarea id="academy-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="academy-location">Location</Label>
            <LocationPicker value={location} onChange={setLocation} placeholder="e.g. Bengaluru" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sports</CardTitle>
          <CardDescription>Select the sports your academy offers.</CardDescription>
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
          <CardTitle>Facilities</CardTitle>
          <CardDescription>What facilities does your academy have?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FACILITY_OPTIONS.map((f) => {
              const active = facilities.includes(f.value);
              return (
                <Badge
                  key={f.value}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => setFacilities((prev) => prev.includes(f.value) ? prev.filter((x) => x !== f.value) : [...prev, f.value])}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setFacilities((prev) => prev.includes(f.value) ? prev.filter((x) => x !== f.value) : [...prev, f.value]);
                    }
                  }}
                  className="cursor-pointer select-none"
                >
                  {f.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TRAINING_LEVELS.map((l) => {
              const active = trainingLevels.includes(l.value);
              return (
                <Badge
                  key={l.value}
                  variant={active ? 'default' : 'outline'}
                  role="checkbox"
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => setTrainingLevels((prev) => prev.includes(l.value) ? prev.filter((x) => x !== l.value) : [...prev, l.value])}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setTrainingLevels((prev) => prev.includes(l.value) ? prev.filter((x) => x !== l.value) : [...prev, l.value]);
                    }
                  }}
                  className="cursor-pointer select-none"
                >
                  {l.label}
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
            <Label htmlFor="academy-phone">Phone</Label>
            <Input id="academy-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="academy-email">Email</Label>
            <Input id="academy-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="academy-website">Website</Label>
            <Input id="academy-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
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
