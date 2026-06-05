'use client';

import * as React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/lib/hooks/use-location';

export function LocationPicker() {
  const { location, source, detect, setManual } = useLocation();
  const [loading, setLoading] = React.useState(false);

  const onDetect = async () => {
    setLoading(true);
    try {
      await detect();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="border-border/60 bg-card/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
        <MapPin className="h-3.5 w-3.5" />
        {location ? `${location.city}, ${location.state}` : 'Set location'}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onDetect}
        disabled={loading}
        aria-label="Detect location"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Detect'}
      </Button>
      <input
        type="text"
        placeholder="Or type a city…"
        className="border-border/60 bg-background/40 hidden h-8 rounded-md border px-2 text-xs md:inline-block"
        onBlur={(e) => {
          const v = e.currentTarget.value.trim();
          if (v) {
            setManual({
              city: v,
              state: '',
              country: 'IN',
              lat: 0,
              lng: 0,
            });
          }
        }}
      />
      {source ? <span className="text-muted-foreground text-[10px] tracking-widest uppercase">via {source}</span> : null}
    </div>
  );
}
