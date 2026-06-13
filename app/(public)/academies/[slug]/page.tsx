'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { AcademyInfo } from '@/components/academy/academy-info';
import { LocationMap } from '@/components/academy/location-map';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { fixtureImages } from '@/lib/images';
import { getAcademy } from '@/lib/api/academies';
import type { Academy } from '@/types/domain/academy';
import Link from 'next/link';
import { Globe, Mail, Phone, Loader2, AlertTriangle } from 'lucide-react';

export default function AcademyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [academy, setAcademy] = React.useState<Academy | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getAcademy(slug);
      if (cancelled) return;
      if (res.ok) {
        setAcademy(res.data);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading academy…</span>
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !academy) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive/40" />
            <div>
              <h2 className="text-xl font-semibold">Academy not found</h2>
              <p className="text-sm text-muted-foreground mt-1">{error || 'This academy may have been removed.'}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/academies">Browse academies</Link>
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
            { label: 'Academies', href: '/academies' },
            { label: academy.name },
          ]}
          className="mb-4"
        />
        <Card>
          <div className="bg-muted/40 relative h-48 w-full overflow-hidden md:h-56 lg:h-64 xl:h-72">
            <ImageWithFallback
              src={academy.coverImage ?? fixtureImages.academies[academy.id]}
              alt={`${academy.name} cover image`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{academy.name}</CardTitle>
              <VerifiedBadge status={academy.verificationStatus} />
            </div>
            <CardDescription>
              {academy.location.city}, {academy.location.state}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-pretty">{academy.description}</p>
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <LastUpdated at={academy.lastUpdatedAt || academy.createdAt} />
              <CertificationIndicator count={academy.certifications.length} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              <Button asChild size="lg">
                <Link href={`/enquiry/academy/${academy.slug}`}>Request Trial</Link>
              </Button>
              <ShortlistToggle
                itemType="academy"
                itemId={academy.id}
                label={academy.name}
                sublabel={`${academy.location.city}, ${academy.location.state}`}
                href={`/academies/${academy.slug}`}
                labelText="Save"
              />
              <CompareButton
                entityType="academy"
                id={academy.id}
                label={academy.name}
                sublabel={`${academy.location.city}, ${academy.location.state}`}
                href={`/academies/${academy.slug}`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <AcademyInfo
                address={academy.location.address}
                city={academy.location.city}
                state={academy.location.state}
                country={academy.location.country}
                sportsOffered={academy.sportsOffered}
                website={academy.contact.website}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Contact</h2>
                <div className="grid gap-2 text-sm">
                  {academy.contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a href={`tel:${academy.contact.phone}`} className="text-primary hover:underline">
                        {academy.contact.phone}
                      </a>
                    </div>
                  )}
                  {academy.contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a href={`mailto:${academy.contact.email}`} className="text-primary hover:underline line-clamp-1">
                        {academy.contact.email}
                      </a>
                    </div>
                  )}
                  {academy.contact.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a
                        href={academy.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline line-clamp-1"
                      >
                        {academy.contact.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Championships, awards, and notable milestones</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                (() => {
                  const a = academy.achievementSignals
                  const hasContent = a && (
                    a.competitionParticipations.length > 0 ||
                    a.milestones.length > 0 ||
                    a.stateAthletesProduced > 0 ||
                    a.nationalAthletesProduced > 0
                  )
                  return hasContent ? (
                    <>
                      {a!.competitionParticipations.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Championships & Competitions</h3>
                          <ul className="space-y-1">
                            {a!.competitionParticipations.map((comp) => (
                              <li key={comp} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                {comp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {a!.milestones.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Awards & Milestones</h3>
                          <ul className="space-y-1">
                            {a!.milestones.map((m) => (
                              <li key={m} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(a!.stateAthletesProduced > 0 || a!.nationalAthletesProduced > 0) && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Notable Alumni</h3>
                          <div className="flex flex-wrap gap-3">
                            {a!.stateAthletesProduced > 0 && (
                              <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                                <span className="font-semibold">{a!.stateAthletesProduced}</span>
                                <span className="text-muted-foreground ml-1">State-level athletes produced</span>
                              </div>
                            )}
                            {a!.nationalAthletesProduced > 0 && (
                              <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                                <span className="font-semibold">{a!.nationalAthletesProduced}</span>
                                <span className="text-muted-foreground ml-1">National-level athletes produced</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : null
                })()
              }
              {academy.createdAt && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Years Operating</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.max(1, new Date().getFullYear() - new Date(academy.createdAt).getFullYear())} years
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <LocationMap
            lat={academy.location.lat}
            lng={academy.location.lng}
            label={academy.name}
            className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px]"
          />
        </div>
      </Container>
    </Section>
  );
}
