'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMyCoach } from '@/lib/api/coaches';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { MapPin, Pencil, Phone, Mail, Star, Shield, Clock, Award } from 'lucide-react';
import type { Coach } from '@/types/domain/coach';

function getSportName(slug: string): string {
  return sportTaxonomy.find((s) => s.slug === slug)?.name ?? slug;
}

export default function CoachProfilePage() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyCoach();
        if (!cancelled) {
          if (res.ok && res.data) {
            setCoach(res.data);
          } else {
            setError('No coach profile found. Create one during onboarding.');
          }
        }
      } catch {
        if (!cancelled) setError('Failed to load coach profile.');
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
          <div className="text-muted-foreground text-sm">Loading coach profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !coach) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-3">
            <p className="text-sm font-medium">{error ?? 'No coach profile found'}</p>
            <p className="text-muted-foreground text-xs">
              Complete onboarding as a coach to create your profile.
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
              <CardTitle>{coach.name}</CardTitle>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {coach.location.city}, {coach.location.state}
              </p>
            </div>
            <Link href="/profile/coach/edit" prefetch={false}>
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
            <Badge variant={coach.verificationStatus === 'verified' ? 'default' : 'secondary'} className="text-xs capitalize">
              {coach.verificationStatus}
            </Badge>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {coach.status}
            </span>
          </div>

          {/* Rating */}
          {coach.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">{coach.rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs">({coach.rating.count} reviews)</span>
            </div>
          )}

          {/* Experience */}
          {coach.experienceYears > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>{coach.experienceYears} years of experience</span>
            </div>
          )}

          {/* Bio */}
          {coach.bio && (
            <p className="text-sm text-muted-foreground">{coach.bio}</p>
          )}

          {/* Sports */}
          {coach.sportsCoached.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Sports Coached</p>
              <div className="flex flex-wrap gap-1.5">
                {coach.sportsCoached.map((slug) => (
                  <Badge key={slug} variant="secondary" className="text-xs">
                    {getSportName(slug)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Specialization */}
          {coach.specialization.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Specialization</p>
              <div className="flex flex-wrap gap-1.5">
                {coach.specialization.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">
                    {getSportName(s)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {coach.certifications.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Certifications</p>
              <div className="flex flex-col gap-1">
                {coach.certifications.map((c, i) => (
                  <span key={i} className="text-sm">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            {coach.contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{coach.contact.phone}</span>
              </div>
            )}
            {coach.contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{coach.contact.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
