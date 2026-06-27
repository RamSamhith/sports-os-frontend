'use client';

import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LocationGroup } from '@/lib/location-detector';

interface LocationBadgeProps {
  location: LocationGroup;
}

export function LocationBadge({ location }: LocationBadgeProps) {
  return (
    <Badge variant="info" className="gap-1">
      <MapPin className="h-3 w-3" />
      {location.name}
      <span className="text-muted-foreground ml-1">({location.count})</span>
    </Badge>
  );
}
