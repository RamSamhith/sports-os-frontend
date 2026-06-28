'use client';

import * as React from 'react';
import { RADIUS_OPTIONS } from '@/lib/constants/radii';
import { useLocation } from '@/lib/hooks/use-location';
import { cn } from '@/lib/utils/cn';

export function RadiusControl({ className }: { className?: string }) {
  const { radius, setRadius } = useLocation();
  return (
    <div className={cn('border-border/60 bg-card/40 inline-flex items-center gap-1 rounded-full border p-1', className)}>
      {RADIUS_OPTIONS.map((r) => (
        <button
          key={r}
          onClick={() => setRadius(r)}
          aria-pressed={radius === r}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            radius === r ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {r} km
        </button>
      ))}
    </div>
  );
}
