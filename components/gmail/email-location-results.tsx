'use client';

import { MapPin, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EmailLocationResult } from '@/lib/location-detector';

interface EmailLocationResultsProps {
  results: EmailLocationResult[];
  tab: 'emails' | 'summary';
}

export function EmailLocationResults({ results, tab }: EmailLocationResultsProps) {
  if (tab === 'emails') {
    return (
      <div className="flex flex-col gap-2">
        {results.map((email) => (
          <div
            key={email.id}
            className={`rounded-lg border p-3 transition-colors ${
              email.hasLocation
                ? 'border-primary/40 bg-primary/5'
                : 'border-border'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {email.subject || '(no subject)'}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs truncate">
                  {email.from}
                </p>
              </div>
              {email.hasLocation && (
                <Badge variant="info" className="shrink-0 gap-1">
                  <MapPin className="h-3 w-3" />
                  {email.places.length + email.pincodes.length}
                </Badge>
              )}
            </div>
            {email.hasLocation && (
              <div className="mt-2 flex flex-wrap gap-1">
                {email.places.map((place) => (
                  <Badge key={place} variant="secondary" className="text-xs">
                    {place}
                  </Badge>
                ))}
                {email.pincodes.map((pin) => (
                  <Badge key={pin} variant="outline" className="text-xs">
                    {pin}
                  </Badge>
                ))}
                {email.addressLines.map((addr) => (
                  <Badge key={addr} variant="outline" className="text-xs">
                    {addr}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Summary tab
  return (
    <div className="flex flex-col gap-2">
      {results.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No locations detected in these emails.
        </p>
      )}
      {results.map((item) => (
        <div
          key={item.id}
          className="border-border flex items-center justify-between border-b py-2 last:border-b-0"
        >
          <div>
            <p className="text-sm font-medium">{item.subject || '(no subject)'}</p>
            <p className="text-muted-foreground text-xs">
              {item.places.length > 0 && item.places.join(', ')}
              {item.pincodes.length > 0 &&
                (item.places.length > 0 ? ' · ' : '') +
                  item.pincodes.join(', ')}
            </p>
          </div>
          {item.hasLocation && (
            <Badge variant="info" className="shrink-0">
              <Mail className="mr-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}
