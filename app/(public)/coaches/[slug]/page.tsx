'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { ProtectedLink } from '@/components/auth/protected-link';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getCoach } from '@/lib/api/coaches';
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed';
import type { Coach } from '@/types/domain/coach';
import Link from 'next/link';
import { AlertTriangle, Phone, Mail, ArrowLeft } from 'lucide-react';
import { CoachDetailSkeleton } from '@/components/feedback/skeletons';

export default function CoachDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [coach, setCoach] = React.useState<Coach | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { addView } = useRecentlyViewed();

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getCoach(slug);
      if (cancelled) return;
      if (res.ok) {
        setCoach(res.data);
        addView({ id: res.data.id, slug: res.data.slug, type: 'coach', name: res.data.name });
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [slug, addView]);

  if (loading) {
    return (
      <Section>
        <Container>
          <CoachDetailSkeleton />
        </Container>
      </Section>
    );
  }

  if (error || !coach) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive/40" />
            <div>
              <h2 className="text-xl font-semibold">Coach not found</h2>
              <p className="text-sm text-muted-foreground mt-1">{error || 'This coach may have been removed.'}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/coaches">Browse coaches</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Coaches', href: '/coaches' },
            { label: coach.name },
          ]}
          className="mb-3"
        />
        <Button asChild variant="ghost" className="mb-3 -ml-2 min-h-[44px]">
          <Link href="/coaches"><ArrowLeft className="h-4 w-4 mr-1" /> Back to coaches</Link>
        </Button>
        <Card className="overflow-hidden">
          <div className="bg-muted/40 relative h-48 w-full overflow-hidden md:h-56 lg:h-64 xl:h-72">
            <ImageWithFallback
              src={coach.avatar ?? `/images/coaches/${coach.slug}.svg`}
              alt={`${coach.name} cover image`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{coach.name}</CardTitle>
              <VerifiedBadge status={coach.verificationStatus} />
            </div>
            <CardDescription>
              {coach.location.city} · {coach.experienceYears}+ yrs experience
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-pretty">
              Specialisation: {(coach.specialization ?? []).join(', ')}.
            </p>
            <div className="flex flex-wrap gap-1">
              {(coach.sportsCoached ?? []).map((sport) => (
                <Badge key={sport} variant="secondary" className="text-xs">
                  {sport}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              <Button asChild size="lg">
                <ProtectedLink href={`/enquiry/coach/${coach.slug}`}>Request callback</ProtectedLink>
              </Button>
              <ShortlistToggle
                itemType="coach"
                itemId={coach.id}
                label={coach.name}
                sublabel={`${coach.location.city} · ${coach.experienceYears}+ yrs`}
                href={`/coaches/${coach.slug}`}
                labelText="Save"
              />
              <CompareButton
                entityType="coach"
                slug={coach.slug}
                label={coach.name}
                sublabel={`${coach.location.city} · ${coach.experienceYears}+ yrs`}
                href={`/coaches/${coach.slug}`}
              />
            </div>
          </CardContent>
        </Card>

        {(coach.contact.phone || coach.contact.email) && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {coach.contact.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${coach.contact.phone}`} className="text-foreground hover:underline">
                      {coach.contact.phone}
                    </a>
                  </div>
                )}
                {coach.contact.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${coach.contact.email}`} className="text-foreground hover:underline">
                      {coach.contact.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Certifications, awards, and career milestones</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {(coach.certifications ?? []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Certifications</h3>
                  <ul className="space-y-2">
                    {(coach.certifications ?? []).map((cert, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        <div>
                          <span className="text-foreground font-medium">{cert.name}</span>
                          <span className="ml-1">— {cert.issuer} ({cert.year})</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Experience Milestones</h3>
                <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <span className="font-semibold">{coach.experienceYears}+ years</span>
                  <span className="text-muted-foreground ml-1">of coaching experience</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
