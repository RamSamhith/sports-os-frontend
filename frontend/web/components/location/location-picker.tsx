'use client';

import * as React from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/lib/hooks/use-location';

export function LocationPicker() {
  const { location, source, detect, setManual } = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [manualCity, setManualCity] = React.useState('');

  const onDetect = async () => {
    setLoading(true);
    setError('');
    try {
      await detect();
    } catch {
      setError('Location access denied. Enter a city manually.');
    } finally {
      setLoading(false);
    }
  };

  const onManualSubmit = () => {
    const v = manualCity.trim();
    if (v) {
      setManual({ city: v, state: '', country: 'IN', lat: 0, lng: 0 });
      setManualCity('');
    }
  };

  const displayLabel = location
    ? location.city
      ? `${location.city}, ${location.state || location.country}`
      : `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`
    : 'Set location';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="border-border/60 bg-card/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5" />
          <span>{displayLabel}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDetect}
          disabled={loading}
          aria-label="Detect current location"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
          {!loading && 'Detect'}
        </Button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter city name…"
          value={manualCity}
          onChange={(e) => setManualCity(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onManualSubmit(); }}
          className="border-border/60 bg-background/40 h-8 flex-1 rounded-md border px-2 text-xs"
        />
        <Button size="sm" variant="outline" onClick={onManualSubmit} disabled={!manualCity.trim()}>
          Set
        </Button>
      </div>
      {source && (
        <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
          via {source}
        </span>
      )}
    </div>
  );
}
