'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from '@/lib/hooks/use-location';
import { RADIUS_OPTIONS } from '@/lib/constants/radii';
import { MapPin, Crosshair, Trash2 } from 'lucide-react';

export default function SettingsLocationPage() {
  const { location, radius, source, detect, setManual, setRadius, clear } = useLocation();
  const [city, setCity] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');

  async function handleDetect() {
    setDetecting(true);
    setDetectError('');
    try {
      await detect();
    } catch {
      setDetectError('Could not detect location. Try entering it manually.');
    } finally {
      setDetecting(false);
    }
  }

  function handleManual() {
    if (!city.trim()) return;
    setManual({
      city: city.trim(),
      state: '',
      country: 'IN',
      lat: 0,
      lng: 0,
    });
    setCity('');
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Location</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Set your location to find nearby academies and events.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Current location
          </CardTitle>
          <CardDescription>
            {location
              ? `Showing results in ${location.city || 'your area'}.`
              : 'No location set. Add one to discover nearby activity.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {location && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {location.city || 'Unknown city'}
                {location.state ? `, ${location.state}` : ''}
              </Badge>
              {source && (
                <Badge variant="outline" className="text-xs">
                  {source === 'gps' ? 'GPS' : source === 'manual' ? 'Manual' : 'IP'}
                </Badge>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleDetect}
              disabled={detecting}
              className="gap-2"
            >
              <Crosshair className="h-4 w-4" />
              {detecting ? 'Detecting...' : 'Detect via GPS'}
            </Button>
            {location && (
              <Button variant="ghost" onClick={clear} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          {detectError && (
            <p className="text-destructive text-xs">{detectError}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual entry</CardTitle>
          <CardDescription>Type a city name to set your location.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="manual-city" className="sr-only">
                City name
              </Label>
              <Input
                id="manual-city"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleManual();
                }}
              />
            </div>
            <Button onClick={handleManual} disabled={!city.trim()}>
              Set city
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search radius</CardTitle>
          <CardDescription>
            How far to search for academies from your location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map((r) => (
              <Button
                key={r}
                variant={radius === r ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRadius(r)}
              >
                {r} km
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
