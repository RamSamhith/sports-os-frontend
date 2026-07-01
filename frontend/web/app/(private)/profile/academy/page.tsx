'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMyAcademy } from '@/lib/api/academies';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { MapPin, Pencil, Phone, Mail, Globe, Star, Shield, Clock } from 'lucide-react';
import type { Academy } from '@/types/domain/academy';

function getSportName(slug: string): string {
  return sportTaxonomy.find((s) => s.slug === slug)?.name ?? slug;
}

export default function AcademyProfilePage() {
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyAcademy();
        if (!cancelled) {
          if (res.ok && res.data) {
            setAcademy(res.data);
          } else {
            setError('No academy found. Create one during onboarding.');
          }
        }
      } catch {
        if (!cancelled) setError('Failed to load academy profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground text-sm">Loading academy profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !academy) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-3">
            <p className="text-sm font-medium">{error ?? 'No academy found'}</p>
            <p className="text-muted-foreground text-xs">
              Complete onboarding as an academy owner to create your profile.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{academy.name}</CardTitle>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {academy.location.city}, {academy.location.state}
              </p>
            </div>
            <Link href="/profile/academy/edit" prefetch={false}>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Verification Status */}
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Badge variant={academy.verificationStatus === 'verified' ? 'default' : 'secondary'} className="text-xs capitalize">
              {academy.verificationStatus}
            </Badge>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {academy.status}
            </span>
          </div>

          {/* Rating */}
          {academy.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">{academy.rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs">({academy.rating.count} reviews)</span>
            </div>
          )}

          {/* Description */}
          {academy.description && (
            <p className="text-sm text-muted-foreground">{academy.description}</p>
          )}

          {/* Sports Offered */}
          {academy.sportsOffered.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Sports Offered</p>
              <div className="flex flex-wrap gap-1.5">
                {academy.sportsOffered.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {academy.facilities.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Facilities</p>
              <div className="flex flex-wrap gap-1.5">
                {academy.facilities.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs capitalize">
                    {f.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Training Levels */}
          {academy.trainingLevels.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Training Levels</p>
              <div className="flex flex-wrap gap-1.5">
                {academy.trainingLevels.map((l) => (
                  <Badge key={l} variant="outline" className="text-xs capitalize">
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            {academy.contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{academy.contact.phone}</span>
              </div>
            )}
            {academy.contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{academy.contact.email}</span>
              </div>
            )}
            {academy.contact.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <a href={academy.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {academy.contact.website}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
